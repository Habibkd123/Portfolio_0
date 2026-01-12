import type { Metadata } from "next";
import AboutSection from "@/components/about-section";
import Skills from "@/components/skills";
import { hygraphPublic } from "@/lib/hygraph";
import { QUERIES } from "@/graphql/operations";
import { getHygraphMetadata } from "@/lib/seo";

type AboutSectionData = {
  isVisible?: boolean | null;
  title?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  resumeButtonText?: string | null;
  resumeLink?: string | null;
  profileImage?: { url?: string | null } | null;
};

type SkillItem = {
  name: string;
  level: number;
  category?: string | null;
  icon?: { url?: string | null } | null;
};

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "About";
  const fallbackDescription = "About me";

  return getHygraphMetadata({
    slug: "about",
    fallbackTitle,
    fallbackDescription,
  });
}

export default async function AboutPage() {
  let about: AboutSectionData | null = null;
  let skills: SkillItem[] | null = null;

  try {
    const [aboutRes, skillsRes] = await Promise.all([
      hygraphPublic.request<{ aboutSections: AboutSectionData[] }>(QUERIES.site.aboutSection),
      hygraphPublic.request<{ skills: SkillItem[] }>(QUERIES.site.skills),
    ]);

    about = Array.isArray(aboutRes?.aboutSections) && aboutRes.aboutSections.length > 0 ? aboutRes.aboutSections[0] : null;
    skills = Array.isArray(skillsRes?.skills) ? skillsRes.skills : null;
  } catch {
    about = null;
    skills = null;
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold">About</h1>
        <p className="text-foreground/70 mt-2">Learn more about me and my skills.</p>
      </div>
      <AboutSection data={about ?? undefined} />
      <Skills skills={skills ?? undefined} />
    </main>
  );
}
