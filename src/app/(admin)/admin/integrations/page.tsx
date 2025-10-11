"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toggle } from "@/components/admin/toggle";

interface IntegrationSettings {
  hubspot: {
    enabled: boolean;
    apiKey: string;
    portalId: string;
  };
  airtable: {
    enabled: boolean;
    apiKey: string;
    baseId: string;
    tableId: string;
  };
  googleAnalytics: {
    enabled: boolean;
    measurementId: string;
    trackingId: string;
  };
}

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<IntegrationSettings>({
    hubspot: {
      enabled: false,
      apiKey: "",
      portalId: "",
    },
    airtable: {
      enabled: false,
      apiKey: "",
      baseId: "",
      tableId: "",
    },
    googleAnalytics: {
      enabled: false,
      measurementId: "",
      trackingId: "",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Load settings from API or localStorage
    const savedSettings = localStorage.getItem("integrations");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading saved settings:", error);
      }
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Save to localStorage (later this can be saved to database)
      localStorage.setItem("integrations", JSON.stringify(settings));
      
      setMessage({ type: "success", text: "Integration settings saved successfully!" });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Integrations"
        description="Connect third-party services to enhance your workflow"
        action={{
          label: isSaving ? "Saving..." : "Save Changes",
          onClick: handleSave,
          disabled: isSaving,
        }}
      />

      <div className="p-6 space-y-6">
        {message && (
          <div
            className={`rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* HubSpot CRM */}
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.7 13.5c-.3 0-.5 0-.7.1V10c0-1-.8-1.8-1.8-1.8H10v-.6l.8-.8c.4.1.8.1 1.1.1 2.7 0 4.9-2.2 4.9-4.9S14.6 0 11.9 0 7 2.2 7 4.9c0 1 .3 2 .8 2.8l-.8.8H1.8C.8 8.5 0 9.3 0 10v13.1h10v-5.6c.2.1.5.1.7.1 1.5 0 2.7-1.2 2.7-2.7s-1.2-2.4-2.7-2.4zM11.9 2.5c1.3 0 2.4 1.1 2.4 2.4S13.2 7.3 11.9 7.3 9.5 6.2 9.5 4.9s1.1-2.4 2.4-2.4z"/>
                </svg>
                <h2 className="font-sans text-lg font-medium text-foreground">HubSpot CRM</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically sync enquiries to your HubSpot CRM for lead management and nurturing
              </p>
            </div>
            <Toggle
              id="hubspot-enabled"
              name="hubspot-enabled"
              label=""
              defaultChecked={settings.hubspot.enabled}
              onChange={(checked) =>
                setSettings({
                  ...settings,
                  hubspot: { ...settings.hubspot, enabled: checked },
                })
              }
            />
          </div>

          {settings.hubspot.enabled && (
            <div className="space-y-4 border-t border-border/30 pt-6">
              <div className="space-y-2">
                <label htmlFor="hubspot-api-key" className="text-sm font-medium text-foreground">
                  API Key
                </label>
                <input
                  id="hubspot-api-key"
                  type="password"
                  value={settings.hubspot.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hubspot: { ...settings.hubspot, apiKey: e.target.value },
                    })
                  }
                  placeholder="Enter your HubSpot API key"
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                />
                <p className="text-xs text-muted-foreground">
                  Find your API key in HubSpot Settings → Integrations → API Key
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="hubspot-portal-id" className="text-sm font-medium text-foreground">
                  Portal ID
                </label>
                <input
                  id="hubspot-portal-id"
                  type="text"
                  value={settings.hubspot.portalId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hubspot: { ...settings.hubspot, portalId: e.target.value },
                    })
                  }
                  placeholder="Enter your HubSpot Portal ID"
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                />
                <p className="text-xs text-muted-foreground">
                  Your Portal ID is in the URL: app.hubspot.com/contacts/[PORTAL_ID]
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">🚀 Free Tier Available</p>
                <p>HubSpot offers a free CRM with API access. <a href="https://www.hubspot.com/products/crm" target="_blank" rel="noopener noreferrer" className="underline">Learn more →</a></p>
              </div>
            </div>
          )}
        </div>

        {/* Airtable */}
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg className="h-6 w-6 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.208 3.293L1.793 5.708 8.5 12.415l6.707-6.707-2.415-2.415zm8 8L4.793 18.708l2.415 2.415L14.623 13.708l-2.415-2.415zm7.585-7.585l-6.708 6.707 2.415 2.415 6.707-6.708z"/>
                </svg>
                <h2 className="font-sans text-lg font-medium text-foreground">Airtable</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Use Airtable as a flexible CRM alternative with custom views and automation
              </p>
            </div>
            <Toggle
              id="airtable-enabled"
              name="airtable-enabled"
              label=""
              defaultChecked={settings.airtable.enabled}
              onChange={(checked) =>
                setSettings({
                  ...settings,
                  airtable: { ...settings.airtable, enabled: checked },
                })
              }
            />
          </div>

          {settings.airtable.enabled && (
            <div className="space-y-4 border-t border-border/30 pt-6">
              <div className="space-y-2">
                <label htmlFor="airtable-api-key" className="text-sm font-medium text-foreground">
                  API Key
                </label>
                <input
                  id="airtable-api-key"
                  type="password"
                  value={settings.airtable.apiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      airtable: { ...settings.airtable, apiKey: e.target.value },
                    })
                  }
                  placeholder="Enter your Airtable API key"
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                />
                <p className="text-xs text-muted-foreground">
                  Generate your API key at airtable.com/account
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="airtable-base-id" className="text-sm font-medium text-foreground">
                  Base ID
                </label>
                <input
                  id="airtable-base-id"
                  type="text"
                  value={settings.airtable.baseId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      airtable: { ...settings.airtable, baseId: e.target.value },
                    })
                  }
                  placeholder="appXXXXXXXXXXXXXX"
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="airtable-table-id" className="text-sm font-medium text-foreground">
                  Table Name
                </label>
                <input
                  id="airtable-table-id"
                  type="text"
                  value={settings.airtable.tableId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      airtable: { ...settings.airtable, tableId: e.target.value },
                    })
                  }
                  placeholder="Enquiries"
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">🚀 Free Tier Available</p>
                <p>Airtable's free plan includes API access. <a href="https://airtable.com/pricing" target="_blank" rel="noopener noreferrer" className="underline">View plans →</a></p>
              </div>
            </div>
          )}
        </div>

        {/* Google Analytics */}
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.84 2.998v18.004c0 .55-.446.996-.996.996h-2.99c-.55 0-.996-.446-.996-.996V2.998c0-.55.446-.996.996-.996h2.99c.55 0 .996.446.996.996zM15.008 8.996v12.006c0 .55-.446.996-.996.996h-2.99c-.55 0-.996-.446-.996-.996V8.996c0-.55.446-.996.996-.996h2.99c.55 0 .996.446.996.996zM7.008 15v6.002c0 .55-.446.996-.996.996H3.022c-.55 0-.996-.446-.996-.996V15c0-.55.446-.996.996-.996h2.99c.55 0 .996.446.996.996z"/>
                </svg>
                <h2 className="font-sans text-lg font-medium text-foreground">Google Analytics 4</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Track website traffic, user behavior, and conversion metrics with Google Analytics
              </p>
            </div>
            <Toggle
              id="ga-enabled"
              name="ga-enabled"
              label=""
              defaultChecked={settings.googleAnalytics.enabled}
              onChange={(checked) =>
                setSettings({
                  ...settings,
                  googleAnalytics: { ...settings.googleAnalytics, enabled: checked },
                })
              }
            />
          </div>

          {settings.googleAnalytics.enabled && (
            <div className="space-y-4 border-t border-border/30 pt-6">
              <div className="space-y-2">
                <label htmlFor="ga-measurement-id" className="text-sm font-medium text-foreground">
                  Measurement ID (GA4)
                </label>
                <input
                  id="ga-measurement-id"
                  type="text"
                  value={settings.googleAnalytics.measurementId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      googleAnalytics: { ...settings.googleAnalytics, measurementId: e.target.value },
                    })
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                />
                <p className="text-xs text-muted-foreground">
                  Find your Measurement ID in Google Analytics → Admin → Property → Data Streams
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">✨ Completely Free</p>
                <p>Google Analytics 4 is free for all users. <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Set up GA4 →</a></p>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                <p className="font-medium mb-1">⚠️ Implementation Required</p>
                <p>After enabling and saving, a developer will need to add the GA4 tracking code to your website's <code className="bg-yellow-100 px-1 rounded">layout.tsx</code> file.</p>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="rounded-2xl border border-dashed border-border/50 bg-muted/20 p-6">
          <h3 className="font-medium text-foreground mb-3">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These integrations require API keys from third-party services. All recommended options have free tiers or are completely free to use.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <a
              href="https://developers.hubspot.com/docs/api/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-2 hover:border-primary transition"
            >
              HubSpot API Docs →
            </a>
            <a
              href="https://airtable.com/developers/web/api/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-2 hover:border-primary transition"
            >
              Airtable API Docs →
            </a>
            <a
              href="https://developers.google.com/analytics/devguides/collection/ga4"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-4 py-2 hover:border-primary transition"
            >
              Google Analytics Docs →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

