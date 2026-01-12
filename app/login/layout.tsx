import type React from "react"
import type { Metadata } from "next"
import { getHygraphMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getHygraphMetadata({
    slug: "login",
    fallbackTitle: "Login",
    fallbackDescription: "Admin login",
  })

  return {
    ...meta,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
