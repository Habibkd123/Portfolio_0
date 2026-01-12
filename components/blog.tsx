"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { hygraphPublic } from "@/lib/hygraph"
import { GET_BLOG_POSTS } from "@/graphql/blogQueries"

type BlogPostListItem = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  coverImageUrl?: string | null
  readTime?: string | null
  publishedAt?: string | null
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const data = await hygraphPublic.request<{ blogPosts: BlogPostListItem[] }>(GET_BLOG_POSTS)
        setPosts(data.blogPosts ?? [])
      } catch (err) {
        console.error("Failed to load blog posts", err)
      }
    })()
  }, [])

  return (
    <section id="blog" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Articles</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Insights and tutorials on web development, AI integration, and modern tech stacks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="relative overflow-hidden aspect-video">
                  <Image
                    src={post.coverImageUrl || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-foreground/60 mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime || ""}
                    </div>
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-foreground/70">{post.excerpt || ""}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

