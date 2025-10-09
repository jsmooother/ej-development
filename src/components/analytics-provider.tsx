"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView();

    // Track scroll depth
    let scrollDepth = 0;
    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;
      const newScrollDepth = Math.round((scrolled / (documentHeight - windowHeight)) * 100);
      
      if (newScrollDepth > scrollDepth && newScrollDepth % 25 === 0) {
        analytics.trackScroll(newScrollDepth);
        scrollDepth = newScrollDepth;
      }
    };

    // Track time on page
    const trackTime = () => {
      analytics.trackTimeOnPage();
    };

    // Add event listeners
    window.addEventListener('scroll', trackScroll, { passive: true });
    
    // Track time on page when user leaves
    const handleBeforeUnload = () => {
      trackTime();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track clicks on links and buttons
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        if (link.hostname !== window.location.hostname) {
          analytics.trackOutboundLink(link.href);
        }
      }
      
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.closest('button') || target;
        const buttonText = button.textContent?.trim() || 'button';
        analytics.trackClick(buttonText, pathname);
      }
    };

    document.addEventListener('click', handleClick);

    // Track form submissions
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      const formName = form.name || form.id || 'form';
      analytics.trackFormSubmit(formName);
    };

    document.addEventListener('submit', handleFormSubmit);

    // Track downloads
    const handleDownload = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && (link.download || link.href.match(/\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i))) {
        const fileName = link.download || link.href.split('/').pop() || 'file';
        const fileType = fileName.split('.').pop() || 'unknown';
        analytics.trackDownload(fileName, fileType);
      }
    };

    document.addEventListener('click', handleDownload);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleFormSubmit);
      document.removeEventListener('click', handleDownload);
    };
  }, [pathname]);

  return <>{children}</>;
}
