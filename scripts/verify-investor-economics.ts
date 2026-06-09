/**
 * Asserts Villa Elysia investor economics match agreed assumptions.
 * Run: npx tsx scripts/verify-investor-economics.ts
 */
import fs from "fs";
import path from "path";
import {
  buildCostSensitivityRows,
  buildFinancingSensitivityRows,
  buildSponsorCommitment,
  computeBrokerSaleFee,
  computeConstructionCost,
  computeIndicativeGdv,
  computeNetMargin,
  computeNetSaleProceeds,
  computePermitAllowance,
  computeTotalFunding,
  villaElysiaEconomicsInputs,
} from "../src/lib/investor-economics";
import {
  marketComps,
  preliminaryBudget,
  preliminaryRevenue,
  sponsorCommitment,
  villaElysiaAmesClosedBuilt,
  villaElysiaBuiltAreaSqm,
  villaElysiaExternalElements,
  villaElysiaFloorBreakdown,
} from "../src/data/investor-data";

const expected = {
  builtAreaSqm: 947,
  plotAcquisition: 1_000_000,
  amesDesign: 300_000,
  capitalCommitted: 1_300_000,
  constructionRate: 5_250,
  constructionCost: 4_971_750,
  permitAllowance: 119_322,
  totalFunding: 6_076_072,
  gdv: 10_890_500,
  brokerFee: 653_430,
  netSaleProceeds: 10_237_070,
  projectMargin: 2_553_391,
} as const;

const stalePatterns = [
  /\b803\s*m²/,
  /\b757\s*m²/,
  /€700,000/,
  /700,000/,
  /€4,573,000/,
  /€9,234,500/,
  /€3,453,000/,
  /803 ×/,
  /947 × €4,300/,
];

function assertEq(label: string, actual: number, expectedVal: number, tolerance = 0) {
  const ok = Math.abs(actual - expectedVal) <= tolerance;
  if (!ok) {
    console.error(`FAIL ${label}: got ${actual}, expected ${expectedVal}`);
    process.exitCode = 1;
  } else {
    console.log(`OK   ${label}: ${actual.toLocaleString("en-GB")}`);
  }
}

function assertIncludes(label: string, haystack: string, needle: string) {
  if (!haystack.includes(needle)) {
    console.error(`FAIL ${label}: "${haystack}" missing "${needle}"`);
    process.exitCode = 1;
  } else {
    console.log(`OK   ${label}: contains "${needle}"`);
  }
}

const inputs = villaElysiaEconomicsInputs;
assertEq("built area", inputs.builtAreaSqm, expected.builtAreaSqm);
assertEq("plot acquisition", inputs.plotAcquisitionCost, expected.plotAcquisition);
assertEq("AMES design", inputs.amesArchitectureDesignCost, expected.amesDesign);
assertEq(
  "capital committed",
  inputs.plotAcquisitionCost + inputs.amesArchitectureDesignCost,
  expected.capitalCommitted
);
assertEq("construction cost", computeConstructionCost(expected.constructionRate), expected.constructionCost);
assertEq(
  "permit allowance",
  computePermitAllowance(expected.constructionCost),
  expected.permitAllowance
);
assertEq("total funding", computeTotalFunding(expected.constructionRate), expected.totalFunding);
assertEq("GDV", computeIndicativeGdv(), expected.gdv);
assertEq("broker fee", computeBrokerSaleFee(), expected.brokerFee);
assertEq("net sale proceeds", computeNetSaleProceeds(), expected.netSaleProceeds);
assertEq(
  "project margin @ 10%",
  Math.round(computeNetMargin(expected.constructionRate, 0.1)),
  expected.projectMargin
);
assertEq("built area export", villaElysiaBuiltAreaSqm, expected.builtAreaSqm);

const derived = buildSponsorCommitment();
assertIncludes("sponsor plot", derived[0]!.amount, "1,000,000");
assertIncludes("sponsor AMES", derived[1]!.amount, "300,000");
assertIncludes("sponsor total", derived[2]!.amount, "1,300,000");
assertIncludes("data sponsor plot", sponsorCommitment[0]!.amount, "1,000,000");
assertIncludes("data sponsor total", sponsorCommitment[2]!.amount, "1,300,000");
assertIncludes("budget construction", preliminaryBudget[0]!.note, "947 m²");
assertIncludes("budget construction", preliminaryBudget[0]!.note, "5,250");
assertIncludes("budget construction amount", preliminaryBudget[0]!.amount, "4,971,750");
assertIncludes("budget total funding", preliminaryBudget.find((r) => r.bold)!.amount, "6,076,072");
assertIncludes("revenue GDV", preliminaryRevenue[0]!.amount, "10,890,500");
assertIncludes("revenue GDV note", preliminaryRevenue[0]!.note ?? "", "947 m²");
assertIncludes("revenue broker", preliminaryRevenue[1]!.amount, "653,430");
assertIncludes(
  "revenue margin",
  preliminaryRevenue.find((r) => r.line.includes("margin"))!.amount,
  "2,553,391"
);

const workingCostRow = buildCostSensitivityRows().find((r) => r.isWorkingCase)!;
assertEq("sensitivity working total funding", workingCostRow.totalFunding, expected.totalFunding);
assertEq(
  "sensitivity working net margin",
  Math.round(workingCostRow.netMargin),
  expected.projectMargin
);

const workingFinRow = buildFinancingSensitivityRows().find((r) => r.isWorkingCase)!;
assertEq(
  "financing working net margin",
  Math.round(workingFinRow.netMargin),
  expected.projectMargin
);

const insideTotal = villaElysiaFloorBreakdown
  .filter((r) => !r.isTotal)
  .reduce((sum, r) => sum + Number.parseInt(r.insideSqm.replace(/,/g, ""), 10), 0);
const closedTotal = villaElysiaAmesClosedBuilt
  .filter((r) => !r.bold)
  .reduce((sum, r) => sum + Number.parseInt(r.sqm.replace(/,/g, ""), 10), 0);
const externalTotal = villaElysiaExternalElements
  .filter((r) => !r.bold)
  .reduce((sum, r) => sum + Number.parseInt(r.sqm.replace(/,/g, ""), 10), 0);
assertEq("floor inside total", insideTotal, expected.builtAreaSqm);
assertEq("closed built total", closedTotal, expected.builtAreaSqm);
assertEq("external elements total", externalTotal, 605);

for (const comp of marketComps) {
  if ("subject" in comp && comp.subject) {
    assertEq("subject comp eurPerSqm", comp.eurPerSqm, expected.gdv / expected.builtAreaSqm);
  }
}

const investorComponentDir = path.join(process.cwd(), "src/components/investor");
for (const file of fs.readdirSync(investorComponentDir)) {
  if (!file.endsWith(".tsx")) continue;
  const content = fs.readFileSync(path.join(investorComponentDir, file), "utf-8");
  for (const pattern of stalePatterns) {
    if (pattern.test(content)) {
      console.error(`FAIL stale pattern ${pattern} in src/components/investor/${file}`);
      process.exitCode = 1;
    }
  }
}

if (process.exitCode) {
  console.error("\nInvestor economics verification failed.");
  process.exit(1);
}
console.log("\nAll investor economics checks passed.");
