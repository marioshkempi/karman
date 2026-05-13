// Components
export { TrackingScripts, TrackingNoscript } from "./tracking-scripts"
export { default as FacebookPixel } from "./facebook-pixel"
export {
  GoogleTagManager,
  GoogleTagManagerNoscript,
} from "./google-tag-manager"
export { default as GoogleAnalytics } from "./google-analytics"
export { default as PageViewTracker } from "./page-view-tracker"

// Hooks
export { useTracking } from "@lib/hooks/use-tracking"

// Data
export { getTrackingSettings } from "@lib/data/tracking-scripts"

// Types
export type {
  TrackingSettings,
  EcommerceItem,
  EcommerceEventData,
} from "@constants/tracking"
