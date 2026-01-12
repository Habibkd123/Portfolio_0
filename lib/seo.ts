import type { Metadata } from "next"
import { hygraphPublic } from "@/lib/hygraph"
import { QUERIES } from "@/graphql/operations"

type SiteSettings = {
  singletonId: string
  siteTitle?: string | null
  siteDescription?: string | null
}

type SEOSection = {
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null
  ogImage?: { url?: string | null } | null
  url?: string | null
}

function parseKeywords(input?: string | null): string[] | undefined {
  if (typeof input !== "string") return undefined
  const trimmed = input.trim()
  if (!trimmed) return undefined
  const parts = trimmed
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
  return parts.length ? parts : undefined
}

export async function getHygraphMetadata({
  slug,
  fallbackTitle,
  fallbackDescription,
  openGraphImageUrl,
}: {
  slug: string
  fallbackTitle: string
  fallbackDescription: string
  openGraphImageUrl?: string
}): Promise<Metadata> {
  try {
    const [seoRes, settingsRes] = await Promise.all([
      hygraphPublic.request<{ seoSections: SEOSection[] }>(QUERIES.site.seoSection, { slug }),
      hygraphPublic.request<{ singletons: SiteSettings[] }>(QUERIES.site.settings, { singletonId: "site" }),
    ])

    const seo = Array.isArray(seoRes?.seoSections) && seoRes.seoSections.length > 0 ? seoRes.seoSections[0] : null
    const site =
      Array.isArray(settingsRes?.singletons) && settingsRes.singletons.length > 0 ? settingsRes.singletons[0] : null

    const title = seo?.metaTitle ?? site?.siteTitle ?? fallbackTitle
    const description = seo?.metaDescription ?? site?.siteDescription ?? fallbackDescription
    const keywords = parseKeywords(seo?.keywords)

    const ogImage = seo?.ogImage?.url || openGraphImageUrl

    const canonical = typeof seo?.url === "string" && seo.url.trim() ? seo.url.trim() : undefined

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const metadataBase = typeof siteUrl === "string" && siteUrl.trim() ? new URL(siteUrl) : undefined

    return {
      metadataBase,
      title,
      description,
      keywords,
      alternates: canonical ? { canonical } : undefined,
      openGraph: ogImage
        ? {
            title,
            description,
            images: [{ url: ogImage }],
          }
        : undefined,
    }
  } catch {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const metadataBase = typeof siteUrl === "string" && siteUrl.trim() ? new URL(siteUrl) : undefined

    return {
      metadataBase,
      title: fallbackTitle,
      description: fallbackDescription,
    }
  }
}
