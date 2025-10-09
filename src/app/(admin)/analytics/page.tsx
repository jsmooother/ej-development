"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { analytics } from "@/lib/analytics";

interface VisitorInsights {
  totalVisits: number;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  referrers: { referrer: string; visits: number }[];
  devices: { userAgent: string; visits: number }[];
}

export default function AnalyticsPage() {
  const [insights, setInsights] = useState<VisitorInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load analytics data
    const data = analytics.getAnalyticsData();
    const visitorInsights = analytics.getVisitorInsights();
    
    setInsights(visitorInsights);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div>
        <AdminHeader 
          title="Analytics" 
          description="Website visitor insights and traffic analytics."
        />
        <div className="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader 
        title="Analytics" 
        description="Website visitor insights and traffic analytics."
      />
      
      <div className="p-8">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Total Visits</p>
                <p className="mt-2 text-3xl font-sans font-normal text-foreground">{insights?.totalVisits || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Unique Visitors</p>
                <p className="mt-2 text-3xl font-sans font-normal text-foreground">{insights?.uniqueVisitors || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Top Page</p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {insights?.topPages[0]?.path || 'No data'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {insights?.topPages[0]?.views || 0} views
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Top Referrer</p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {insights?.referrers[0]?.referrer === 'direct' ? 'Direct Traffic' : insights?.referrers[0]?.referrer || 'No data'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {insights?.referrers[0]?.visits || 0} visits
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Top Pages */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/30 px-6 py-5">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Top Pages</h2>
            </div>
            <div className="divide-y divide-border/30">
              {insights?.topPages.slice(0, 10).map((page, index) => (
                <div key={page.path} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-xs font-medium text-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{page.path}</p>
                      <p className="text-xs text-muted-foreground/60">{page.views} views</p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No page view data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/30 px-6 py-5">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Traffic Sources</h2>
            </div>
            <div className="divide-y divide-border/30">
              {insights?.referrers.slice(0, 10).map((referrer, index) => (
                <div key={referrer.referrer} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-xs font-medium text-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {referrer.referrer === 'direct' ? 'Direct Traffic' : 
                         referrer.referrer === '' ? 'Unknown' : 
                         new URL(referrer.referrer).hostname}
                      </p>
                      <p className="text-xs text-muted-foreground/60">{referrer.visits} visits</p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No referrer data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Device Types */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/30 px-6 py-5">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Device Types</h2>
            </div>
            <div className="divide-y divide-border/30">
              {insights?.devices.slice(0, 10).map((device, index) => (
                <div key={device.userAgent} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-xs font-medium text-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{device.userAgent}</p>
                      <p className="text-xs text-muted-foreground/60">{device.visits} visits</p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="px-6 py-12 text-center">
                  <p className="text-sm text-muted-foreground">No device data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Cookie Consent Status */}
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
            <div className="border-b border-border/30 px-6 py-5">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground/60">Privacy & Cookies</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Cookie Consent Given</span>
                <span className="text-sm text-muted-foreground">
                  {localStorage.getItem('cookie-consent') ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Analytics Enabled</span>
                <span className="text-sm text-muted-foreground">
                  {(() => {
                    const consent = localStorage.getItem('cookie-consent');
                    if (!consent) return 'No';
                    const preferences = JSON.parse(consent);
                    return preferences.analytics ? 'Yes' : 'No';
                  })()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Marketing Cookies</span>
                <span className="text-sm text-muted-foreground">
                  {(() => {
                    const consent = localStorage.getItem('cookie-consent');
                    if (!consent) return 'No';
                    const preferences = JSON.parse(consent);
                    return preferences.marketing ? 'Yes' : 'No';
                  })()}
                </span>
              </div>
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground/60">
                  This data is stored locally and helps understand visitor behavior. 
                  No personal information is collected without consent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="mt-8 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Analytics Data</h3>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Manage stored analytics data and visitor insights
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all analytics data?')) {
                    localStorage.removeItem('analytics_page_views');
                    localStorage.removeItem('analytics_events');
                    localStorage.removeItem('analytics_user_id');
                    window.location.reload();
                  }
                }}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                Clear Data
              </button>
              <button
                onClick={() => {
                  const data = analytics.getAnalyticsData();
                  const insights = analytics.getVisitorInsights();
                  const exportData = {
                    timestamp: new Date().toISOString(),
                    insights,
                    rawData: data,
                  };
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
