"use client";

import { useMemo } from "react";
import { slugify } from "@/lib/utils";
import { InvestorNav } from "./InvestorNav";
import { InvestorSection } from "./InvestorSection";
import { MarkdownRenderer } from "./MarkdownRenderer";

type InvestorPresentationProps = {
  content: string;
};

type ParsedSection = {
  id: string;
  title: string;
  body: string;
};

function parseSections(content: string): ParsedSection[] {
  if (!content.trim()) return [];

  const sections: ParsedSection[] = [];
  const parts = content.split(/^# /m).filter(Boolean);

  for (const part of parts) {
    const firstNewline = part.indexOf("\n");
    const title = firstNewline >= 0 ? part.slice(0, firstNewline).trim() : part.trim();
    const body = firstNewline >= 0 ? part.slice(firstNewline + 1).trim() : "";

    if (!title) continue;

    const id = slugify(title);
    if (!id) continue;

    sections.push({ id, title, body: `# ${title}${body ? `\n\n${body}` : ""}` });
  }

  return sections;
}

export function InvestorPresentation({ content }: InvestorPresentationProps) {
  const sections = useMemo(() => parseSections(content), [content]);

  if (sections.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-center text-muted-foreground">
        No content available.
      </div>
    );
  }

  const navItems = sections.map((s) => ({ id: s.id, title: s.title }));

  return (
    <div className="mx-auto max-w-6xl px-6 pt-12 pb-24">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <InvestorNav items={navItems} className="lg:w-56" />
        <div className="min-w-0 flex-1">
          {sections.map((section) => (
            <InvestorSection key={section.id} id={section.id}>
              <MarkdownRenderer content={section.body} />
            </InvestorSection>
          ))}
        </div>
      </div>
    </div>
  );
}
