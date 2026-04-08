"use client";

import { useEffect, useState, useCallback } from "react";
import { InvestorPresentation } from "./InvestorPresentation";
import { InvestorHeader } from "./InvestorHeader";

const STORAGE_KEY = "ej_investor_access";

export function PasswordGate() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [content, setContent] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const checkAccess = useCallback(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "true";
  }, []);

  useEffect(() => {
    setHasAccess(checkAccess());
  }, [checkAccess]);

  useEffect(() => {
    if (!hasAccess) return;
    let cancelled = false;
    fetch("/api/investor/content")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load content");
        return res.text();
      })
      .then((text) => {
        if (!cancelled) setContent(text);
      })
      .catch((err) => {
        if (!cancelled) setContentError(err instanceof Error ? err.message : "Failed to load content");
      });
    return () => { cancelled = true; };
  }, [hasAccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/investor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string };
      if (res.ok && data.success) {
        localStorage.setItem(STORAGE_KEY, "true");
        setHasAccess(true);
        setPassword("");
      } else {
        setError(data.error ?? "Incorrect access code. Please try again.");
      }
    } catch {
      setError("Unable to verify. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHasAccess(false);
  };

  if (hasAccess === null) {
    return (
      <>
        <InvestorHeader showNav={false} />
        <div className="flex min-h-[60vh] items-center justify-center pt-24">
          <div className="h-8 w-8 animate-pulse rounded-full border-2 border-border border-t-primary" />
        </div>
      </>
    );
  }

  if (!hasAccess) {
    return (
      <>
        <InvestorHeader showNav={false} />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 pt-24">
        <div className="mx-auto w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Investor portal
            </p>
            <h1 className="font-serif text-2xl font-light leading-snug text-foreground md:text-3xl">
              Villa Elysia by EJ Properties and AMES Arquitectos
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              El Madroñal · Enter access code to view investor materials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Access code"
              className="w-full rounded-full border border-border bg-background px-6 py-3 text-center text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              autoFocus
              autoComplete="current-password"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full border border-transparent bg-foreground px-6 py-3 text-sm font-medium uppercase tracking-[0.3em] text-background transition-colors hover:bg-foreground/90"
            >
              Access
            </button>
          </form>
        </div>
      </div>
      </>
    );
  }

  if (contentError) {
    return (
      <>
        <InvestorHeader showNav={false} />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 pt-24">
        <p className="text-sm text-destructive">{contentError}</p>
        <button
          onClick={handleLogout}
          className="mt-4 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
        >
          Exit portal
        </button>
      </div>
      </>
    );
  }

  if (!content) {
    return (
      <>
        <InvestorHeader showNav onLogout={handleLogout} />
        <div className="flex min-h-[60vh] items-center justify-center pt-24">
          <div className="h-8 w-8 animate-pulse rounded-full border-2 border-border border-t-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <InvestorHeader showNav onLogout={handleLogout} />
      <InvestorPresentation content={content} />
    </>
  );
}
