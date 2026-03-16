"use client";

import { InvestorHero } from "./InvestorHero";
import { InvestorExecutiveSummary } from "./InvestorExecutiveSummary";
import { InvestorFundingOpportunity } from "./InvestorFundingOpportunity";
import { InvestorWhyThisProject } from "./InvestorWhyThisProject";
import { InvestorSitePlanning } from "./InvestorSitePlanning";
import { InvestorMarketEvidence } from "./InvestorMarketEvidence";
import { InvestorDevelopmentConcept } from "./InvestorDevelopmentConcept";
import { InvestorExecutionPlan } from "./InvestorExecutionPlan";
import { InvestorKeyRisks } from "./InvestorKeyRisks";
import { InvestorTeamReferences } from "./InvestorTeamReferences";
import { InvestorPreliminaryEconomics } from "./InvestorPreliminaryEconomics";
import { InvestorSourcesDisclaimer } from "./InvestorSourcesDisclaimer";

type InvestorPresentationProps = {
  content: string;
};

export function InvestorPresentation({ content: _content }: InvestorPresentationProps) {
  return (
    <div className="relative">
      <main className="pt-16">
        <InvestorHero />
        <InvestorExecutiveSummary />
        <InvestorFundingOpportunity />
        <InvestorWhyThisProject />
        <InvestorSitePlanning />
        <InvestorMarketEvidence />
        <InvestorDevelopmentConcept />
        <InvestorExecutionPlan />
        <InvestorKeyRisks />
        <InvestorTeamReferences />
        <InvestorPreliminaryEconomics />
        <InvestorSourcesDisclaimer />
      </main>
    </div>
  );
}
