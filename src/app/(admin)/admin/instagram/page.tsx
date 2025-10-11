"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Toggle } from "@/components/admin/toggle";

interface InstagramSettings {
  username: string | null;
  isConnected: boolean;
  autoSync: boolean;
  syncInterval: number; // in hours
  lastSync: string | null;
  postCount: number;
  tokenExpiresAt: string | null;
  tokenExpired: boolean;
}

interface InstagramPost {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption: string;
  mediaType: string;
  timestamp: string;
}

export default function InstagramPage() {
  const [settings, setSettings] = useState<InstagramSettings>({
    username: null,
    isConnected: false,
    autoSync: true,
    syncInterval: 24,
    lastSync: null,
    postCount: 0,
    tokenExpiresAt: null,
    tokenExpired: false,
  });

  const [recentPosts, setRecentPosts] = useState<InstagramPost[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load settings and posts on mount
  useEffect(() => {
    loadSettings();
    fetchInstagramPosts();

    // Check for OAuth callback messages
    const params = new URLSearchParams(window.location.search);
    const successMsg = params.get('success');
    const errorMsg = params.get('error');
    
    if (successMsg === 'connected') {
      setSuccess('Instagram connected successfully!');
      // Reload settings and trigger initial sync
      setTimeout(() => {
        loadSettings();
        handleSync();
      }, 1000);
      // Clean URL
      window.history.replaceState({}, '', '/admin/instagram');
    }
    
    if (errorMsg) {
      setError(decodeURIComponent(errorMsg));
      // Clean URL
      window.history.replaceState({}, '', '/admin/instagram');
    }
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/instagram/sync');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          username: data.username || null,
          isConnected: data.isConnected || false,
          lastSync: data.lastSync,
          tokenExpiresAt: data.tokenExpiresAt,
          tokenExpired: data.tokenExpired || false,
        }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch('/api/instagram/posts');
      if (response.ok) {
        const posts = await response.json();
        const postsArray = Array.isArray(posts) ? posts : [];
        setRecentPosts(postsArray.slice(0, 6));
        setSettings(prev => ({
          ...prev,
          postCount: postsArray.length,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setError(null);
    
    const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
    
    if (!appId) {
      setError('Instagram App ID not configured. Please add NEXT_PUBLIC_INSTAGRAM_APP_ID to your environment variables.');
      setIsConnecting(false);
      return;
    }

    // Build Instagram OAuth URL
    const redirectUri = `${window.location.origin}/api/instagram/callback`;
    const scope = 'user_profile,user_media';
    const responseType = 'code';
    
    const authUrl = new URL('https://api.instagram.com/oauth/authorize');
    authUrl.searchParams.append('client_id', appId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('response_type', responseType);
    
    // Redirect to Instagram authorization
    window.location.href = authUrl.toString();
  };

  const handleSync = async () => {
    if (!settings.isConnected) {
      setError('Please connect Instagram first');
      return;
    }
    
    setIsSyncing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/instagram/sync', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync posts');
      }
      
      const result = await response.json();
      
      setSuccess(`Successfully synced ${result.count} posts from Instagram!`);
      
      // Reload settings and posts
      await loadSettings();
      await fetchInstagramPosts();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to sync Instagram: ${errorMessage}`);
      console.error("Failed to sync Instagram:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Instagram? This will stop automatic syncing and remove your access token.")) {
      return;
    }

    try {
      // TODO: Implement disconnect API endpoint to remove tokens from database
      setSettings(prev => ({
        ...prev,
        isConnected: false,
        username: null,
        lastSync: null,
        postCount: 0,
      }));
      setRecentPosts([]);
      setSuccess('Instagram disconnected successfully');
    } catch (error) {
      setError('Failed to disconnect Instagram');
      console.error("Failed to disconnect Instagram:", error);
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
          {/* Success Message */}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                </div>
                <button
                  onClick={() => setSuccess(null)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Token Expiration Warning */}
          {settings.isConnected && settings.tokenExpired && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Access token expired. Please reconnect Instagram to continue syncing posts.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-sans text-lg font-medium text-foreground">Recent Posts</h2>
                <span className="text-sm text-muted-foreground">{settings.postCount} posts synced</span>
              </div>
              
              {recentPosts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {recentPosts.map((post) => (
                    <a
                      key={post.id}
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group overflow-hidden rounded-lg border border-border/30 bg-muted/20 transition-all hover:border-border hover:shadow-md"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={post.thumbnailUrl || post.mediaUrl}
                          alt={post.caption || 'Instagram post'}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {post.mediaType === 'VIDEO' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        )}
                        {post.mediaType === 'CAROUSEL_ALBUM' && (
                          <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-2 text-xs text-muted-foreground/80">
                          {post.caption || 'No caption'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/50">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-3 text-sm font-medium text-muted-foreground/60">No posts synced yet</p>
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
                <ul className="mt-2 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Uses Instagram Basic Display API with OAuth 2.0 authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Access tokens last 60 days and are automatically refreshed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Posts are fetched and cached in your database for fast loading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Recent posts appear on your website's Instagram page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">•</span>
                    <span>Manual sync allows you to update posts anytime</span>
                  </li>
                </ul>
                <div className="mt-3 border-t border-blue-300/50 pt-3">
                  <p className="font-medium mb-1">Setup Requirements:</p>
                  <ol className="space-y-1 pl-4" style={{ listStyleType: 'decimal' }}>
                    <li>Create an app at <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="underline">Facebook Developers</a></li>
                    <li>Add Instagram Basic Display product to your app</li>
                    <li>Configure OAuth redirect URI in your app settings</li>
                    <li>Add app credentials to your environment variables</li>
                    <li>Click "Connect Instagram" to authorize</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
