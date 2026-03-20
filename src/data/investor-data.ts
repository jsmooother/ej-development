/**
 * Investor portal data – working assumptions (preliminary, subject to refinement).
 * EJ Properties · El Madroñal Villa · Construction funding opportunity.
 */

export const executiveSummary = [
  { label: "Project owner", value: "EJ Properties" },
  { label: "Location", value: "El Madroñal, Benahavís" },
  { label: "Plot", value: "3,038 m²" },
  { label: "Target villa", value: "approx. 800 m² build" },
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
  { line: "Construction", amount: "€3,440,000", note: "800 m² × €4,300/m²", bold: false },
  { line: "Admin / project overhead", amount: "€200,000", note: "", bold: false },
  { line: "Permit taxes / fees", amount: "TBC", note: "", bold: false },
  { line: "Additional soft costs / sales", amount: "TBC", note: "", bold: false },
  { line: "Total funding sought", amount: "€3,900,000+", note: "excl. TBC items", bold: true },
] as const;

export const fundingMilestones = [
  { milestone: "Milestone 1", description: "TBC", amount: "TBC", note: "" },
  { milestone: "Milestone 2", description: "TBC", amount: "TBC", note: "" },
  { milestone: "Milestone 3", description: "TBC", amount: "TBC", note: "" },
  { milestone: "Milestone 4", description: "TBC", amount: "TBC", note: "" },
] as const;

export const preliminaryRevenue = [
  { line: "Indicative sales value", amount: "€9,200,000", note: "€11,500/m² × 800 m²", bold: true },
  { line: "Expected broker", amount: "Homerun, Solvilla etc.", note: "marketing", bold: false },
  { line: "Pricing basis", amount: "Comparable AMES-houses", note: "similar €/m² build", bold: false },
  { line: "Project margin (conservative)", amount: "€4,520,000", note: "After financing cost at 10% p.a., accruing from day 1 over 24 months on €3.9m funding", bold: true },
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

export const marketComps = [
  {
    name: "Villa Mio",
    location: "El Madroñal",
    price: "€11,500,000",
    build: "1,028 m²",
    pricePerSqm: "€11,186/m²",
    url: "https://www.homerunmarbella.com/properties/el-madronal/villas/HRB-01188P",
    primeComp: true,
    note: "AMES Arquitectos · New build 2025",
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
  },
] as const;

export const marketSources = [
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
    name: "Care Hotel",
    location: "Camoján",
    plot: "2,250 m²",
    bua: "4,489 m²",
    relevance: "Execution capability",
    image: "https://cdn.prod.website-files.com/660fcad6f4ac6fb96ad38b99/663d010b2f9cedec8c53d40d_CARE%20HOTEL_01_ENTRANCE.jpg",
    url: "https://www.amesarquitectos.com/portfolio/care-hotel",
  },
] as const;
