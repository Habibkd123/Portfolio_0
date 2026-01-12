"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { trackEvent } from "@/lib/trackClient"

type HeroSection = {
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
  heading?: string | null
  subHeading?: string | null
  buttonText?: string | null
}

type SocialLinks = {
  githubUrl?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
}

export default function Hero({
  hero,
  heroText,
  social,
}: {
  hero?: HeroSection
  heroText?: HeroText
  social?: SocialLinks
}) {
    return (
        <section className="min-h-screen flex items-center pt-20 pb-16 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="space-y-6">
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                {hero?.badgeText || "Available for freelance work"}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                {heroText?.heading || hero?.headingLine1 || "Full-Stack Developer"}{" "}
                                <span className="gradient-text">{hero?.headingHighlight || "| AI & Firebase Specialist"}</span>
                            </h1>
                            <p className="text-xl text-foreground/80 max-w-xl">
                                {heroText?.subHeading ||
                                    hero?.subheading ||
                                    "Building Scalable Apps with React, Next.js, and Node.js. Specializing in AI integrations and Firebase solutions."}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button size="lg" asChild>
                                    <Link
                                        href={hero?.primaryButtonHref || "/#projects"}
                                        onClick={() => trackEvent({ type: "cta", slug: hero?.primaryButtonHref || "/#projects", event: "click" })}
                                    >
                                        {heroText?.buttonText || hero?.primaryButtonText || "View Projects"} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link
                                        href={hero?.secondaryButtonHref || "/#contact"}
                                        onClick={() => trackEvent({ type: "cta", slug: hero?.secondaryButtonHref || "/#contact", event: "click" })}
                                    >
                                        {hero?.secondaryButtonText || "Contact Me"}
                                    </Link>
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        href={social?.githubUrl || "https://github.com/Habibkd123"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="h-5 w-5" />
                                        <span className="sr-only">GitHub</span>
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        href={social?.linkedinUrl || "https://www.linkedin.com/in/habib-kd-549380265/"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                        <span className="sr-only">LinkedIn</span>
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        href={social?.twitterUrl || "https://twitter.com/yusi"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Twitter className="h-5 w-5" />
                                        <span className="sr-only">Twitter</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div style={{ background: "#00000096" }} className="relative w-full aspect-square max-w-md mx-auto lg:ml-auto rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 p-1">
                            <div className="absolute inset-0  rounded-2xl m-0.5"></div>
                            <Image
                                src={hero?.heroImageUrl?.url || "/assets/images/developerImg.png"}
                                alt="Developer Portrait"
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 448px"
                                className="object-cover rounded-2xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

