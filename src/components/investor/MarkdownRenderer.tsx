"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

const headingClasses = {
  h1: "font-serif text-4xl font-light text-foreground md:text-5xl",
  h2: "font-serif text-2xl font-light text-foreground mt-10 mb-4",
  h3: "font-serif text-xl font-medium text-foreground mt-8 mb-3",
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("investor-prose", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={headingClasses.h1}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className={headingClasses.h2}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={headingClasses.h3}>{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed text-foreground">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 list-disc space-y-2 pl-6 text-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 list-decimal space-y-2 pl-6 text-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          hr: () => (
            <hr className="my-12 border-border" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-6 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="mb-8 overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted/50 px-4 py-3 text-left text-sm font-medium text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-3 text-sm text-foreground">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-border last:border-b-0">{children}</tr>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
