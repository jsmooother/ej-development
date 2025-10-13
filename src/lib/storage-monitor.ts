/**
 * Storage usage monitoring for free tier limits
 */

export interface StorageStats {
  totalFiles: number;
  totalSize: number; // in bytes
  totalSizeMB: number;
  usagePercentage: number; // of 1GB free tier
  filesByType: Record<string, { count: number; size: number }>;
}

export async function getStorageStats(): Promise<StorageStats> {
  try {
    const response = await fetch('/api/storage/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch storage stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    return {
      totalFiles: 0,
      totalSize: 0,
      totalSizeMB: 0,
      usagePercentage: 0,
      filesByType: {}
    };
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getUsageColor(percentage: number): string {
  if (percentage < 50) return 'text-green-600';
  if (percentage < 80) return 'text-yellow-600';
  return 'text-red-600';
}

export function getUsageMessage(percentage: number): string {
  if (percentage < 50) return 'Storage usage is healthy';
  if (percentage < 80) return 'Storage usage is getting high';
  return 'Storage usage is critical - consider upgrading or cleaning up';
}
