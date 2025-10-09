"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { FormField, Input } from "@/components/admin/form-field";
import { Toggle } from "@/components/admin/toggle";

interface InstagramSettings {
  username: string;
  accessToken: string;
  isConnected: boolean;
  autoSync: boolean;
  syncInterval: number; // in hours
  lastSync: string | null;
  postCount: number;
}

export default function InstagramPage() {
  const [settings, setSettings] = useState<InstagramSettings>({
    username: "",
    accessToken: "",
    isConnected: false,
    autoSync: true,
    syncInterval: 24,
    lastSync: null,
    postCount: 0,
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load settings on mount
  useEffect(() => {
    // TODO: Load from API/database
    const mockSettings = {
      username: "ejproperties",
      accessToken: "",
      isConnected: false,
      autoSync: true,
      syncInterval: 24,
      lastSync: null,
      postCount: 0,
    };
    setSettings(mockSettings);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // TODO: Implement Instagram Basic Display API connection
      // This would typically redirect to Instagram OAuth
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setSettings(prev => ({
        ...prev,
        isConnected: true,
        lastSync: new Date().toISOString(),
        postCount: 12, // Mock count
      }));
      
      alert("Instagram connected successfully!");
    } catch (error) {
      console.error("Failed to connect Instagram:", error);
      alert("Failed to connect Instagram. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      // TODO: Sync Instagram posts
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setSettings(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        postCount: prev.postCount + 3, // Mock new posts
      }));
      
      alert("Instagram feed synced successfully!");
    } catch (error) {
      console.error("Failed to sync Instagram:", error);
      alert("Failed to sync Instagram feed. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm("Are you sure you want to disconnect Instagram? This will stop automatic syncing.")) {
      setSettings(prev => ({
        ...prev,
        isConnected: false,
        accessToken: "",
        lastSync: null,
        postCount: 0,
      }));
    }
  };

  return (
    <div>
      <AdminHeader 
        title="Instagram Feed" 
        description="Connect and manage your Instagram feed for the website"
      />

      <div className="p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Connection Status */}
          <div className="rounded-2xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Connection Status</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  settings.isConnected ? "bg-green-100" : "bg-gray-100"
                }`}>
                  <svg className={`h-6 w-6 ${settings.isConnected ? "text-green-600" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans text-lg font-medium text-foreground">
                    {settings.isConnected ? "Connected" : "Not Connected"}
                  </h3>
                  <p className="text-sm text-muted-foreground/60">
                    {settings.isConnected 
                      ? `@${settings.username} • ${settings.postCount} posts synced`
                      : "Connect your Instagram account to display posts on your website"
                    }
                  </p>
                  {settings.lastSync && (
                    <p className="text-xs text-muted-foreground/50">
                      Last synced: {new Date(settings.lastSync).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                {settings.isConnected ? (
                  <>
                    <button
                      onClick={handleSync}
                      disabled={isSyncing}
                      className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {isSyncing ? "Syncing..." : "Sync Now"}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {isConnecting ? "Connecting..." : "Connect Instagram"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          {settings.isConnected && (
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Settings</h2>
              
              <div className="grid gap-6">
                <FormField
                  label="Instagram Username"
                  description="Your Instagram handle (without @)"
                >
                  <Input
                    value={settings.username}
                    onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                    placeholder="ejproperties"
                  />
                </FormField>

                <div className="space-y-4">
                  <Toggle
                    id="autoSync"
                    name="autoSync"
                    label="Automatic Sync"
                    description="Automatically sync Instagram posts at regular intervals"
                    defaultChecked={settings.autoSync}
                    onChange={(checked) => setSettings({ ...settings, autoSync: checked })}
                  />
                </div>

                {settings.autoSync && (
                  <FormField
                    label="Sync Interval"
                    description="How often to sync posts (in hours)"
                  >
                    <select
                      value={settings.syncInterval}
                      onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) })}
                      className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:border-foreground/50 focus:outline-none"
                    >
                      <option value={1}>Every hour</option>
                      <option value={6}>Every 6 hours</option>
                      <option value={12}>Every 12 hours</option>
                      <option value={24}>Every 24 hours</option>
                      <option value={168}>Every week</option>
                    </select>
                  </FormField>
                )}
              </div>
            </div>
          )}

          {/* Recent Posts Preview */}
          {settings.isConnected && (
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h2 className="mb-6 font-sans text-lg font-medium text-foreground">Recent Posts</h2>
              
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: Math.min(6, settings.postCount) }).map((_, index) => (
                  <div key={index} className="group overflow-hidden rounded-lg border border-border/30 bg-muted/20">
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <svg className="h-12 w-12 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground/60">Post {index + 1}</p>
                      <p className="text-xs text-muted-foreground/40">Instagram content</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {settings.postCount === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground/60">No posts synced yet</p>
                  <p className="text-xs text-muted-foreground/40">Click "Sync Now" to fetch your Instagram posts</p>
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-xs text-blue-800">
                <p className="font-medium">How Instagram Integration Works</p>
                <ul className="mt-1 list-disc list-inside space-y-0.5">
                  <li>Connect your Instagram account using Instagram Basic Display API</li>
                  <li>Posts are automatically synced and displayed on your website</li>
                  <li>Recent posts appear in the homepage feed</li>
                  <li>Set sync intervals to keep content fresh</li>
                  <li>Posts are cached for fast loading</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
