import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Testimonial = {
  name: string
  role?: string | null
  message: string
  photo?: { url?: string | null } | null
}

export default function Testimonials({ items }: { items?: Testimonial[] }) {
  const list = Array.isArray(items) ? items : []

  if (list.length === 0) return null

  return (
    <section id="testimonials" className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimonials</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">What people say about working with me.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((t) => (
            <Card key={t.name} className="h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                {t.photo?.url ? (
                  <Image
                    src={t.photo.url}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted border" />
                )}
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{t.name}</CardTitle>
                  {t.role ? <div className="text-sm text-foreground/70 truncate">{t.role}</div> : null}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed">{t.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
