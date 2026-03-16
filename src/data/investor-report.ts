/**
 * Data from deep research report (Mar 2026) for investor portal.
 * Source: docs/investor/deep-research-report.md
 */

export const marketPricing = [
  { submarket: "La Zagaleta–El Madroñal", price: "7,699", source: "Idealista Feb 2026", notes: "Freshest submarket indicator" },
  { submarket: "Benahavís (municipality)", price: "5,453", source: "Idealista Feb 2026", notes: "District baseline" },
  { submarket: "Golden Mile / Nagüeles", price: "6,789", source: "Idealista Feb 2026", notes: "District indicator" },
  { submarket: "HomerunBrokers prime villa band", price: "8,000–14,000", source: "HomerunBrokers", notes: "Golden Mile luxury villas" },
] as const;

export const scenarioOutputs = [
  { scenario: "Downside", salePrice: "7,500", gdv: "11.25", irr: "-16.0%", npv: "-€1.85m" },
  { scenario: "Base", salePrice: "9,500", gdv: "14.25", irr: "17.4%", npv: "€0.41m" },
  { scenario: "Upside", salePrice: "12,000", gdv: "18.00", irr: "48.7%", npv: "€3.24m" },
] as const;

export const capexSummary = [
  { line: "Land acquisition", amount: "3,500,000" },
  { line: "Hard construction", amount: "6,380,000" },
  { line: "External works", amount: "680,000" },
  { line: "Soft costs", amount: "980,000" },
  { line: "Marketing & sales", amount: "280,000" },
  { line: "Contingency", amount: "520,000" },
  { line: "Total (ex-finance)", amount: "11,660,000", bold: true },
] as const;

export const sensitivityTable = [
  { variable: "Base case", irr: "17.4%", npv: "€0.41m" },
  { variable: "Sale price -10%", irr: "~2.8%", npv: "-€0.66m" },
  { variable: "Sale price +10%", irr: "~30.2%", npv: "€1.49m" },
  { variable: "Hard cost -10%", irr: "~24.5%", npv: "€0.96m" },
  { variable: "Hard cost +10%", irr: "~10.3%", npv: "-€0.13m" },
] as const;

export const riskRegister = [
  { priority: 1, risk: "Topography & retaining scope", mitigation: "Geotech + structural concept; staged earthworks" },
  { priority: 2, risk: "Vegetation/tree constraints", mitigation: "Arborist survey; landscape strategy" },
  { priority: 3, risk: "Permit duration uncertainty", mitigation: "Pre-consultation; compliance matrix" },
  { priority: 4, risk: "Utilities feasibility", mitigation: "Utility letters early" },
  { priority: 5, risk: "Spec creep (luxury)", mitigation: "Design freeze gates; change control" },
  { priority: 6, risk: "Cost escalation", mitigation: "Long-lead locks; index tracking" },
  { priority: 7, risk: "Contractor performance", mitigation: "Prequal; performance security" },
  { priority: 8, risk: "Market pricing miss", mitigation: "Comp pack; differentiated product" },
  { priority: 9, risk: "Financing availability", mitigation: "Multiple funding tracks" },
  { priority: 10, risk: "Handover/occupation friction", mitigation: "Documentation early" },
] as const;

export const amesReferences = [
  {
    name: "Casa de Canto",
    location: "Benahavís (El Madroñal)",
    plot: "3,635 m²",
    bua: "1,300 m²",
    relevance: "Closest match; steep plot, privacy",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/68d1b694b66e6eb51dff23e7_DJI_0121.webp",
    url: "https://www.amesarquitectos.com/portfolio/casa-de-canto",
  },
  {
    name: "Villa Siena",
    location: "Marbella (El Madroñal)",
    plot: "5,010 m²",
    bua: "1,325 m²",
    relevance: "El Madroñal context",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/68d6947346f1b82294b65c12_VILLA%20SIENA_02%20EXTERIOR.webp",
    url: "https://www.amesarquitectos.com/portfolio/villa-siena",
  },
  {
    name: "The One",
    location: "Marbella",
    plot: "9,746 m²",
    bua: "1,717 m²",
    relevance: "Topography + resort program",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/6707a72486f535a8bedd7b29_ames_the-one.webp",
    url: "https://www.amesarquitectos.com/portfolio/the-one",
  },
  {
    name: "Care Hotel",
    location: "Camoján",
    plot: "2,250 m²",
    bua: "4,489 m²",
    relevance: "Execution capability",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/663d010b2f9cedec8c53d40d_CARE%20HOTEL_01_ENTRANCE.jpg",
    url: "https://www.amesarquitectos.com/portfolio/care-hotel",
  },
] as const;
