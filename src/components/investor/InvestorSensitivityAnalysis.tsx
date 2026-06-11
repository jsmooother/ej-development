"use client";

import { motion } from "framer-motion";
import { villaElysiaBuiltAreaSqm } from "@/data/investor-data";
import {
  buildCostSensitivityRows,
  buildFinancingSensitivityRows,
  computeMarginDeltaPer100SqmEuro,
  computeProjectProfitWaterfall,
  formatInvestorEur,
  hybridEquityKickerOptions,
  hybridHurdleRatePct,
  hybridNegotiableEquityKickerPct,
  investorEconomicsModelNotes,
  villaElysiaEconomicsInputs,
} from "@/lib/investor-economics";

const costRows = buildCostSensitivityRows();
const financingRows = buildFinancingSensitivityRows();
const marginDeltaPer100 = computeMarginDeltaPer100SqmEuro();
const hybridProfitWaterfall = computeProjectProfitWaterfall(
  villaElysiaEconomicsInputs.workingConstructionRatePerSqm,
  hybridHurdleRatePct / 100
);

export function InvestorSensitivityAnalysis() {
  return (
    <div className="mt-12 space-y-12">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          D. Construction cost sensitivity
        </p>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Impact on net project margin across the €5,000–€5,500/m² construction band (
          {villaElysiaBuiltAreaSqm} m² built area). GDV at €
          {villaElysiaEconomicsInputs.saleRatePerSqm.toLocaleString("en-GB")}/m²; net proceeds after{" "}
          {villaElysiaEconomicsInputs.brokerSaleFeeRate * 100}% broker fee at exit; financing at{" "}
          {villaElysiaEconomicsInputs.workingFinancingRate * 100}% p.a. with milestone drawdowns.
          Each €100/m² increase moves net margin by about{" "}
          <span className="font-mono text-foreground">
            {formatInvestorEur(marginDeltaPer100)}
          </span>
          .
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 text-left font-medium">Construction €/m²</th>
                <th className="py-3 pr-4 text-right font-medium">Construction</th>
                <th className="py-3 pr-4 text-right font-medium">Total funding</th>
                <th className="py-3 pr-4 text-right font-medium">
                  Broker ({villaElysiaEconomicsInputs.brokerSaleFeeRate * 100}%)
                </th>
                <th className="py-3 pr-4 text-right font-medium">Spread pre-finance</th>
                <th className="py-3 pr-4 text-right font-medium">Est. interest</th>
                <th className="py-3 text-right font-medium">Net margin</th>
              </tr>
            </thead>
            <tbody>
              {costRows.map((row) => (
                <tr
                  key={row.constructionRatePerSqm}
                  className={`border-b border-border/50 ${
                    row.isWorkingCase ? "bg-primary/10 font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <td className="py-3 pr-4">
                    €{row.constructionRatePerSqm.toLocaleString("en-GB")}
                    {row.isWorkingCase ? (
                      <span className="ml-2 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                        Working
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.constructionCost)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.totalFunding)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.brokerSaleFee)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.spreadBeforeFinancing)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.financingCost)}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.netMargin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          E. Financing structure sensitivity
        </p>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Net margin at the working construction case (€
          {villaElysiaEconomicsInputs.workingConstructionRatePerSqm.toLocaleString("en-GB")}/m²) under
          different fixed-return scenarios. Net sale proceeds after{" "}
          {villaElysiaEconomicsInputs.brokerSaleFeeRate * 100}% broker fee; interest reflects
          milestone drawdowns over {villaElysiaEconomicsInputs.constructionMonths} months (~
          {villaElysiaEconomicsInputs.avgDrawdownFactor * 100}% average outstanding). At a{" "}
          <span className="font-mono text-foreground">{hybridHurdleRatePct}%</span> hurdle, hybrid
          options model a{" "}
          <span className="font-mono text-foreground">{hybridEquityKickerOptions[0]}%</span> or{" "}
          <span className="font-mono text-foreground">{hybridEquityKickerOptions[1]}%</span> equity
          kicker at that coupon; mid-coupon structures at{" "}
          <span className="font-mono text-foreground">3%</span> and{" "}
          <span className="font-mono text-foreground">4%</span> use a{" "}
          <span className="font-mono text-foreground">{hybridNegotiableEquityKickerPct}%</span> kicker
          on{" "}
          <span className="font-semibold text-foreground">net profit after all costs</span> (see
          waterfall below — not on gross sale value).
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card/30 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Equity kicker base · Working case @ {hybridHurdleRatePct}% coupon
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            {(
              [
                ["Indicative GDV", hybridProfitWaterfall.indicativeGdv, "plain"],
                [
                  `Less broker success fee (${villaElysiaEconomicsInputs.brokerSaleFeeRate * 100}%)`,
                  hybridProfitWaterfall.brokerSaleFee,
                  "less",
                ],
                ["= Net sale proceeds", hybridProfitWaterfall.netSaleProceeds, "subtotal"],
                ["Less plot acquisition", hybridProfitWaterfall.plotAcquisitionCost, "less"],
                ["Less construction", hybridProfitWaterfall.constructionCost, "less"],
                ["Less admin / overhead", hybridProfitWaterfall.adminOverhead, "less"],
                ["Less FF&E", hybridProfitWaterfall.ffeAllowance, "less"],
                ["Less permits / ICIO", hybridProfitWaterfall.permitAllowance, "less"],
                ["Less soft costs", hybridProfitWaterfall.softCosts, "less"],
                [
                  `Less financing coupon (${hybridHurdleRatePct}%)`,
                  hybridProfitWaterfall.financingCoupon,
                  "less",
                ],
                [
                  "= Net profit before equity kicker",
                  hybridProfitWaterfall.netProfitBeforeEquityKicker,
                  "total",
                ],
              ] as const
            ).map(([label, amount, kind]) => (
              <div
                key={label}
                className={`flex justify-between gap-4 border-b border-border/40 py-1.5 ${
                  kind === "total" ? "font-semibold text-foreground" : "text-muted-foreground"
                } ${kind === "subtotal" ? "text-foreground" : ""}`}
              >
                <dt>{label}</dt>
                <dd className="font-mono tabular-nums text-foreground">
                  {kind === "less" ? "−" : ""}
                  {formatInvestorEur(amount)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            {hybridEquityKickerOptions[0]}% or {hybridEquityKickerOptions[1]}% kicker = that percentage
            of the net profit line only (e.g. {hybridEquityKickerOptions[0]}% ×{" "}
            {formatInvestorEur(hybridProfitWaterfall.netProfitBeforeEquityKicker)}).
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4 text-left font-medium">Structure</th>
                <th className="py-3 pr-4 text-right font-medium">Fixed return</th>
                <th className="py-3 pr-4 text-right font-medium">Kicker</th>
                <th className="py-3 pr-4 text-right font-medium">Est. interest</th>
                <th className="py-3 pr-4 text-right font-medium">Net profit (pre-kicker)</th>
                <th className="py-3 pr-4 text-right font-medium">Kicker to financier</th>
                <th className="py-3 text-right font-medium">Sponsor net</th>
                <th className="py-3 pl-4 text-left font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {financingRows.map((row) => (
                <tr
                  key={row.key}
                  className={`border-b border-border/50 ${
                    row.isWorkingCase ? "bg-primary/10 font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <td className="py-3 pr-4 text-foreground">{row.label}</td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {row.annualRatePct}%
                    {row.isWorkingCase ? (
                      <span className="ml-2 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                        Working
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {row.equityKickerPct != null ? `${row.equityKickerPct}%` : "—"}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.financingCost)}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {row.netProfitBeforeEquityKicker != null
                      ? formatInvestorEur(row.netProfitBeforeEquityKicker)
                      : "—"}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono tabular-nums text-foreground">
                    {row.equityKickerAmount != null
                      ? formatInvestorEur(row.equityKickerAmount)
                      : "—"}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums text-foreground">
                    {formatInvestorEur(row.netMargin)}
                  </td>
                  <td className="max-w-xs py-3 pl-4 text-xs leading-relaxed text-muted-foreground">
                    {row.structure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-border bg-muted/20 p-5"
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Model assumptions
        </p>
        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
          {investorEconomicsModelNotes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
