"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/trackClient"

export default function TrackView({ type, slug }: { type: string; slug: string }) {
  useEffect(() => {
    trackEvent({ type, slug, event: "view" })
  }, [type, slug])

  return null
}
