import type React from "react"
import type { Metadata } from "next"
import { getHygraphMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getHygraphMetadata({
    slug: "admin",
    fallbackTitle: "Admin",
    fallbackDescription: "Admin dashboard",
  })

  return {
    ...meta,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
