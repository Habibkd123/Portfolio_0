import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Blog from "@/components/blog"
import Contact from "@/components/contact"
import AboutSection from "@/components/about-section"
import CTASection from "@/components/cta-section"
import Testimonials from "@/components/testimonials"
import { hygraphPublic } from "@/lib/hygraph"
import { QUERIES } from "@/graphql/operations"
import type { Metadata } from "next"
import { getHygraphMetadata } from "@/lib/seo"

type SiteSettings = {
  singletonId: string
  githubUrl?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
  siteTitle?: string | null
  siteDescription?: string | null
}

type SEOSection = {
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string | null
  ogImage?: { url?: string | null } | null
}

type HeroSection = {
  singletonId: string
  badgeText?: string | null
  headingLine1?: string | null
  headingHighlight?: string | null
  subheading?: string | null
  primaryButtonText?: string | null
  primaryButtonHref?: string | null
  secondaryButtonText?: string | null
  secondaryButtonHref?: string | null
  heroImageUrl?: { url?: string | null } | null
}

type HeroText = {
  id: string
  singletonId: string
  heading?: string | null
  subHeading?: string | null
  buttonText?: string | null
}

type AboutSectionData = {
  isVisible?: boolean | null
  title?: string | null
  shortDescription?: string | null
  longDescription?: string | null
  resumeButtonText?: string | null
  resumeLink?: string | null
  profileImage?: { url?: string | null } | null
}

type SkillItem = {
  name: string
  level: number
  category?: string | null
  icon?: { url?: string | null } | null
}

type CtaSectionData = {
  isVisible?: boolean | null
  title?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  backgroundColor?: string | null
}

type Testimonial = {
  name: string
  role?: string | null
  message: string
  photo?: { url?: string | null } | null
}

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Full-Stack Developer Portfolio"
  const fallbackDescription = "Full-Stack Developer specializing in ReactJS, Next.js, Node.js, Firebase, and AI integrations"

  return getHygraphMetadata({
    slug: "home",
    fallbackTitle,
    fallbackDescription,
  })
}

export default async function Home() {
  let hero:
    | {
        singletonId: string
        badgeText?: string | null
        headingLine1?: string | null
        headingHighlight?: string | null
        subheading?: string | null
        primaryButtonText?: string | null
        primaryButtonHref?: string | null
        secondaryButtonText?: string | null
        secondaryButtonHref?: string | null
        heroImageUrl?: { url?: string | null } | null
      }
    | null = null
  let heroText: HeroText | null = null
  let about: AboutSectionData | null = null
  let skills: SkillItem[] | null = null
  let cta: CtaSectionData | null = null
  let testimonials: Testimonial[] | null = null
  let social: Pick<SiteSettings, "githubUrl" | "linkedinUrl" | "twitterUrl"> | null = null

  const [heroRes, heroTextRes, aboutRes, skillsRes, ctaRes, testimonialsRes, settingsRes] = await Promise.allSettled([
    hygraphPublic.request<{ heroSections: HeroSection[] }>(QUERIES.site.hero, { singletonId: "hero" }),
    hygraphPublic.request<{ heroTexts: HeroText[] }>(QUERIES.site.heroText, { singletonId: "heroText" }),
    hygraphPublic.request<{ aboutSections: AboutSectionData[] }>(QUERIES.site.aboutSection),
    hygraphPublic.request<{ skills: SkillItem[] }>(QUERIES.site.skills),
    hygraphPublic.request<{ ctas: CtaSectionData[] }>(QUERIES.site.ctaSection),
    hygraphPublic.request<{ testimonials: Testimonial[] }>(QUERIES.site.testimonials),
    hygraphPublic.request<{ singletons: SiteSettings[] }>(QUERIES.site.settings, { singletonId: "site" }),
  ])
  if (heroRes.status === "fulfilled") {
    hero = Array.isArray(heroRes.value?.heroSections) && heroRes.value.heroSections.length > 0 ? heroRes.value.heroSections[0] : null
  }
  if (heroTextRes.status === "fulfilled") {
    heroText =
      Array.isArray(heroTextRes.value?.heroTexts) && heroTextRes.value.heroTexts.length > 0
        ? heroTextRes.value.heroTexts[0]
        : null
  }
  if (aboutRes.status === "fulfilled") {
    about =
      Array.isArray(aboutRes.value?.aboutSections) && aboutRes.value.aboutSections.length > 0
        ? aboutRes.value.aboutSections[0]
        : null
  }
  if (skillsRes.status === "fulfilled") {
    skills = Array.isArray(skillsRes.value?.skills) ? skillsRes.value.skills : null
  }
  if (ctaRes.status === "fulfilled") {
    cta = Array.isArray(ctaRes.value?.ctas) && ctaRes.value.ctas.length > 0 ? ctaRes.value.ctas[0] : null
  }
  if (testimonialsRes.status === "fulfilled") {
    testimonials = Array.isArray(testimonialsRes.value?.testimonials) ? testimonialsRes.value.testimonials : null
  }
  if (settingsRes.status === "fulfilled") {
    const siteSettings =
      Array.isArray(settingsRes.value?.singletons) && settingsRes.value.singletons.length > 0 ? settingsRes.value.singletons[0] : null
    social = siteSettings
      ? {
          githubUrl: siteSettings.githubUrl,
          linkedinUrl: siteSettings.linkedinUrl,
          twitterUrl: siteSettings.twitterUrl,
        }
      : null
  }

  return (
    <main className="min-h-screen">
      <Hero hero={hero ?? undefined} heroText={heroText ?? undefined} social={social ?? undefined} />
      <AboutSection data={about ?? undefined} />
      <Projects />
      <Skills skills={skills ?? undefined} />
      <Testimonials items={testimonials ?? undefined} />
      <CTASection data={cta ?? undefined} />
      <Blog />
      <Contact />
    </main>
  )
}

