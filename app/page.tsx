import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Blog from "@/components/blog"
import Contact from "@/components/contact"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <main className="min-h-screen">
        <Hero />
        <Projects />
        <Skills />
        <Blog />
        <Contact />
      </main>
    </ThemeProvider>
  )
}

