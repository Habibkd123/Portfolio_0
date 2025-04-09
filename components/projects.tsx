"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    id: 1,
    title: "Chatting App",
    description: "Real-time chat application with AI-powered automated replies using OpenAI.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["ReactJS", "Socket.IO", "Firebase Auth", "OpenAI"],
    demoUrl: "#",
    githubUrl: "#",
    category: "featured",
  },
  {
    id: 2,
    title: "Digital Marketing Platform",
    description:
      "Marketing platform with FlexLinks, geo-targeted ads, and Firebase analytics. Features AI-generated ad copy.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "Firebase", "OpenAI", "Analytics"],
    demoUrl: "#",
    githubUrl: "#",
    category: "featured",
  },
  {
    id: 3,
    title: "Online Exam System",
    description: "Secure online examination platform with authentication and real-time assessment.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "PostgreSQL", "JWT Auth", "Express"],
    demoUrl: "#",
    githubUrl: "#",
    category: "featured",
  },
  {
    id: 4,
    title: "Golf Management Tool",
    description: "Tournament scheduling, player stats, and leaderboards for golf clubs and tournaments.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "Node.js", "MongoDB", "Chart.js"],
    demoUrl: "#",
    githubUrl: "#",
    category: "featured",
  },
  {
    id: 5,
    title: "E-commerce Dashboard",
    description: "Admin dashboard for managing products, orders, and customer data.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["React", "Redux", "Material-UI", "Firebase"],
    demoUrl: "#",
    githubUrl: "#",
    category: "web",
  },
  {
    id: 6,
    title: "AI Content Generator",
    description: "Tool for generating blog posts, social media content, and marketing copy using AI.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Next.js", "OpenAI", "TailwindCSS", "Vercel"],
    demoUrl: "#",
    githubUrl: "#",
    category: "ai",
  },
]

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredProjects = activeTab === "all" ? projects : projects.filter((project) => project.category === activeTab)

  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            A collection of my recent work showcasing my skills in React, Next.js, Firebase, and AI integrations.
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="mb-12">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                All Projects
              </TabsTrigger>
              <TabsTrigger value="featured" onClick={() => setActiveTab("featured")}>
                Featured
              </TabsTrigger>
              <TabsTrigger value="web" onClick={() => setActiveTab("web")}>
                Web Apps
              </TabsTrigger>
              <TabsTrigger value="ai" onClick={() => setActiveTab("ai")}>
                AI Projects
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="web" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> Code
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

