"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input, Textarea } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  lastLogin: string;
  isActive: boolean;
}

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
  const [activeTab, setActiveTab] = useState<"general" | "users" | "seo">("general");

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

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Jesper Kreuger",
      email: "jesper@ejproperties.com",
      role: "admin",
      lastLogin: "2025-01-09T10:30:00Z",
      isActive: true,
    },
    {
      id: "2",
      name: "Sarah Martinez",
      email: "sarah@ejproperties.com",
      role: "editor",
      lastLogin: "2025-01-08T15:45:00Z",
      isActive: true,
    },
    {
      id: "3",
      name: "Carlos Rodriguez",
      email: "carlos@ejproperties.com",
      role: "editor",
      lastLogin: "2025-01-07T09:20:00Z",
      isActive: false,
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "editor" as const,
  });

  const rolePermissions = {
    admin: ["All access", "User management", "Settings"],
    editor: ["Editorials", "Projects", "Listings", "Instagram"],
    viewer: ["View only", "Editorials"],
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        lastLogin: new Date().toISOString(),
        isActive: true,
      };
      setUsers([...users, user]);
      setNewUser({ name: "", email: "", role: "editor" });
    }
  };

  const handleToggleUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleUpdateRole = (userId: string, newRole: "admin" | "editor" | "viewer") => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "users", label: "Users" },
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

          {/* User Management */}
          {activeTab === "users" && (
            <div className="space-y-8">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-sans text-lg font-medium text-foreground">User Management</h2>
                  <div className="text-sm text-muted-foreground">
                    {users.filter(u => u.isActive).length} active users
                  </div>
                </div>

                {/* Add New User */}
                <div className="mb-8 rounded-lg border border-dashed border-border/50 bg-muted/20 p-6">
                  <h3 className="mb-4 font-medium text-foreground">Add New User</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <FormField label="Name" required>
                      <Input
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </FormField>

                    <FormField label="Email" required>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="john@ejproperties.com"
                      />
                    </FormField>

                    <FormField label="Role">
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                        className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </FormField>

                    <div className="flex items-end">
                      <button
                        onClick={handleAddUser}
                        className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:bg-foreground/90"
                      >
                        Add User
                      </button>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between rounded-lg border border-border/30 bg-card p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{user.name}</h3>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground/60">{user.email}</p>
                          <p className="text-xs text-muted-foreground/50">
                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value as any)}
                          className="rounded-md border border-border/50 bg-background px-3 py-1.5 text-sm focus:border-foreground/50 focus:outline-none"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>

                        <Toggle
                          id={`toggle-${user.id}`}
                          name={`toggle-${user.id}`}
                          label=""
                          defaultChecked={user.isActive}
                          onChange={() => handleToggleUser(user.id)}
                        />

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-md p-1.5 text-muted-foreground/40 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete user"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Permissions */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Role Permissions</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {Object.entries(rolePermissions).map(([role, permissions]) => (
                    <div key={role} className="rounded-lg border border-border/30 bg-muted/10 p-4">
                      <h3 className="mb-3 font-medium text-foreground capitalize">{role}</h3>
                      <ul className="space-y-1">
                        {permissions.map((permission, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground/60">
                            <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
