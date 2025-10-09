// Analytics tracking utilities

export interface VisitData {
  timestamp: string;
  url: string;
  referrer: string;
  userAgent: string;
  screen: {
    width: number;
    height: number;
  };
  viewport: {
    width: number;
    height: number;
  };
  sessionId: string;
  userId?: string;
}

export interface PageViewData extends VisitData {
  title: string;
  path: string;
  duration?: number;
}

export interface EventData {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  sessionId: string;
  userId?: string;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private startTime: number;
  private pageStartTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageStartTime = Date.now();
    
    // Get or create user ID
    this.userId = this.getOrCreateUserId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getOrCreateUserId(): string {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  private hasConsent(): boolean {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) return false;
    
    const preferences = JSON.parse(consent);
    return preferences.analytics === true;
  }

  private getVisitData(): VisitData {
    return {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      sessionId: this.sessionId,
      userId: this.userId,
    };
  }

  trackPageView(title?: string): void {
    if (!this.hasConsent()) return;

    const duration = Date.now() - this.pageStartTime;
    const pageData: PageViewData = {
      ...this.getVisitData(),
      title: title || document.title,
      path: window.location.pathname,
      duration,
    };

    // Store in localStorage
    this.storeData('page_views', pageData);
    
    // Send to analytics service (placeholder)
    this.sendToAnalytics('page_view', pageData);
    
    // Reset page start time
    this.pageStartTime = Date.now();
  }

  trackEvent(category: string, action: string, label?: string, value?: number): void {
    if (!this.hasConsent()) return;

    const eventData: EventData = {
      event: 'custom_event',
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.storeData('events', eventData);
    this.sendToAnalytics('event', eventData);
  }

  trackClick(element: string, location: string): void {
    this.trackEvent('engagement', 'click', `${element} - ${location}`);
  }

  trackScroll(depth: number): void {
    this.trackEvent('engagement', 'scroll', `depth_${Math.floor(depth / 25) * 25}%`);
  }

  trackTimeOnPage(): void {
    const duration = Date.now() - this.startTime;
    this.trackEvent('engagement', 'time_on_page', `duration_${Math.floor(duration / 10000) * 10}s`);
  }

  trackFormSubmit(formName: string): void {
    this.trackEvent('conversion', 'form_submit', formName);
  }

  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent('engagement', 'download', `${fileName}.${fileType}`);
  }

  trackOutboundLink(url: string): void {
    this.trackEvent('engagement', 'outbound_click', url);
  }

  private storeData(type: string, data: any): void {
    const key = `analytics_${type}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    stored.push(data);
    
    // Keep only last 1000 items to prevent localStorage bloat
    if (stored.length > 1000) {
      stored.splice(0, stored.length - 1000);
    }
    
    localStorage.setItem(key, JSON.stringify(stored));
  }

  private sendToAnalytics(type: string, data: any): void {
    // In a real implementation, this would send data to your analytics service
    // For now, we'll just log it and could send to a custom endpoint
    console.log(`Analytics ${type}:`, data);
    
    // Example: Send to custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, data })
    // }).catch(console.error);
  }

  // Get analytics data for admin dashboard
  getAnalyticsData(): { pageViews: PageViewData[], events: EventData[] } {
    return {
      pageViews: JSON.parse(localStorage.getItem('analytics_page_views') || '[]'),
      events: JSON.parse(localStorage.getItem('analytics_events') || '[]'),
    };
  }

  // Get visitor insights
  getVisitorInsights(): {
    totalVisits: number;
    uniqueVisitors: number;
    topPages: { path: string; views: number }[];
    referrers: { referrer: string; visits: number }[];
    devices: { userAgent: string; visits: number }[];
  } {
    const pageViews = JSON.parse(localStorage.getItem('analytics_page_views') || '[]');
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    
    // Calculate insights
    const uniqueVisitors = new Set(pageViews.map((pv: PageViewData) => pv.userId)).size;
    const totalVisits = pageViews.length;
    
    // Top pages
    const pageCounts: { [key: string]: number } = {};
    pageViews.forEach((pv: PageViewData) => {
      pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    
    // Referrers
    const referrerCounts: { [key: string]: number } = {};
    pageViews.forEach((pv: PageViewData) => {
      const referrer = pv.referrer || 'direct';
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    });
    const referrers = Object.entries(referrerCounts)
      .map(([referrer, visits]) => ({ referrer, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
    
    // Devices (simplified user agent parsing)
    const deviceCounts: { [key: string]: number } = {};
    pageViews.forEach((pv: PageViewData) => {
      const device = this.parseUserAgent(pv.userAgent);
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    const devices = Object.entries(deviceCounts)
      .map(([userAgent, visits]) => ({ userAgent, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
    
    return {
      totalVisits,
      uniqueVisitors,
      topPages,
      referrers,
      devices,
    };
  }

  private parseUserAgent(userAgent: string): string {
    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    if (userAgent.includes('Macintosh')) return 'Mac';
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Linux')) return 'Linux';
    return 'Other';
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Auto-track page views on route changes (for Next.js)
export function trackRouteChange(url: string, title?: string): void {
  analytics.trackPageView(title);
}

// Hook for React components
export function useAnalytics() {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
    trackOutboundLink: analytics.trackOutboundLink.bind(analytics),
  };
}
