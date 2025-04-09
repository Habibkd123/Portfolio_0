"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Available for freelance work
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Full-Stack Developer <span className="gradient-text">| AI & Firebase Specialist</span>
              </h1>
              <p className="text-xl text-foreground/80 max-w-xl">
                Building Scalable Apps with React, Next.js, and Node.js. Specializing in AI integrations and Firebase
                solutions.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="#projects">
                    View Projects <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#contact">Contact Me</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
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
            <div className="relative w-full aspect-square max-w-md mx-auto lg:ml-auto rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-400 p-1">
              <div className="absolute inset-0 bg-background rounded-2xl m-0.5"></div>
              <img
                src="/placeholder.svg?height=600&width=600"
                alt="Developer Portrait"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

