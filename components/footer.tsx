import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

type SiteSettings = {
  siteTitle?: string | null
  siteDescription?: string | null
  logoText?: string | null
  footerAbout?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
  email?: string | null
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

export default function Footer({
  siteSettings,
  footerLinks,
  footerSection,
}: {
  siteSettings?: SiteSettings
  footerLinks?: FooterLink[]
  footerSection?: FooterSectionData
}) {
  const currentYear = new Date().getFullYear()

  const brand = siteSettings?.logoText || siteSettings?.siteTitle || "DevPortfolio"
  const aboutText =
    footerSection?.footerText ||
    siteSettings?.footerAbout ||
    "Full-stack developer specializing in React, Next.js, Node.js, Firebase, and AI integrations. Building modern web applications with a focus on performance and user experience."

  const githubUrl = footerSection?.socialLinks?.github || siteSettings?.githubUrl || "https://github.com"
  const linkedinUrl = footerSection?.socialLinks?.linkedin || siteSettings?.linkedinUrl || "https://www.linkedin.com"
  const twitterUrl = footerSection?.socialLinks?.twitter || siteSettings?.twitterUrl || "https://twitter.com"
  const email = footerSection?.contactInfo?.email || siteSettings?.email || ""

  const quickLinks = Array.isArray(footerSection?.quickLinks) ? footerSection!.quickLinks! : null
  const links = Array.isArray(footerLinks) ? footerLinks : null

  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold gradient-text">
              {brand}
            </Link>
            <p className="mt-4 text-foreground/70 max-w-md">
              {aboutText}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Button variant="ghost" size="icon" asChild>
                <Link href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={twitterUrl} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              {email ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks ? (
                quickLinks.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/${l.slug}`} className="text-foreground/70 hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/" className="text-foreground/70 hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/#projects" className="text-foreground/70 hover:text-primary transition-colors">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/#skills" className="text-foreground/70 hover:text-primary transition-colors">
                      Skills
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-foreground/70 hover:text-primary transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/#contact" className="text-foreground/70 hover:text-primary transition-colors">
                      Contact
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {links ? (
                links
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((l) => (
                    <li key={`${l.group}-${l.label}-${l.href}`}>
                      <Link href={l.href} className="text-foreground/70 hover:text-primary transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))
              ) : (
                <>
                  <li>
                    <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                      Web Development
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                      Mobile Apps
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                      AI Integration
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                      Firebase Solutions
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-foreground/70 hover:text-primary transition-colors">
                      UI/UX Design
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 text-center text-foreground/60">
          <p>© {currentYear} DevPortfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

