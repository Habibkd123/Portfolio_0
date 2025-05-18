"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "Building AI-Powered Chatbots with React and OpenAI",
    excerpt: "Learn how to integrate OpenAI's GPT models into your React applications to create intelligent chatbots.",
    date: "April 2, 2025",
    readTime: "8 min read",
    image: "/assets/images/openaa.png",
    url: "#",
  },
  {
    id: 2,
    title: "Firebase Cloud Functions for Automated Post Scheduling",
    excerpt:
      "Discover how to use Firebase Cloud Functions to create a robust content scheduling system for your applications.",
    date: "March 25, 2025",
    readTime: "6 min read",
    image: "/assets/images/firebase.png",
    url: "#",
  },
  {
    id: 3,
    title: "Creating Dynamic Ads with AI Copywriting",
    excerpt:
      "Explore how to leverage AI for generating compelling ad copy that converts better than traditional methods.",
    date: "March 15, 2025",
    readTime: "5 min read",
    image: "/assets/images/ADS.png",
    url: "#",
  },
  {
    id: 4,
    title: "Next.js 15: What's New and How to Upgrade",
    excerpt: "A comprehensive guide to the latest features in Next.js 15 and how to migrate your existing projects.",
    date: "March 5, 2025",
    readTime: "7 min read",
    image: "/assets/images/nextjs.png",
    url: "#",
  },
]

export default function Blog() {
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
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="relative overflow-hidden aspect-video">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-foreground/60 mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle>{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="text-foreground/70">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="group" asChild>
                    <Link href={post.url}>
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
            <Link href="#">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

