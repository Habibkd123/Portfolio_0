import Image from "next/image"
import { Button } from "@/components/ui/button"

type AboutSectionData = {
  isVisible?: boolean | null
  title?: string | null
  shortDescription?: string | null
  longDescription?: string | null
  resumeButtonText?: string | null
  resumeLink?: string | null
  profileImage?: { url?: string | null } | null
}

export default function AboutSection({ data }: { data?: AboutSectionData }) {
  if (data?.isVisible === false) return null

  return (
    <section id="about" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{data?.title ?? "About"}</h2>
            {data?.shortDescription ? <p className="text-foreground/70">{data.shortDescription}</p> : null}
            {data?.longDescription ? <p className="text-foreground/70">{data.longDescription}</p> : null}
            {data?.resumeLink ? (
              <Button asChild>
                <a href={data.resumeLink} target="_blank" rel="noopener noreferrer">
                  {data.resumeButtonText ?? "Resume"}
                </a>
              </Button>
            ) : null}
          </div>

          <div className="relative w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden border bg-muted">
            <Image
              src={data?.profileImage?.url || "/placeholder.svg"}
              alt={data?.title || "About"}
              fill
              sizes="(max-width: 1024px) 100vw, 448px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
