"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";


interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "EJ Properties",
    siteDescription: "Luxury property development and design in Marbella",
    contactEmail: "hello@ejproperties.com",
    contactPhone: "+34 123 456 789",
    address: "Marbella, Spain",
    socialMedia: {
      instagram: "@ejproperties",
      linkedin: "ej-properties",
      twitter: "@ejproperties",
    },
    seo: {
      metaTitle: "EJ Properties - Luxury Property Development Marbella",
      metaDescription: "Premium property development and design services in Marbella. Creating exceptional homes with architectural integrity and sustainable luxury.",
      metaKeywords: "marbella, luxury property, real estate, design, development, spain",
    },
  });


  const tabs = [
    { id: "general", label: "General" },
    { id: "seo", label: "SEO" },
  ];

  return (
    <div>
      <AdminHeader 
        title="Settings" 
        description="Manage your site settings, users, and integrations"
      />

      <div className="p-8">
        <div className="mx-auto max-w-6xl">
          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-1 rounded-2xl bg-white/50 backdrop-blur-xl p-1.5 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-foreground text-background shadow-sm"
                      : "text-muted-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-border/50 bg-card shadow-sm p-6">
                <h2 className="mb-6 font-sans text-lg font-normal tracking-tight text-foreground">Site Information</h2>
                <div className="grid gap-6">
                  <FormField label="Site Name" required>
                    <Input
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                      placeholder="EJ Properties"
                    />
                  </FormField>

                  <FormField label="Site Description">
                    <Textarea
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                      placeholder="Brief description of your business"
                      rows={3}
                      className="resize-y min-h-[80px]"
                    />
                  </FormField>

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField label="Contact Email" required>
                      <Input
                        type="email"
                        value={siteSettings.contactEmail}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                        placeholder="hello@ejproperties.com"
                      />
                    </FormField>

                    <FormField label="Contact Phone">
                      <Input
                        value={siteSettings.contactPhone}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                        placeholder="+34 123 456 789"
                      />
                    </FormField>
                  </div>

                  <FormField label="Address">
                    <Input
                      value={siteSettings.address}
                      onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                      placeholder="Marbella, Spain"
                    />
                  </FormField>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Social Media</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <FormField label="Instagram">
                    <Input
                      value={siteSettings.socialMedia.instagram}
                      onChange={(e) => setSiteSettings({ 
                        ...siteSettings, 
                        socialMedia: { ...siteSettings.socialMedia, instagram: e.target.value }
                      })}
                      placeholder="@ejproperties"
                    />
                  </FormField>

                  <FormField label="LinkedIn">
                    <Input
                      value={siteSettings.socialMedia.linkedin}
                      onChange={(e) => setSiteSettings({ 
                        ...siteSettings, 
                        socialMedia: { ...siteSettings.socialMedia, linkedin: e.target.value }
                      })}
                      placeholder="ej-properties"
                    />
                  </FormField>

                  <FormField label="Twitter">
                    <Input
                      value={siteSettings.socialMedia.twitter}
                      onChange={(e) => setSiteSettings({ 
                        ...siteSettings, 
                        socialMedia: { ...siteSettings.socialMedia, twitter: e.target.value }
                      })}
                      placeholder="@ejproperties"
                    />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === "seo" && (
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="mb-6 font-sans text-lg font-medium text-foreground">SEO Settings</h2>
              <div className="space-y-6">
                <FormField label="Meta Title" required>
                  <Input
                    value={siteSettings.seo.metaTitle}
                    onChange={(e) => setSiteSettings({ 
                      ...siteSettings, 
                      seo: { ...siteSettings.seo, metaTitle: e.target.value }
                    })}
                    placeholder="EJ Properties - Luxury Property Development Marbella"
                  />
                </FormField>

                <FormField label="Meta Description" required>
                  <Textarea
                    value={siteSettings.seo.metaDescription}
                    onChange={(e) => setSiteSettings({ 
                      ...siteSettings, 
                      seo: { ...siteSettings.seo, metaDescription: e.target.value }
                    })}
                    placeholder="Premium property development and design services in Marbella..."
                    rows={3}
                    className="resize-y min-h-[80px]"
                  />
                </FormField>

                <FormField label="Meta Keywords">
                  <Input
                    value={siteSettings.seo.metaKeywords}
                    onChange={(e) => setSiteSettings({ 
                      ...siteSettings, 
                      seo: { ...siteSettings.seo, metaKeywords: e.target.value }
                    })}
                    placeholder="marbella, luxury property, real estate, design, development"
                  />
                </FormField>
              </div>
            </div>
          )}


          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:bg-foreground/90 hover:shadow-md">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
