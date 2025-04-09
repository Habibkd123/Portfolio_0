"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Layout, Server, Sparkles } from "lucide-react"

const skills = {
  frontend: [
    { name: "ReactJS", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "TailwindCSS", level: 85 },
    { name: "Material-UI", level: 80 },
    { name: "Chakra UI", level: 75 },
    { name: "Framer Motion", level: 70 },
  ],
  backend: [
    { name: "Node.js", level: 90 },
    { name: "Express.js", level: 85 },
    { name: "REST APIs", level: 90 },
    { name: "GraphQL", level: 75 },
    { name: "Socket.IO", level: 80 },
  ],
  database: [
    { name: "Firebase Firestore", level: 90 },
    { name: "MongoDB", level: 85 },
    { name: "PostgreSQL", level: 80 },
    { name: "MySQL", level: 75 },
  ],
  ai: [
    { name: "OpenAI API", level: 85 },
    { name: "TensorFlow.js", level: 70 },
    { name: "Natural Language Processing", level: 75 },
    { name: "AI Content Generation", level: 80 },
  ],
}

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            My expertise spans across frontend, backend, database technologies, and AI integrations.
          </p>
        </motion.div>

        <Tabs defaultValue="frontend" className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="frontend" className="flex items-center gap-2">
                <Layout className="h-4 w-4" /> Frontend
              </TabsTrigger>
              <TabsTrigger value="backend" className="flex items-center gap-2">
                <Server className="h-4 w-4" /> Backend
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" /> Database
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI Tools
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="frontend">
            <SkillCategory skills={skills.frontend} />
          </TabsContent>

          <TabsContent value="backend">
            <SkillCategory skills={skills.backend} />
          </TabsContent>

          <TabsContent value="database">
            <SkillCategory skills={skills.database} />
          </TabsContent>

          <TabsContent value="ai">
            <SkillCategory skills={skills.ai} />
          </TabsContent>
        </Tabs>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkillCard
            icon={<Layout className="h-6 w-6" />}
            title="Frontend Development"
            description="Building responsive and interactive user interfaces with React, Next.js, and modern CSS frameworks."
          />
          <SkillCard
            icon={<Server className="h-6 w-6" />}
            title="Backend Development"
            description="Creating robust server-side applications with Node.js, Express, and RESTful APIs."
          />
          <SkillCard
            icon={<Database className="h-6 w-6" />}
            title="Database Management"
            description="Designing and implementing database solutions with Firebase, MongoDB, and SQL databases."
          />
          <SkillCard
            icon={<Sparkles className="h-6 w-6" />}
            title="AI Integration"
            description="Leveraging AI technologies like OpenAI and TensorFlow.js to create intelligent applications."
          />
        </div>
      </div>
    </section>
  )
}

function SkillCategory({ skills }: { skills: { name: string; level: number }[] }) {
  return (
    <div className="space-y-6">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{skill.name}</span>
            <span className="text-sm text-foreground/70">{skill.level}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <motion.div
              className="bg-primary h-2.5 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function SkillCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-4">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-foreground/70">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  )
}

