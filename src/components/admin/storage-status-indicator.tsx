"use client";

import { useState, useEffect } from 'react';
import { Database, HardDrive, AlertTriangle, CheckCircle } from 'lucide-react';

interface StorageStats {
  totalBytes: number;
  totalFiles: number;
  freeTierLimitMB: number;
  remainingMB: number;
  usagePercentage: number;
  fileTypes: Array<{
    name: string;
    files: number;
    bytes: number;
  }>;
}

interface StorageStatusIndicatorProps {
  className?: string;
}

export function StorageStatusIndicator({ className = "" }: StorageStatusIndicatorProps) {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStorageStats();
  }, []);

  const fetchStorageStats = async () => {
    try {
      const response = await fetch('/api/storage/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching storage stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="h-4 w-4" />;
    if (percentage >= 75) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <HardDrive className="h-4 w-4 animate-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
        <HardDrive className="h-4 w-4" />
        <span>Storage unavailable</span>
      </div>
    );
  }

  return (
    <>
      {/* Compact Status Indicator */}
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted/50 ${className}`}
        title="Click for detailed storage information"
      >
        <HardDrive className="h-4 w-4" />
        <span className="font-medium">Storage</span>
        <div className={`flex items-center gap-1 ${getStatusColor(stats.usagePercentage)}`}>
          {getStatusIcon(stats.usagePercentage)}
          <span className="text-xs">
            {formatBytes(stats.totalBytes)} / {stats.freeTierLimitMB}MB
          </span>
        </div>
      </button>

      {/* Detailed Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg border border-border bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Database className="h-5 w-5" />
                Storage Usage Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status Overview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className={`text-sm font-medium ${getStatusColor(stats.usagePercentage)}`}>
                  {stats.usagePercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    stats.usagePercentage >= 90 ? 'bg-red-500' :
                    stats.usagePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(stats.usagePercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatBytes(stats.totalBytes)} used</span>
                <span>{stats.remainingMB.toFixed(1)} MB remaining</span>
              </div>
            </div>

            {/* File Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg border border-border p-4">
                <div className="text-2xl font-bold">{stats.totalFiles}</div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-2xl font-bold">{stats.fileTypes.length}</div>
                <div className="text-sm text-muted-foreground">File Types</div>
              </div>
            </div>

            {/* File Types Breakdown */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">File Types</h3>
              <div className="space-y-2">
                {stats.fileTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{type.files} files</div>
                      <div className="text-xs text-muted-foreground">{formatBytes(type.bytes)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Free Tier Limits */}
            <div className="rounded-lg border border-border p-4 bg-muted/20">
              <h3 className="text-sm font-medium mb-3">Free Tier Limits</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>• 1GB storage (Supabase)</div>
                <div>• 2GB bandwidth/month</div>
                <div>• Unlimited requests</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
