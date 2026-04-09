/**
 * Investor portal data – working assumptions (preliminary, subject to refinement).
 * EJ Properties · Villa Elysia (El Madroñal) · Construction funding opportunity.
 */

/** Paths for layout routing (context map only in #why; house renders hero on #site) */
export const villaElysiaContextMapSrc = "/investor/elysia/context-map.png" as const;
export const villaElysiaHouseRender1Src = "/investor/elysia/house-render-1.png" as const;
export const villaElysiaHouseRender2Src = "/investor/elysia/house-render-2.png" as const;

/** Full-width site hero carousel (#site): primary house renders */
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

type SitePlanningSurveySlide = {
  key: string;
  src: string;
  alt: string;
  caption: string;
  objectFit: "cover" | "contain";
};

/** Survey assets below hero renders */
export const sitePlanningSurveyCarouselSlides: readonly SitePlanningSurveySlide[] = [
  {
    key: "altimetria",
    src: "/investor/altimetria-crop.png",
    alt: "Topographic survey · Altimetría · Parcela 102(B)",
    caption: "Survey · Topographic altimetría · Nov 2025",
    objectFit: "contain",
  },
];

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
    src: "/investor/elysia/plan-entrance.png",
    alt: "Villa Elysia · Entrance level plan and area schedule",
    caption: "Entrance level · Garage, staff, foyer, and arrival court",
  },
  {
    src: "/investor/elysia/plan-ground.png",
    alt: "Villa Elysia · Ground floor plan and area schedule",
    caption: "Ground floor · Living, courtyard, gym, pool, and external areas",
  },
  {
    src: "/investor/elysia/plan-first.png",
    alt: "Villa Elysia · First floor plan, section, and area schedule",
    caption: "First floor · Suites, terraces, and vertical light shaft (section)",
  },
] as const;

/** Rounded from detailed room schedules by level */
export const villaElysiaFloorBreakdown = [
  { level: "Entrance level", insideSqm: "280", outsideSqm: "134", totalSqm: "414", isTotal: false },
  { level: "Ground floor", insideSqm: "307", outsideSqm: "349", totalSqm: "656", isTotal: false },
  { level: "First floor", insideSqm: "216", outsideSqm: "122", totalSqm: "338", isTotal: false },
  { level: "Total", insideSqm: "803", outsideSqm: "605", totalSqm: "1,408", isTotal: true },
] as const;

/**
 * Schedule enclosed, aligned with floor “In” column: entrance inside + (ground + first) inside = 803 m².
 */
export const villaElysiaAmesClosedBuilt = [
  { line: "Closed built (ground + first)", sqm: "523", bold: false },
  { line: "Closed built (entrance)", sqm: "280", bold: false },
  { line: "Total closed built", sqm: "803", bold: true },
] as const;

/** Element breakdown sums to floor “Out” total (605 m²) */
export const villaElysiaExternalElements = [
  { element: "Porches", sqm: "148", bold: false },
  { element: "Terraces", sqm: "132", bold: false },
  { element: "Road access", sqm: "120", bold: false },
  { element: "Pool", sqm: "86", bold: false },
  { element: "Gazebo", sqm: "79", bold: false },
  { element: "Garden", sqm: "40", bold: false },
  { element: "Total external", sqm: "605", bold: true },
] as const;

export const villaElysiaAreaFootnotes = [
  "Floor totals are rounded from detailed room schedules across all levels.",
  "Closed built aggregates match the floor breakdown “In” column (entrance 280 m² + ground & first 523 m² = 803 m²).",
  "External elements are rounded to sum to the floor “Out” total (605 m²).",
] as const;

export const executiveSummary = [
  { label: "Project owner", value: "EJ Properties" },
  { label: "Project", value: "Villa Elysia" },
  { label: "Location", value: "El Madroñal, Benahavís" },
  { label: "Plot", value: "3,038 m²" },
  {
    label: "Enclosed / saleable",
    value: "803 m² (schedules)",
  },
  { label: "Architect", value: "AMES Arquitectos" },
  { label: "Funded to date", value: "Plot and design fully funded" },
  { label: "External capital need", value: "Construction funding" },
  { label: "Expected exit", value: "Sale of completed villa" },
] as const;

export const sponsorCommitment = [
  { line: "Plot acquisition", amount: "€700,000", note: "+ taxes", bold: false },
  { line: "AMES architecture / design", amount: "€300,000", note: "", bold: false },
  { line: "Capital committed", amount: "€1,000,000", note: "before construction", bold: true },
] as const;

export const preliminaryBudget = [
  {
    line: "Construction",
    amount: "€3,453,000",
    note: "803 m² × €4,300/m²",
    bold: false,
  },
  { line: "Admin / project overhead", amount: "€300,000", note: "", bold: false },
  {
    line: "Kitchens, FF&E & equipment",
    amount: "€500,000",
    note: "Main kitchen, staff kitchen, outdoor kitchen, gym appliances, beds, TVs, furniture",
    bold: false,
  },
  {
    line: "Permit taxes / fees",
    amount: "€135,000",
    note: "Indicative: Benahavís ICIO c. 2.4% on declared material execution budget (ordenanza fiscal, 2024+) plus municipal licence / processing fees and related filings—confirm with architect & ayuntamiento",
    bold: false,
  },
  {
    line: "Additional soft costs / sales",
    amount: "€185,000",
    note: "Indicative: construction-phase legal, all-risk site insurance, survey / geotech supplements, photography & sales collateral / launch marketing (excludes broker success fee at exit)",
    bold: false,
  },
  {
    line: "Total funding sought",
    amount: "€4,573,000",
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
    line: "Indicative sales value",
    amount: "€9,234,500",
    note: "€11,500/m² × 803 m²",
    bold: true,
  },
  { line: "Expected broker", amount: "Homerun, Solvilla etc.", note: "marketing", bold: false },
  { line: "Pricing basis", amount: "Comparable AMES-houses", note: "similar €/m² build", bold: false },
  {
    line: "Project margin (conservative)",
    amount: "€3,460,000",
    note: "After financing cost at 10% p.a., accruing from day 1 over 24 months on ~€4.57m funding (incl. kitchens, FF&E, indicative permits & soft costs)",
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
      "Lower fixed return: approx. 5–8%",
      "Plus agreed upside participation / profit share",
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
    price: "€9,234,500",
    build: "803 m²",
    pricePerSqm: "€11,500/m²",
    url: "",
    subject: true as const,
    primeComp: false,
    note: "This project · indicative GDV · €11,500/m² × 803 m² · not a live listing",
    eurPerSqm: 11500,
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
