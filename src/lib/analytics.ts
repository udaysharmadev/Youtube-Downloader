// A lightweight analytics abstraction layer.
// This is designed to be easily pluggable with real providers (Vercel Analytics, PostHog, Plausible) in the future.

type EventName = 
  | "download_initiated" 
  | "download_completed" 
  | "download_failed"
  | "format_selected" 
  | "github_cta_clicked"
  | "share_clicked";

export const trackEvent = (eventName: EventName, properties?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    // In a real production environment, you would push this to your analytics provider:
    // e.g. va.track(eventName, properties) or posthog.capture(eventName, properties)
    
    // For now, we log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics] ${eventName}`, properties || "");
    }
  }
};
