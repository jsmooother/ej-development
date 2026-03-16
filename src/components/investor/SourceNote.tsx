"use client";

import Link from "next/link";

type SourceNoteProps = {
  label: string;
  type?: string;
  href?: string;
};

export function SourceNote({ label, type, href }: SourceNoteProps) {
  return (
    <p className="text-xs text-muted-foreground">
      {type && <span className="uppercase tracking-wider">{type}</span>}
      {type && " · "}
      {href ? (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-muted-foreground/50 underline-offset-2 transition-colors hover:text-foreground"
        >
          {label}
        </Link>
      ) : (
        <span>{label}</span>
      )}
    </p>
  );
}
