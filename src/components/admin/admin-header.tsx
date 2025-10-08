"use client";

import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="border-b border-border bg-card px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && (
          <Link
            href={action.href}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90"
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}

