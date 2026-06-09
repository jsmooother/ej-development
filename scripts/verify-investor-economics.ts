/**
 * Asserts Villa Elysia investor economics match agreed assumptions.
 * Run: npx tsx scripts/verify-investor-economics.ts
 */
import {
  buildSponsorCommitment,
  computeBrokerSaleFee,
  computeConstructionCost,
  computeIndicativeGdv,
  computeNetMargin,
  computeTotalFunding,
  villaElysiaEconomicsInputs,
} from "../src/lib/investor-economics";
import {
  preliminaryBudget,
  preliminaryRevenue,
  sponsorCommitment,
  villaElysiaBuiltAreaSqm,
} from "../src/data/investor-data";

const expected = {
  builtAreaSqm: 947,
  plotAcquisition: 1_000_000,
  amesDesign: 300_000,
  capitalCommitted: 1_300_000,
  constructionRate: 5_250,
  constructionCost: 4_971_750,
  totalFunding: 6_076_072,
  gdv: 10_890_500,
  brokerFee: 653_430,
  projectMargin: 2_553_391,
} as const;

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
assertEq("total funding", computeTotalFunding(expected.constructionRate), expected.totalFunding);
assertEq("GDV", computeIndicativeGdv(), expected.gdv);
assertEq("broker fee", computeBrokerSaleFee(), expected.brokerFee);
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
assertIncludes("revenue GDV", preliminaryRevenue[0]!.amount, "10,890,500");
assertIncludes("revenue GDV note", preliminaryRevenue[0]!.note ?? "", "947 m²");

if (process.exitCode) {
  console.error("\nInvestor economics verification failed.");
  process.exit(1);
}
console.log("\nAll investor economics checks passed.");
