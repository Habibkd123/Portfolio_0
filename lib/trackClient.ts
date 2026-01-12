"use client";

export type TrackEventName = "view" | "click";

export type TrackPayload = {
  type: string;
  slug: string;
  event: TrackEventName;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

function fireGaEvent(payload: TrackPayload) {
  try {
    if (typeof window === "undefined") return
    if (typeof window.gtag !== "function") return

    const type = (payload.type || "").toLowerCase()
    const event = payload.event

    if (event === "view" && type === "project") {
      window.gtag("event", "project_view", { slug: payload.slug })
      return
    }

    if (event === "view" && (type === "case-study" || type === "casestudy" || type === "case_study")) {
      window.gtag("event", "case_study_view", { slug: payload.slug })
      return
    }

    if (event === "click" && (type === "cta" || type === "cta_click")) {
      window.gtag("event", "cta_click", { slug: payload.slug })
      return
    }
  } catch {
    // ignore
  }
}

export function trackEvent(payload: TrackPayload) {
  try {
    if (typeof window === "undefined") return;

    fireGaEvent(payload)

    const body = JSON.stringify(payload);

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
      return;
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}
