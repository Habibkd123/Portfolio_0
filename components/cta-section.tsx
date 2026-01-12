"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/trackClient"

type CtaSectionData = {
  isVisible?: boolean | null
  title?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  backgroundColor?: string | null
}

export default function CTASection({ data }: { data?: CtaSectionData | null }) {
  if (!data?.isVisible) return null

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border p-8 md:p-12"
          style={data.backgroundColor ? { backgroundColor: data.backgroundColor } : undefined}
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold">{data.title ?? "Ready to work together?"}</h2>
            {data.description ? <p className="mt-4 text-foreground/80">{data.description}</p> : null}

            {data.buttonLink ? (
              <div className="mt-6">
                <Button asChild>
                  <a
                    href={data.buttonLink}
                    target={data.buttonLink.startsWith("#") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent({ type: "cta", slug: data.buttonLink || "cta", event: "click" })
                    }}
                  >
                    {data.buttonText ?? "Get in touch"}
                  </a>
                </Button>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
