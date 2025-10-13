"use client";

import { useState, useEffect } from "react";
import { getStorageStats, formatBytes, getUsageColor, getUsageMessage } from "@/lib/storage-monitor";

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  totalSizeMB: number;
  usagePercentage: number;
  filesByType: Record<string, { count: number; size: number }>;
  freeTierLimitMB: number;
  remainingMB: number;
}

export function StorageDashboard() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStorageStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch storage stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <p className="text-muted-foreground">Failed to load storage statistics</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6">
      <div className="mb-6">
        <h2 className="font-sans text-lg font-medium text-foreground mb-2">
          Storage Usage
        </h2>
        <p className="text-sm text-muted-foreground">
          {getUsageMessage(stats.usagePercentage)}
        </p>
      </div>

      {/* Usage Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">
            {formatBytes(stats.totalSize)} / {formatBytes(stats.freeTierLimitMB * 1024 * 1024)}
          </span>
          <span className={`text-sm font-medium ${getUsageColor(stats.usagePercentage)}`}>
            {stats.usagePercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              stats.usagePercentage < 50 
                ? 'bg-green-500' 
                : stats.usagePercentage < 80 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(stats.usagePercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {stats.remainingMB.toFixed(1)} MB remaining
        </p>
      </div>

      {/* File Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{stats.totalFiles}</div>
          <div className="text-xs text-muted-foreground">Total Files</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {Object.keys(stats.filesByType).length}
          </div>
          <div className="text-xs text-muted-foreground">File Types</div>
        </div>
      </div>

      {/* File Types Breakdown */}
      {Object.keys(stats.filesByType).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">File Types</h3>
          <div className="space-y-2">
            {Object.entries(stats.filesByType)
              .sort(([,a], [,b]) => b.size - a.size)
              .map(([type, data]) => (
                <div key={type} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground uppercase">{type}</span>
                  <div className="text-right">
                    <div className="font-medium">{data.count} files</div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(data.size)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Free Tier Info */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Free Tier Limits</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• 1GB storage (Supabase)</div>
          <div>• 2GB bandwidth/month</div>
          <div>• Unlimited requests</div>
        </div>
      </div>
    </div>
  );
}
