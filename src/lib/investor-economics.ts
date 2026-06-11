/**
 * Villa Elysia investor economics — sensitivity and drawdown-aware financing.
 */

export const villaElysiaEconomicsInputs = {
  builtAreaSqm: 947,
  saleRatePerSqm: 11_500,
  workingConstructionRatePerSqm: 5_250,
  /** Plot 102B acquisition (all-in purchase price, funded by sponsor pre-construction) */
  plotAcquisitionCost: 1_000_000,
  /** AMES architecture / design fees funded by sponsor pre-construction */
  amesArchitectureDesignCost: 300_000,
  adminOverhead: 300_000,
  ffeAllowance: 500_000,
  softCosts: 185_000,
  icioRate: 0.024,
  /** Construction / funding period used for interest accrual */
  constructionMonths: 24,
  /**
   * Average outstanding balance as a fraction of peak funding when capital is
   * drawn at milestones (not 100% from day one). Four equal draws over 24
   * months ≈ 50% average outstanding.
   */
  avgDrawdownFactor: 0.5,
  workingFinancingRate: 0.1,
  /** Broker success fee at exit (% of gross sale / GDV) — conservative allowance */
  brokerSaleFeeRate: 0.06,
} as const;

export type VillaElysiaEconomicsInputs = typeof villaElysiaEconomicsInputs;

export function formatInvestorEur(n: number): string {
  return `€${Math.round(n).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

export type SponsorCommitmentRow = {
  line: string;
  amount: string;
  note: string;
  bold: boolean;
};

/** Sponsor capital committed before construction funding (plot + AMES design). */
export function buildSponsorCommitment(
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): readonly SponsorCommitmentRow[] {
  const capitalCommitted =
    inputs.plotAcquisitionCost + inputs.amesArchitectureDesignCost;
  return [
    {
      line: "Plot acquisition",
      amount: formatInvestorEur(inputs.plotAcquisitionCost),
      note: "Plot 102B · all-in purchase price",
      bold: false,
    },
    {
      line: "AMES architecture / design",
      amount: formatInvestorEur(inputs.amesArchitectureDesignCost),
      note: "",
      bold: false,
    },
    {
      line: "Capital committed",
      amount: formatInvestorEur(capitalCommitted),
      note: "before construction",
      bold: true,
    },
  ] as const;
}

export function computeIndicativeGdv(
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return inputs.builtAreaSqm * inputs.saleRatePerSqm;
}

export function computeBrokerSaleFee(
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return Math.round(computeIndicativeGdv(inputs) * inputs.brokerSaleFeeRate);
}

export function computeNetSaleProceeds(
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return computeIndicativeGdv(inputs) - computeBrokerSaleFee(inputs);
}

export function computeConstructionCost(
  constructionRatePerSqm: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return inputs.builtAreaSqm * constructionRatePerSqm;
}

export function computePermitAllowance(
  constructionCost: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return Math.round(constructionCost * inputs.icioRate);
}

export function computeTotalFunding(
  constructionRatePerSqm: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  const construction = computeConstructionCost(constructionRatePerSqm, inputs);
  const permits = computePermitAllowance(construction, inputs);
  return (
    construction +
    inputs.adminOverhead +
    inputs.ffeAllowance +
    permits +
    inputs.softCosts
  );
}

/**
 * Interest on drawn balances only — not full peak funding from day one.
 */
export function computeDrawdownFinancingCost(
  peakFunding: number,
  annualRate: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  const years = inputs.constructionMonths / 12;
  return peakFunding * inputs.avgDrawdownFactor * annualRate * years;
}

/** Full peak funding outstanding for the entire period (upper bound — not used as base case). */
export function computeFullDrawFinancingCost(
  peakFunding: number,
  annualRate: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  const years = inputs.constructionMonths / 12;
  return peakFunding * annualRate * years;
}

export function computeSpreadBeforeFinancing(
  constructionRatePerSqm: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return (
    computeNetSaleProceeds(inputs) -
    inputs.plotAcquisitionCost -
    computeTotalFunding(constructionRatePerSqm, inputs)
  );
}

export function computeNetMargin(
  constructionRatePerSqm: number,
  annualFinancingRate: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  const funding = computeTotalFunding(constructionRatePerSqm, inputs);
  const financing = computeDrawdownFinancingCost(funding, annualFinancingRate, inputs);
  return (
    computeNetSaleProceeds(inputs) - inputs.plotAcquisitionCost - funding - financing
  );
}

export type CostSensitivityRow = {
  constructionRatePerSqm: number;
  constructionCost: number;
  totalFunding: number;
  brokerSaleFee: number;
  spreadBeforeFinancing: number;
  financingCost: number;
  netMargin: number;
  isWorkingCase: boolean;
};

export function buildCostSensitivityRows(
  minRatePerSqm = 5_000,
  maxRatePerSqm = 5_500,
  step = 100,
  financingRate = villaElysiaEconomicsInputs.workingFinancingRate,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): CostSensitivityRow[] {
  const rates = new Set<number>();
  for (let rate = minRatePerSqm; rate <= maxRatePerSqm; rate += step) {
    rates.add(rate);
  }
  rates.add(inputs.workingConstructionRatePerSqm);

  return [...rates]
    .sort((a, b) => a - b)
    .map((rate) => {
      const funding = computeTotalFunding(rate, inputs);
      const brokerSaleFee = computeBrokerSaleFee(inputs);
      return {
        constructionRatePerSqm: rate,
        constructionCost: computeConstructionCost(rate, inputs),
        totalFunding: funding,
        brokerSaleFee,
        spreadBeforeFinancing: computeSpreadBeforeFinancing(rate, inputs),
        financingCost: computeDrawdownFinancingCost(funding, financingRate, inputs),
        netMargin: computeNetMargin(rate, financingRate, inputs),
        isWorkingCase: rate === inputs.workingConstructionRatePerSqm,
      };
    });
}

/** Approximate change in net margin per €100/m² move in construction cost (linear band). */
export function computeMarginDeltaPer100SqmEuro(
  financingRate = villaElysiaEconomicsInputs.workingFinancingRate,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  const m0 = computeNetMargin(5_000, financingRate, inputs);
  const m1 = computeNetMargin(5_100, financingRate, inputs);
  return m1 - m0;
}

/** Fixed coupon on hybrid structures where upside is shared via equity kicker */
export const hybridHurdleRatePct = 2;
/** Modelled equity kicker options: % of net profit after all costs, paid to financier */
export const hybridEquityKickerOptions = [15, 20] as const;
/** Equity kicker on mid-coupon hybrid rows (3% & 4% fixed return) */
export const hybridNegotiableEquityKickerPct = 15;

/** Full profit waterfall — equity kicker % applies to netProfitBeforeEquityKicker only */
export type ProjectProfitWaterfall = {
  indicativeGdv: number;
  brokerSaleFee: number;
  netSaleProceeds: number;
  plotAcquisitionCost: number;
  constructionCost: number;
  adminOverhead: number;
  ffeAllowance: number;
  permitAllowance: number;
  softCosts: number;
  totalDevelopmentFunding: number;
  financingCoupon: number;
  /** GDV − broker − plot − all development funding − financing coupon */
  netProfitBeforeEquityKicker: number;
};

export function computeProjectProfitWaterfall(
  constructionRatePerSqm: number,
  annualFinancingRate: number,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): ProjectProfitWaterfall {
  const indicativeGdv = computeIndicativeGdv(inputs);
  const brokerSaleFee = computeBrokerSaleFee(inputs);
  const constructionCost = computeConstructionCost(constructionRatePerSqm, inputs);
  const permitAllowance = computePermitAllowance(constructionCost, inputs);
  const totalDevelopmentFunding = computeTotalFunding(constructionRatePerSqm, inputs);
  const financingCoupon = computeDrawdownFinancingCost(
    totalDevelopmentFunding,
    annualFinancingRate,
    inputs
  );

  return {
    indicativeGdv,
    brokerSaleFee,
    netSaleProceeds: indicativeGdv - brokerSaleFee,
    plotAcquisitionCost: inputs.plotAcquisitionCost,
    constructionCost,
    adminOverhead: inputs.adminOverhead,
    ffeAllowance: inputs.ffeAllowance,
    permitAllowance,
    softCosts: inputs.softCosts,
    totalDevelopmentFunding,
    financingCoupon,
    netProfitBeforeEquityKicker:
      indicativeGdv -
      brokerSaleFee -
      inputs.plotAcquisitionCost -
      totalDevelopmentFunding -
      financingCoupon,
  };
}

export type FinancingSensitivityRow = {
  key: string;
  label: string;
  annualRatePct: number;
  equityKickerPct: number | null;
  structure: string;
  financingCost: number;
  /** Net profit after all costs and fixed coupon — base for equity kicker % */
  netProfitBeforeEquityKicker: number | null;
  equityKickerAmount: number | null;
  /** Sponsor retained after coupon and any modelled kicker */
  netMargin: number;
  isWorkingCase: boolean;
};

/**
 * Net profit after all project costs (plot acquisition, construction, admin,
 * FF&E, permits, soft costs, broker at exit) and the fixed financing coupon.
 */
export function computeNetProfitBeforeEquityKicker(
  constructionRatePerSqm: number,
  hurdleRatePct = hybridHurdleRatePct,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return computeProjectProfitWaterfall(
    constructionRatePerSqm,
    hurdleRatePct / 100,
    inputs
  ).netProfitBeforeEquityKicker;
}

/** @deprecated Use computeNetProfitBeforeEquityKicker */
export function computeProfitAboveHurdle(
  constructionRatePerSqm: number,
  hurdleRatePct = hybridHurdleRatePct,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): number {
  return computeNetProfitBeforeEquityKicker(constructionRatePerSqm, hurdleRatePct, inputs);
}

export function computeSponsorNetMarginWithKicker(
  netProfitBeforeEquityKicker: number,
  equityKickerPct: number
): { equityKickerAmount: number; sponsorNetMargin: number } {
  const equityKickerAmount = netProfitBeforeEquityKicker * (equityKickerPct / 100);
  return {
    equityKickerAmount,
    sponsorNetMargin: netProfitBeforeEquityKicker - equityKickerAmount,
  };
}

export function buildFinancingSensitivityRows(
  constructionRatePerSqm = villaElysiaEconomicsInputs.workingConstructionRatePerSqm,
  inputs: VillaElysiaEconomicsInputs = villaElysiaEconomicsInputs
): FinancingSensitivityRow[] {
  const seniorRates = [10, 8, 6, 5];
  const hybridNegotiableRates = [4, 3];
  const funding = computeTotalFunding(constructionRatePerSqm, inputs);
  const hurdleRate = hybridHurdleRatePct / 100;
  const profitBeforeKicker = computeNetProfitBeforeEquityKicker(
    constructionRatePerSqm,
    hybridHurdleRatePct,
    inputs
  );
  const interestAtHurdle = computeDrawdownFinancingCost(funding, hurdleRate, inputs);

  const seniorRows: FinancingSensitivityRow[] = seniorRates.map((pct) => {
    const rate = pct / 100;
    return {
      key: `senior-${pct}`,
      label: "Senior-style",
      annualRatePct: pct,
      equityKickerPct: null,
      structure: `${pct}% fixed return · no equity participation`,
      financingCost: computeDrawdownFinancingCost(funding, rate, inputs),
      netProfitBeforeEquityKicker: null,
      equityKickerAmount: null,
      netMargin: computeNetMargin(constructionRatePerSqm, rate, inputs),
      isWorkingCase: pct === Math.round(inputs.workingFinancingRate * 100),
    };
  });

  const hybridNegotiableRows: FinancingSensitivityRow[] = hybridNegotiableRates.map((pct) => {
    const rate = pct / 100;
    const netProfitBeforeEquityKicker = computeNetProfitBeforeEquityKicker(
      constructionRatePerSqm,
      pct,
      inputs
    );
    const { equityKickerAmount, sponsorNetMargin } = computeSponsorNetMarginWithKicker(
      netProfitBeforeEquityKicker,
      hybridNegotiableEquityKickerPct
    );
    return {
      key: `hybrid-${pct}`,
      label: "Hybrid",
      annualRatePct: pct,
      equityKickerPct: hybridNegotiableEquityKickerPct,
      structure: `${pct}% coupon + ${hybridNegotiableEquityKickerPct}% of net profit after all costs to financier`,
      financingCost: computeDrawdownFinancingCost(funding, rate, inputs),
      netProfitBeforeEquityKicker,
      equityKickerAmount,
      netMargin: sponsorNetMargin,
      isWorkingCase: false,
    };
  });

  const hybridModelledRows: FinancingSensitivityRow[] = hybridEquityKickerOptions.map((kickerPct) => {
    const { equityKickerAmount, sponsorNetMargin } = computeSponsorNetMarginWithKicker(
      profitBeforeKicker,
      kickerPct
    );
    return {
      key: `hybrid-2-kicker-${kickerPct}`,
      label: "Hybrid",
      annualRatePct: hybridHurdleRatePct,
      equityKickerPct: kickerPct,
      structure: `${hybridHurdleRatePct}% coupon + ${kickerPct}% of net profit after all costs to financier`,
      financingCost: interestAtHurdle,
      netProfitBeforeEquityKicker: profitBeforeKicker,
      equityKickerAmount,
      netMargin: sponsorNetMargin,
      isWorkingCase: false,
    };
  });

  return [...seniorRows, ...hybridNegotiableRows, ...hybridModelledRows];
}

export const investorEconomicsModelNotes = [
  `Indicative GDV held constant at ${formatInvestorEur(computeIndicativeGdv())} (947 m² × €11,500/m²).`,
  `Broker success fee at exit: ${villaElysiaEconomicsInputs.brokerSaleFeeRate * 100}% of GDV (${formatInvestorEur(computeBrokerSaleFee())}) — conservative vs typical 5–6% negotiable commission.`,
  `Plot acquisition (${formatInvestorEur(villaElysiaEconomicsInputs.plotAcquisitionCost)}) funded by sponsor pre-construction — included in net profit / margin calculations.`,
  "Total external funding sought scales with construction €/m²; admin, FF&E (€500k), and soft costs held flat.",
  `Financing interest assumes milestone drawdowns over ${villaElysiaEconomicsInputs.constructionMonths} months (~${villaElysiaEconomicsInputs.avgDrawdownFactor * 100}% average outstanding vs peak — not 100% drawn from day one).`,
  `Hybrid at ${hybridHurdleRatePct}%: equity kicker (${hybridEquityKickerOptions.join("% or ")}%) applies to net profit after all costs — i.e. GDV minus broker (6%), plot purchase, construction, admin, FF&E, permits, soft costs, and the ${hybridHurdleRatePct}% financing coupon. Mid-coupon hybrid (3% & 4%) modelled with ${hybridNegotiableEquityKickerPct}% equity kicker on the same basis.`,
] as const;
