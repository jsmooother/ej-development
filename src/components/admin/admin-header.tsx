"use client";

import Link from "next/link";

interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
  };
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="border-b border-border/20 bg-white/80 px-8 py-8 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-1.5 text-sm text-muted-foreground/50">{description}</p>
          )}
        </div>
        {action && (
          <>
            {action.href ? (
              <Link
                href={action.href}
                className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                disabled={action.disabled}
                className="flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {action.label}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

