"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    } else {
      // Load saved preferences
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
    setIsVisible(false);
    
    // Initialize tracking
    initializeAnalytics();
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setIsVisible(false);
    setIsPreferencesOpen(false);
    
    // Initialize tracking if analytics is enabled
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
  };

  const initializeAnalytics = () => {
    // Track page visit
    trackPageView();
    
    // Initialize Google Analytics or other tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: preferences.marketing ? 'granted' : 'denied',
      });
    }
  };

  const trackPageView = () => {
    // Simple analytics tracking
    const visitData = {
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
    };

    // Store in localStorage (in a real app, this would be sent to your analytics service)
    const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    analytics.push(visitData);
    
    // Keep only last 100 visits to prevent localStorage bloat
    if (analytics.length > 100) {
      analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('analytics', JSON.stringify(analytics));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="mx-auto max-w-7xl px-6 py-6">
          {!isPreferencesOpen ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-sm text-gray-600">
                    We use necessary cookies to make our site work. We'd also like to set analytics cookies to help us improve it. 
                    We won't set optional cookies unless you enable them. Using this tool will set a cookie on your device to remember your preferences.
                  </p>
                  <p className="text-xs text-gray-500">
                    For more detailed information, see our{" "}
                    <Link href="/privacy" className="underline hover:text-gray-700">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/cookies" className="underline hover:text-gray-700">
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleAcceptAll}
                  className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={handleRejectAll}
                  className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setIsPreferencesOpen(true)}
                  className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Manage Preferences
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setIsPreferencesOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Necessary Cookies</h4>
                    <p className="text-sm text-gray-600">
                      These cookies are essential for the website to function properly.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-5 w-9 rounded-full bg-gray-300">
                      <div className="h-5 w-5 rounded-full bg-gray-600 translate-x-4"></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-500">Always Active</span>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Analytics Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                    className={`h-5 w-9 rounded-full transition-colors ${
                      preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketing Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Used to track visitors across websites for advertising purposes.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                    className={`h-5 w-9 rounded-full transition-colors ${
                      preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      preferences.marketing ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
                
                {/* Functional Cookies */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Functional Cookies</h4>
                    <p className="text-sm text-gray-600">
                      Enable enhanced functionality and personalization features.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                    className={`h-5 w-9 rounded-full transition-colors ${
                      preferences.functional ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      preferences.functional ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleSavePreferences}
                  className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setIsPreferencesOpen(false)}
                  className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
