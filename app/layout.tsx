import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AnnouncementBar from "@/components/announcement-bar"
import { ThemeProvider } from "@/components/theme-provider"
import { hygraphPublic } from "@/lib/hygraph"
import { QUERIES } from "@/graphql/operations"
import { getHygraphMetadata } from "@/lib/seo"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Full-Stack Developer Portfolio"
  const fallbackDescription = "Full-Stack Developer specializing in ReactJS, Next.js, Node.js, Firebase, and AI integrations"

  const meta = await getHygraphMetadata({
    slug: "home",
    fallbackTitle,
    fallbackDescription,
  })

  return {
    ...meta,
    generator: "v0.dev",
  }
}

type SiteSettings = {
  singletonId: string
  siteTitle?: string | null
  siteDescription?: string | null
  logoText?: string | null
  footerAbout?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
  email?: string | null
}

type NavigationLink = {
  label: string
  href: string
  order: number
}

type Navigation = {
  singletonId: string
  links: NavigationLink[]
}

type FooterLink = {
  group: string
  label: string
  href: string
  order: number
}

type FooterSectionLink = {
  label: string
  slug: string
}

type FooterSectionData = {
  isVisible?: boolean | null
  footerText?: string | null
  quickLinks?: FooterSectionLink[] | null
  socialLinks?: {
    github?: string | null
    linkedin?: string | null
    twitter?: string | null
    instagram?: string | null
  } | null
  contactInfo?: {
    email?: string | null
    phone?: string | null
    address?: string | null
  } | null
}

type AnnouncementBarData = {
  id: string
  isVisible?: boolean | null
  message?: string | null
  linkText?: string | null
  linkUrl?: string | null
  backgroundColor?: string | null
  textColor?: string | null
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let siteSettings: SiteSettings | null = null
  let navigationLinks: NavigationLink[] | null = null
  let footerLinks: FooterLink[] | null = null
  let footerSection: FooterSectionData | null = null
  let announcementBar: AnnouncementBarData | null = null

  const [settingsRes, navRes, footerRes, footerSectionRes, announcementRes] = await Promise.allSettled([
    hygraphPublic.request<{ singletons: SiteSettings[] }>(QUERIES.site.settings, { singletonId: "site" }),
    hygraphPublic.request<{ navigations: Navigation[] }>(QUERIES.site.navigation, { singletonId: "main" }),
    hygraphPublic.request<{ footerLinks: FooterLink[] }>(QUERIES.site.footerLinks),
    hygraphPublic.request<{ footerSections: FooterSectionData[] }>(QUERIES.site.footerSection),
    hygraphPublic.request<{ announcementBar: AnnouncementBarData }>(QUERIES.site.announcementBar, { type: "home" }),
  ])

  if (settingsRes.status === "fulfilled") {
    siteSettings =
      Array.isArray(settingsRes.value?.singletons) && settingsRes.value.singletons.length > 0 ? settingsRes.value.singletons[0] : null
  }
  if (navRes.status === "fulfilled") {
    // Navigation is now an array (navigations), so take the first one
    navigationLinks = Array.isArray(navRes.value?.navigations) && navRes.value.navigations.length > 0
      ? navRes.value.navigations[0].links
      : null
  }
  if (footerRes.status === "fulfilled") {
    footerLinks = Array.isArray(footerRes.value?.footerLinks) ? footerRes.value.footerLinks : null
  }
  if (announcementRes.status === "fulfilled") {
    // Singular object direct access
    announcementBar = announcementRes.value?.announcementBar ?? null
  }
  // Disabled due to persistent schema error
  footerSection = null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-QDPHKXJY58" strategy="afterInteractive" />
        <Script id="ga4-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QDPHKXJY58');
          `}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="portfolio-theme">
          <AnnouncementBar data={announcementBar ?? undefined} />
          <Header logoText={siteSettings?.logoText ?? undefined} links={navigationLinks ?? undefined} />
          {children}
          <Footer siteSettings={siteSettings ?? undefined} footerLinks={footerLinks ?? undefined} footerSection={footerSection ?? undefined} />
        </ThemeProvider>
      </body>
    </html>
  )
}