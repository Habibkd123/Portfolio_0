"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Layout, Server, Sparkles, Wrench } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

type SkillItem = {
  name: string
  level: number
  category?: string | string[] | null
  isVisible?: boolean | null
  icon?: { url?: string | null } | null
}

function normalizeCategoryKeys(category?: SkillItem["category"]) {
  const raw = Array.isArray(category) ? category : [category]
  const keys = raw
    .map((v) => String(v ?? "").trim().toLowerCase())
    .filter(Boolean)
    .flatMap((c) => {
      if (c.includes("front")) return ["frontend"]
      if (c.includes("back")) return ["backend"]
      if (c.includes("tools") || c.includes("library") || c.includes("framework")) return ["toolsLibraries"]
      if (c.includes("db") || c.includes("data") || c.includes("sql") || c.includes("mongo") || c.includes("firebase")) return ["database"]
      if (c.includes("ai") || c.includes("ml")) return ["ai"]
      if (c === "frontend" || c === "backend" || c === "database" || c === "ai" || c === "toolslibraries") return [c === "toolslibraries" ? "toolsLibraries" : c]
      return []
    })

  return keys.length > 0 ? Array.from(new Set(keys)) : ["frontend"]
}

function buildSkillGroups(items: SkillItem[]) {
  const groups: Record<string, SkillItem[]> = {
    frontend: [],
    backend: [],
    database: [],
    ai: [],
    toolsLibraries: [],
  }

  for (const s of items) {
    console.log("data>>>>>>>>>>>>>>>>>",s)
    if (!s?.name || typeof s.level !== "number") continue
    const keys = normalizeCategoryKeys(s.category)
    for (const key of keys) {
      groups[key] = groups[key] || []
      groups[key].push(s)
    }
  }

  for (const k of Object.keys(groups)) {
    groups[k] = groups[k].slice().sort((a, b) => b.level - a.level)
  }

  return groups
}

export default function Skills({ skills: remoteSkills }: { skills?: SkillItem[] }) {
  console.log("newSkilllllllllllll0,0",remoteSkills)
  const visibleRemoteSkills = Array.isArray(remoteSkills)
    ? remoteSkills.filter((s) => s && s.isVisible !== false)
    : []
  if (visibleRemoteSkills.length === 0) {
    return (
      <section id="skills" className="section-padding bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">No skills found from Hygraph.</p>
          </div>
        </div>
      </section>
    )
  }

  const groupedSkills = buildSkillGroups(visibleRemoteSkills)

  const allSkills = useMemo(() => {
    const map = new Map<string, SkillItem>()
    for (const s of visibleRemoteSkills) {
      if (!s?.name) continue
      map.set(String(s.name), s)
    }
    return Array.from(map.values()).sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
  }, [visibleRemoteSkills])

  const categories = useMemo(
    () =>
      [
        { key: "all", label: "All Skills", icon: Sparkles },
        { key: "frontend", label: "Frontend", icon: Layout },
        { key: "backend", label: "Backend", icon: Server },
        { key: "database", label: "Database", icon: Database },
        { key: "ai", label: "AI Tools", icon: Sparkles },
        { key: "toolsLibraries", label: "Tools & Libraries", icon: Wrench },
      ] as const,
    []
  )

  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]["key"]>("all")

  const activeSkills = activeCategory === "all" ? allSkills : (groupedSkills?.[activeCategory] ?? [])

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

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 border-muted/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
            <CardHeader>
              <CardTitle className="text-xl">Categories</CardTitle>
              <CardDescription className="text-foreground/70">Pick a category to explore.</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-2 lg:grid-cols-1 gap-3"
              >
                {categories.map((c) => {
                  const Icon = c.icon
                  const isActive = activeCategory === c.key
                  const count =
                    c.key === "all" ? allSkills.length : (groupedSkills?.[c.key] ?? []).length
                  return (
                    <motion.button
                      key={c.key}
                      type="button"
                      variants={itemVariants}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveCategory(c.key)}
                      className={
                        "group flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors " +
                        (isActive
                          ? "border-primary/40 bg-primary/10"
                          : "border-muted/60 bg-background hover:bg-muted/40")
                      }
                    >
                      <span
                        className={
                          "flex h-9 w-9 items-center justify-center rounded-md transition-colors " +
                          (isActive ? "bg-primary/15 text-primary" : "bg-muted/60 text-foreground/80")
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block font-semibold leading-tight">{c.label}</span>
                        <span className="block text-xs text-foreground/70">{count} skills</span>
                      </span>
                      <span
                        className={
                          "text-xs rounded-full px-2 py-1 border transition-colors " +
                          (isActive ? "border-primary/30 text-primary" : "border-muted/60 text-foreground/70")
                        }
                      >
                        View
                      </span>
                    </motion.button>
                  )
                })}
              </motion.div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8 border-muted/60 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
            <CardHeader>
              <CardTitle className="text-xl">{categories.find((c) => c.key === activeCategory)?.label}</CardTitle>
              <CardDescription className="text-foreground/70">
                A quick overview of the tools I use most in this area.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  key={activeCategory}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="contents"
                >
                  {activeSkills.map((skill, index) => (
                    <SkillTile key={skill.name} skill={skill} index={index} />
                  ))}
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </div>

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

function SkillTile({ skill, index }: { skill: SkillItem; index: number }) {
  const hasIcon = Boolean(skill?.icon?.url)

  return (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="rounded-xl border border-muted/60 bg-background/70 p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted/60 flex items-center justify-center overflow-hidden">
          {hasIcon ? (
            <Image
              src={skill.icon!.url as string}
              alt={skill.name}
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-foreground/80">{skill.name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold truncate">{skill.name}</h3>
            <span className="text-xs text-foreground/70 whitespace-nowrap">{skill.level}%</span>
          </div>
          <div className="mt-2 w-full bg-muted/80 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: index * 0.04, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SkillCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-full transition-shadow hover:shadow-md">
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

