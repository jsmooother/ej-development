/**
 * Investor portal data – working assumptions (preliminary, subject to refinement).
 * EJ Properties · Villa Elysia (El Madroñal) · Construction funding opportunity.
 */

import {
  buildCostSensitivityRows,
  buildFinancingSensitivityRows,
  buildSponsorCommitment,
  computeConstructionCost,
  computeBrokerSaleFee,
  computeIndicativeGdv,
  computeNetMargin,
  computeNetSaleProceeds,
  computePermitAllowance,
  computeTotalFunding,
  formatInvestorEur,
  investorEconomicsModelNotes,
  villaElysiaEconomicsInputs,
} from "@/lib/investor-economics";

export {
  buildCostSensitivityRows,
  buildFinancingSensitivityRows,
  investorEconomicsModelNotes,
  villaElysiaEconomicsInputs,
};

/** Self-hosted investor hero background (Supabase Storage · media bucket) */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nxsjccgwmpypyrzkjilz.supabase.co";
export const investorHeroVideoSrc = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/media/investor/elysia/hero.mp4?v=20260522`;
/** Shown while the hero MP4 buffers; same frame as the film opening. */
export const investorHeroPosterSrc = "/investor/elysia/Madronal%206%20-%20overview.jpg";

/** Paths for layout routing (context map only in #why; house renders hero on #site) */
export const villaElysiaContextMapSrc =
  "/investor/elysia/Madronal%206%20-%20overview.jpg" as const;
/** Bump `v` when replacing hero JPEGs so browsers and CDNs fetch the new file (public URLs are not hashed). */
export const villaElysiaHouseRender1Src =
  "/investor/elysia/house-render-1.jpg?v=20250410b" as const;
export const villaElysiaHouseRender2Src =
  "/investor/elysia/house-render-2.jpg?v=20250410b" as const;

/** Bump `v` when replacing plan PNGs so browsers and CDNs fetch the new file. */
export const villaElysiaPlanEntranceSrc =
  "/investor/elysia/plan-entrance.png?v=20260609b" as const;
export const villaElysiaPlanGroundSrc =
  "/investor/elysia/plan-ground.png?v=20260609b" as const;
export const villaElysiaPlanFirstSrc =
  "/investor/elysia/plan-first.png?v=20260609b" as const;

/** Cadastral / survey rounded plot area (3,037.85 m²) */
export const villaElysiaPlotSqm = 3_038;
/** AMES Scheme 2 · June 2026 cost schedule denominator */
export const villaElysiaBuiltAreaSqm = villaElysiaEconomicsInputs.builtAreaSqm;
/** Mid-range construction estimate (€5,000–€5,500/m² band) pending geotechnical study */
export const villaElysiaConstructionRatePerSqm =
  villaElysiaEconomicsInputs.workingConstructionRatePerSqm;
export const villaElysiaSaleRatePerSqm = villaElysiaEconomicsInputs.saleRatePerSqm;

export const villaElysiaConstructionCost = computeConstructionCost(
  villaElysiaConstructionRatePerSqm
);
export const villaElysiaPermitAllowance = computePermitAllowance(villaElysiaConstructionCost);
export const villaElysiaAdminOverhead = villaElysiaEconomicsInputs.adminOverhead;
export const villaElysiaFfeAllowance = villaElysiaEconomicsInputs.ffeAllowance;
export const villaElysiaSoftCosts = villaElysiaEconomicsInputs.softCosts;
export const villaElysiaTotalFundingSought = computeTotalFunding(
  villaElysiaConstructionRatePerSqm
);
export const villaElysiaIndicativeGdv = computeIndicativeGdv();
export const villaElysiaBrokerSaleFee = computeBrokerSaleFee();
export const villaElysiaNetSaleProceeds = computeNetSaleProceeds();
/** Drawdown-based financing at working rate over 24 months */
export const villaElysiaProjectMargin = computeNetMargin(
  villaElysiaConstructionRatePerSqm,
  villaElysiaEconomicsInputs.workingFinancingRate
);

/** Full-width site hero carousel (#site): house renders */
export const sitePlanningHeroCarouselSlides = [
  {
    key: "house-1",
    src: villaElysiaHouseRender1Src,
    alt: "Villa Elysia · Exterior · Forest setting and three terraced levels",
    caption: "Render · Massing in the landscape · Arrival, living, and upper level",
    objectFit: "cover" as const,
  },
  {
    key: "house-2",
    src: villaElysiaHouseRender2Src,
    alt: "Villa Elysia · Terrace, pool, and sea view · Indoor–outdoor living",
    caption: "Render · Terrace, infinity pool, and panoramic coastal view",
    objectFit: "cover" as const,
  },
] as const;

/** AMES Mar 2026 — presentation imagery under public/investor/elysia/ */
export const villaElysiaImages = [
  {
    src: villaElysiaContextMapSrc,
    alt: "Villa Elysia · Site context, solar orientation, sea and landmarks",
    caption: "Context · Plot, sun path, and coastal orientation",
  },
  {
    src: villaElysiaHouseRender1Src,
    alt: "Villa Elysia · Exterior · Forest setting and three terraced levels",
    caption: "Render · Massing in the landscape · Arrival, living, and upper level",
  },
  {
    src: villaElysiaHouseRender2Src,
    alt: "Villa Elysia · Terrace, pool, and sea view · Indoor–outdoor living",
    caption: "Render · Terrace, infinity pool, and panoramic coastal view",
  },
  {
    src: villaElysiaPlanEntranceSrc,
    alt: "Villa Elysia · Entrance level plan and area schedule",
    caption: "Entrance level · Garage, spa, cinema, gym, and arrival court",
  },
  {
    src: villaElysiaPlanGroundSrc,
    alt: "Villa Elysia · Ground floor plan and area schedule",
    caption: "Ground floor · Living, pool, gazebo, terrace, and guest suite",
  },
  {
    src: villaElysiaPlanFirstSrc,
    alt: "Villa Elysia · First floor plan and area schedule",
    caption: "First floor · Master suite and guest bedrooms",
  },
] as const;

export const villaElysiaFloorPlans = [
  {
    src: villaElysiaPlanEntranceSrc,
    alt: "Villa Elysia · Entrance level · AMES working drawing June 2026",
    caption: "Entrance level",
  },
  {
    src: villaElysiaPlanGroundSrc,
    alt: "Villa Elysia · Ground floor · AMES working drawing June 2026",
    caption: "Ground floor",
  },
  {
    src: villaElysiaPlanFirstSrc,
    alt: "Villa Elysia · First floor · AMES working drawing June 2026",
    caption: "First floor",
  },
] as const;

function formatAreaSqm(n: number): string {
  return n.toLocaleString("en-GB");
}

/** Per-level “In” / “Out” from AMES Scheme 2 room schedules (June 2026). */
const villaElysiaFloorLevels = [
  { level: "Entrance level", insideSqm: 330, outsideSqm: 134 },
  { level: "Ground floor", insideSqm: 362, outsideSqm: 349 },
  { level: "First floor", insideSqm: 255, outsideSqm: 122 },
] as const;

const villaElysiaFloorInsideTotalSqm = villaElysiaFloorLevels.reduce(
  (sum, row) => sum + row.insideSqm,
  0
);
const villaElysiaFloorOutsideTotalSqm = villaElysiaFloorLevels.reduce(
  (sum, row) => sum + row.outsideSqm,
  0
);

/** Rounded from AMES Scheme 2 room schedules (June 2026); “In” sums to closed built (947 m²). */
export const villaElysiaFloorBreakdown = [
  ...villaElysiaFloorLevels.map((row) => ({
    level: row.level,
    insideSqm: formatAreaSqm(row.insideSqm),
    outsideSqm: formatAreaSqm(row.outsideSqm),
    totalSqm: formatAreaSqm(row.insideSqm + row.outsideSqm),
    isTotal: false as const,
  })),
  {
    level: "Total",
    insideSqm: formatAreaSqm(villaElysiaFloorInsideTotalSqm),
    outsideSqm: formatAreaSqm(villaElysiaFloorOutsideTotalSqm),
    totalSqm: formatAreaSqm(villaElysiaFloorInsideTotalSqm + villaElysiaFloorOutsideTotalSqm),
    isTotal: true as const,
  },
] as const;

/**
 * Built area per AMES cost schedule (Scheme 2): 947 m² closed built.
 */
export const villaElysiaAmesClosedBuilt = [
  {
    line: "Closed built (ground + first)",
    sqm: formatAreaSqm(villaElysiaFloorLevels[1].insideSqm + villaElysiaFloorLevels[2].insideSqm),
    bold: false,
  },
  {
    line: "Closed built (entrance / basement)",
    sqm: formatAreaSqm(villaElysiaFloorLevels[0].insideSqm),
    bold: false,
  },
  {
    line: "Total built area",
    sqm: formatAreaSqm(villaElysiaFloorInsideTotalSqm),
    bold: true,
  },
] as const;

const villaElysiaExternalElementRows = [
  { element: "Porches", sqm: 148 },
  { element: "Terraces", sqm: 132 },
  { element: "Road access", sqm: 120 },
  { element: "Pool", sqm: 86 },
  { element: "Gazebo", sqm: 79 },
  { element: "Garden", sqm: 40 },
] as const;

const villaElysiaExternalElementsTotalSqm = villaElysiaExternalElementRows.reduce(
  (sum, row) => sum + row.sqm,
  0
);

/** Element breakdown sums to floor “Out” total (605 m²) */
export const villaElysiaExternalElements = [
  ...villaElysiaExternalElementRows.map((row) => ({
    element: row.element,
    sqm: formatAreaSqm(row.sqm),
    bold: false as const,
  })),
  {
    element: "Total external",
    sqm: formatAreaSqm(villaElysiaExternalElementsTotalSqm),
    bold: true as const,
  },
] as const;

export const villaElysiaAreaFootnotes = [
  "Floor schedules from AMES Scheme 2 working drawings (June 2026).",
  `Built area of ${villaElysiaBuiltAreaSqm} m² is the denominator used in the architect construction cost estimate (Scheme 2).`,
  "Construction €/m² is a mid-range working assumption (€5,250/m²) between AMES Option 3 (€5,053) and Option 4 (€4,707), pending geotechnical study.",
  `External elements are rounded to sum to the floor “Out” total (${formatAreaSqm(villaElysiaFloorOutsideTotalSqm)} m²).`,
] as const;

export const executiveSummary = [
  { label: "Project owner", value: "EJ Properties" },
  { label: "Project", value: "Villa Elysia" },
  { label: "Location", value: "El Madroñal, Benahavís" },
  { label: "Plot", value: `${villaElysiaPlotSqm.toLocaleString("en-GB")} m²` },
  {
    label: "Built area",
    value: `${villaElysiaBuiltAreaSqm} m²`,
  },
  { label: "Architect", value: "AMES Arquitectos" },
  { label: "Funded to date", value: "Plot and design fully funded" },
  { label: "External capital need", value: "Construction funding" },
  { label: "Expected exit", value: "Sale of completed villa" },
] as const;

export const sponsorCommitment = buildSponsorCommitment();

export const preliminaryBudget = [
  {
    line: "Construction",
    amount: formatInvestorEur(villaElysiaConstructionCost),
    note: `${villaElysiaBuiltAreaSqm} m² × €${villaElysiaConstructionRatePerSqm.toLocaleString("en-GB")}/m² · mid-range estimate (AMES Options 3–4 band pending geotech)`,
    bold: false,
  },
  { line: "Admin / project overhead", amount: formatInvestorEur(villaElysiaAdminOverhead), note: "", bold: false },
  {
    line: "Kitchens, FF&E & equipment",
    amount: formatInvestorEur(villaElysiaFfeAllowance),
    note: "Main kitchen, staff kitchen, outdoor kitchen, gym appliances, beds, TVs, furniture",
    bold: false,
  },
  {
    line: "Permit taxes / fees",
    amount: formatInvestorEur(villaElysiaPermitAllowance),
    note: "Indicative: Benahavís ICIO c. 2.4% on declared material execution budget (ordenanza fiscal, 2024+) plus municipal licence / processing fees and related filings—confirm with architect & ayuntamiento",
    bold: false,
  },
  {
    line: "Additional soft costs / sales",
    amount: formatInvestorEur(villaElysiaSoftCosts),
    note: "Indicative: construction-phase legal, all-risk site insurance, survey / geotech supplements, photography & pre-sale marketing (broker success fee at exit modelled separately at 6% of GDV)",
    bold: false,
  },
  {
    line: "Total funding sought",
    amount: formatInvestorEur(villaElysiaTotalFundingSought),
    note: "Indicative subtotal—permits & soft costs subject to verification",
    bold: true,
  },
] as const;

export const fundingMilestones = [
  { milestone: "Milestone 1", description: "TBC", amount: "TBC", note: "" },
  { milestone: "Milestone 2", description: "TBC", amount: "TBC", note: "" },
  { milestone: "Milestone 3", description: "TBC", amount: "TBC", note: "" },
  { milestone: "Milestone 4", description: "TBC", amount: "TBC", note: "" },
] as const;

export const preliminaryRevenue = [
  {
    line: "Indicative sales value (GDV)",
    amount: formatInvestorEur(villaElysiaIndicativeGdv),
    note: `€${villaElysiaSaleRatePerSqm.toLocaleString("en-GB")}/m² × ${villaElysiaBuiltAreaSqm} m²`,
    bold: false,
  },
  {
    line: "Broker success fee (at exit)",
    amount: `−${formatInvestorEur(villaElysiaBrokerSaleFee)}`,
    note: `${villaElysiaEconomicsInputs.brokerSaleFeeRate * 100}% of GDV · Homerun, Solvilla etc. · negotiable (typical 5–6%)`,
    bold: false,
  },
  {
    line: "Net sale proceeds",
    amount: formatInvestorEur(villaElysiaNetSaleProceeds),
    note: "After broker commission at exit",
    bold: true,
  },
  {
    line: "Pricing basis",
    amount: "Comparable AMES-houses",
    note: "premium basement spa program supports €/m² at upper comp range",
    bold: false,
  },
  {
    line: "Project margin (conservative)",
    amount: formatInvestorEur(Math.round(villaElysiaProjectMargin)),
    note: `Net proceeds − plot (€1.0m) − total funding − drawdown financing at 10% p.a. over 24 months on ~${formatInvestorEur(villaElysiaTotalFundingSought)} peak (~50% average outstanding)`,
    bold: true,
  },
] as const;

export const fundingStructures = [
  {
    title: "Senior-style private construction funding",
    items: [
      "Target: up to full construction cost funding",
      "Indicative pricing: around 10% fixed return / interest",
      "No equity participation",
    ],
  },
  {
    title: "Hybrid structure",
    items: [
      "Indicative hurdle: 2% fixed coupon on drawn capital",
      "Plus 15–20% equity kicker on net profit after all costs (see sensitivity waterfall)",
      "Alternative mid-coupon structures (3–5%) negotiable with lighter or no kicker",
    ],
  },
] as const;

export const keyRisks = [
  {
    risk: "Topography & retaining scope",
    why: "Cost and programme impact; site-specific",
    mitigation: "Geotech + structural concept; staged earthworks; contingency",
  },
  {
    risk: "Vegetation / tree constraints",
    why: "Clearance cost; permissions; redesign risk",
    mitigation: "Arborist survey; landscape strategy; protected species checks",
  },
  {
    risk: "Permit duration",
    why: "Time to finance cost; IRR sensitivity",
    mitigation: "Pre-consultation; compliance matrix; staged submissions",
  },
  {
    risk: "Cost inflation / cost certainty",
    why: "Margin compression",
    mitigation: "Long-lead locks; index tracking; design freeze gates",
  },
  {
    risk: "Funding close timing",
    why: "Project sequencing",
    mitigation: "Multiple funding tracks; staged close",
  },
  {
    risk: "Market pricing / exit execution",
    why: "Revenue lever",
    mitigation: "Broker-led marketing; comp pack; differentiated product",
  },
] as const;

export const executionPhases = [
  { phase: "Design development", status: "In progress", estimatedDelivery: "TBC" },
  { phase: "Permit / licensing", status: "Pending", estimatedDelivery: "TBC" },
  { phase: "Funding close", status: "Pending", estimatedDelivery: "TBC" },
  { phase: "Construction", status: "Pending", estimatedDelivery: "TBC" },
  { phase: "Sales launch / broker marketing", status: "Pending", estimatedDelivery: "TBC" },
  { phase: "Exit", status: "Pending", estimatedDelivery: "TBC" },
] as const;

/** Numeric €/m² for averages; `subject` rows excluded from `marketCompsListedAvgEurPerSqm` */
const marketCompsData = [
  {
    name: "Villa Elysia",
    location: "El Madroñal",
    price: formatInvestorEur(villaElysiaIndicativeGdv),
    build: `${villaElysiaBuiltAreaSqm} m²`,
    pricePerSqm: `€${villaElysiaSaleRatePerSqm.toLocaleString("en-GB")}/m²`,
    url: "",
    subject: true as const,
    primeComp: false,
    note: `This project · indicative GDV · €${villaElysiaSaleRatePerSqm.toLocaleString("en-GB")}/m² × ${villaElysiaBuiltAreaSqm} m² · not a live listing`,
    eurPerSqm: villaElysiaSaleRatePerSqm,
  },
  {
    name: "Casa de Canto",
    location: "El Madroñal",
    price: "€11,500,000",
    build: "1,175 m²",
    pricePerSqm: "€9,787/m²",
    url: "https://3saestate.com/listings/casa-de-canto/",
    primeComp: true,
    note: "AMES Arquitectos · 3SA Estate asking price · living area per listing",
    eurPerSqm: Math.round(11_500_000 / 1175),
  },
  {
    name: "Villa Mio",
    location: "El Madroñal",
    price: "€11,500,000",
    build: "1,028 m²",
    pricePerSqm: "€11,186/m²",
    url: "https://www.homerunmarbella.com/properties/el-madronal/villas/HRB-01188P",
    primeComp: true,
    note: "AMES Arquitectos · New build 2025",
    eurPerSqm: 11186,
  },
  {
    name: "Villa Madroñal 72",
    location: "El Madroñal",
    price: "€8,995,000",
    build: "598 m²",
    pricePerSqm: "€15,042/m²",
    url: "https://www.homerunmarbella.com/properties/el-madronal/villas/HRB-01474P",
    primeComp: false,
    note: "",
    eurPerSqm: 15042,
  },
  {
    name: "Villa Forest Bay",
    location: "El Bosque",
    price: "€9,450,000",
    build: "999 m²",
    pricePerSqm: "€9,459/m²",
    url: "https://www.homerunmarbella.com/properties/el-bosque/villas/HRB-01473P",
    primeComp: false,
    note: "",
    eurPerSqm: 9459,
  },
  {
    name: "Villa Pine Crest",
    location: "El Bosque",
    price: "€8,250,000",
    build: "806 m²",
    pricePerSqm: "€10,235/m²",
    url: "https://www.homerunmarbella.com/properties/el-bosque/villas/HRB-01472P",
    primeComp: false,
    note: "",
    eurPerSqm: 10235,
  },
  {
    name: "Villa Bond",
    location: "El Herrojo",
    price: "€11,900,000",
    build: "1,296 m²",
    pricePerSqm: "€9,182/m²",
    url: "https://www.homerunmarbella.com/properties/el-herrojo/villas/HRB-00628P",
    primeComp: false,
    note: "",
    eurPerSqm: 9182,
  },
  {
    name: "Villa The Retreat",
    location: "La Zagaleta",
    price: "€11,600,000",
    build: "910 m²",
    pricePerSqm: "€12,747/m²",
    url: "https://www.homerunmarbella.com/properties/la-zagaleta/villas/HRB-00976P",
    primeComp: false,
    note: "",
    eurPerSqm: 12747,
  },
] as const;

export const marketComps = marketCompsData;

const listedCompsForAvg = marketCompsData.filter((r) => !("subject" in r && r.subject));
export const marketCompsListedAvgEurPerSqm = Math.round(
  listedCompsForAvg.reduce((s, r) => s + r.eurPerSqm, 0) / listedCompsForAvg.length
);

export const marketSources = [
  {
    name: "3SA Estate · Casa de Canto listing",
    url: "https://3saestate.com/listings/casa-de-canto/",
    type: "Broker listing (asking price)",
  },
  {
    name: "Idealista Marbella (asking-price)",
    url: "https://www.idealista.com/sala-de-prensa/informes-precio-vivienda/venta/andalucia/malaga-provincia/marbella/",
    type: "Asking-price portal",
  },
  {
    name: "Idealista La Zagaleta–El Madroñal",
    url: "https://www.idealista.com/sala-de-prensa/informes-precio-vivienda/venta/andalucia/malaga-provincia/benahavis/la-zagaleta-el-madronal/",
    type: "Asking-price portal",
  },
  {
    name: "Homerun Brokers Golden Mile",
    url: "https://www.homerunmarbella.com/areas/golden-mile",
    type: "Broker market guidance",
  },
] as const;

export const amesReferences = [
  {
    name: "Casa de Canto",
    location: "Benahavís (El Madroñal)",
    plot: "3,635 m²",
    bua: "1,300 m²",
    relevance: "Closest contextual match; steep plot, privacy",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/68d1b694b66e6eb51dff23e7_DJI_0121.webp",
    url: "https://www.amesarquitectos.com/portfolio/casa-de-canto",
  },
  {
    name: "Villa Siena",
    location: "Marbella (El Madroñal)",
    plot: "5,010 m²",
    bua: "1,325 m²",
    relevance: "El Madroñal context; horizontality",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/68d6947346f1b82294b65c12_VILLA%20SIENA_02%20EXTERIOR.webp",
    url: "https://www.amesarquitectos.com/portfolio/villa-siena",
  },
  {
    name: "The One",
    location: "Marbella",
    plot: "9,746 m²",
    bua: "1,717 m²",
    relevance: "Topography; resort program",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/6707a72486f535a8bedd7b29_ames_the-one.webp",
    url: "https://www.amesarquitectos.com/portfolio/the-one",
  },
  {
    name: "Celestia",
    location: "Sotogrande",
    plot: "3,809 m²",
    bua: "1,290 m²",
    relevance: "Completed villa; sloped plot, landscape-driven execution",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/68e8e803ff56a14972a76d5e_VILLA%20CELESTIA-MORERA%2011_04_EXTERIOR.jpg",
    url: "https://www.amesarquitectos.com/portfolio/celestia",
  },
] as const;
