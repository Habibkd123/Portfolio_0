"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { hygraph } from "@/lib/hygraph";
import { GET_PROJECTS } from "@/graphql/projectQueries";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { signOut } from "next-auth/react";

type SiteSettings = {
  id: string;
  singletonId: string;
  siteTitle?: string | null;
  siteDescription?: string | null;
  logoText?: string | null;
  footerAbout?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  email?: string | null;
  stage?: string | null;
  updatedAt?: string | null;
};

type HeroText = {
  id: string;
  singletonId: string;
  heading?: string | null;
  subHeading?: string | null;
  buttonText?: string | null;
  stage?: string | null;
  updatedAt?: string | null;
};

type AnnouncementBar = {
  id: string;
  isVisible?: boolean | null;
  message?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  stage?: string | null;
  updatedAt?: string | null;
};

type AboutSection = {
  id: string;
  isVisible?: boolean | null;
  title?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  resumeButtonText?: string | null;
  resumeLink?: string | null;
  profileImage?: { url?: string | null } | null;
  stage?: string | null;
  updatedAt?: string | null;
};

type Skill = {
  id: string;
  name: string;
  level: number;
  category?: string | null;
  isVisible?: boolean | null;
  icon?: { url?: string | null } | null;
};

export default function AdminPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [siteForm, setSiteForm] = useState<Partial<SiteSettings>>({});
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteSaving, setSiteSaving] = useState(false);
  const [siteError, setSiteError] = useState<string | null>(null);
  const [siteSuccess, setSiteSuccess] = useState<string | null>(null);

  const [heroText, setHeroText] = useState<HeroText | null>(null);
  const [heroTextForm, setHeroTextForm] = useState<Partial<HeroText>>({});
  const [heroTextLoading, setHeroTextLoading] = useState(false);
  const [heroTextSaving, setHeroTextSaving] = useState(false);
  const [heroTextError, setHeroTextError] = useState<string | null>(null);
  const [heroTextSuccess, setHeroTextSuccess] = useState<string | null>(null);

  const [announcementBar, setAnnouncementBar] = useState<AnnouncementBar | null>(null);
  const [announcementForm, setAnnouncementForm] = useState<Partial<AnnouncementBar>>({});
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [announcementSaving, setAnnouncementSaving] = useState(false);
  const [announcementError, setAnnouncementError] = useState<string | null>(null);
  const [announcementSuccess, setAnnouncementSuccess] = useState<string | null>(null);

  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [aboutForm, setAboutForm] = useState<Partial<AboutSection>>({});
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutSaving, setAboutSaving] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [aboutSuccess, setAboutSuccess] = useState<string | null>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsForm, setSkillsForm] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsSaving, setSkillsSaving] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skillsSuccess, setSkillsSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await hygraph.request<{ projects: any[] }>(GET_PROJECTS);
        setProjects(data.projects);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setHeroTextLoading(true);
      setHeroTextError(null);
      try {
        const res = await fetch("/api/admin/hero-text", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load hero text");
        }
        setHeroText(json.heroText ?? null);
        setHeroTextForm(json.heroText ?? {});
      } catch (e: any) {
        setHeroTextError(typeof e?.message === "string" ? e.message : "Failed to load hero text");
      } finally {
        setHeroTextLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setAnnouncementLoading(true);
      setAnnouncementError(null);
      try {
        const res = await fetch("/api/admin/announcement-bar", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load announcement bar");
        }
        setAnnouncementBar(json.announcementBar ?? null);
        setAnnouncementForm(json.announcementBar ?? {});
      } catch (e: any) {
        setAnnouncementError(typeof e?.message === "string" ? e.message : "Failed to load announcement bar");
      } finally {
        setAnnouncementLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setAboutLoading(true);
      setAboutError(null);
      try {
        const res = await fetch("/api/admin/about-section", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load about section");
        }
        setAboutSection(json.aboutSection ?? null);
        setAboutForm(json.aboutSection ?? {});
      } catch (e: any) {
        setAboutError(typeof e?.message === "string" ? e.message : "Failed to load about section");
      } finally {
        setAboutLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setSkillsLoading(true);
      setSkillsError(null);
      try {
        const res = await fetch("/api/admin/skills", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load skills");
        }
        const items = Array.isArray(json.skills) ? (json.skills as Skill[]) : [];
        setSkills(items);
        setSkillsForm(items);
      } catch (e: any) {
        setSkillsError(typeof e?.message === "string" ? e.message : "Failed to load skills");
      } finally {
        setSkillsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setSiteLoading(true);
      setSiteError(null);
      try {
        const res = await fetch("/api/admin/site-settings", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load site settings");
        }

        setSiteSettings(json.siteSettings ?? null);
        setSiteForm(json.siteSettings ?? {});
      } catch (e: any) {
        setSiteError(typeof e?.message === "string" ? e.message : "Failed to load site settings");
      } finally {
        setSiteLoading(false);
      }
    })();
  }, []);

  async function saveSiteSettings() {
    setSiteSaving(true);
    setSiteError(null);
    setSiteSuccess(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteForm),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to save site settings");
      }
      setSiteSettings(json.siteSettings ?? null);
      setSiteForm(json.siteSettings ?? {});
      setSiteSuccess("Saved & published");
    } catch (e: any) {
      setSiteError(typeof e?.message === "string" ? e.message : "Failed to save site settings");
    } finally {
      setSiteSaving(false);
    }
  }

  async function saveHeroText() {
    setHeroTextSaving(true);
    setHeroTextError(null);
    setHeroTextSuccess(null);
    try {
      const res = await fetch("/api/admin/hero-text", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroTextForm),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to save hero text");
      }
      setHeroText(json.heroText ?? null);
      setHeroTextForm(json.heroText ?? {});
      setHeroTextSuccess("Saved & published");
    } catch (e: any) {
      setHeroTextError(typeof e?.message === "string" ? e.message : "Failed to save hero text");
    } finally {
      setHeroTextSaving(false);
    }
  }

  async function saveAnnouncementBar() {
    setAnnouncementSaving(true);
    setAnnouncementError(null);
    setAnnouncementSuccess(null);
    try {
      const res = await fetch("/api/admin/announcement-bar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementForm),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to save announcement bar");
      }
      setAnnouncementBar(json.announcementBar ?? null);
      setAnnouncementForm(json.announcementBar ?? {});
      setAnnouncementSuccess("Saved & published");
    } catch (e: any) {
      setAnnouncementError(typeof e?.message === "string" ? e.message : "Failed to save announcement bar");
    } finally {
      setAnnouncementSaving(false);
    }
  }

  async function saveAboutSection() {
    setAboutSaving(true);
    setAboutError(null);
    setAboutSuccess(null);
    try {
      const res = await fetch("/api/admin/about-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutForm),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to save about section");
      }
      setAboutSection(json.aboutSection ?? null);
      setAboutForm(json.aboutSection ?? {});
      setAboutSuccess("Saved & published");
    } catch (e: any) {
      setAboutError(typeof e?.message === "string" ? e.message : "Failed to save about section");
    } finally {
      setAboutSaving(false);
    }
  }

  async function saveSkills() {
    setSkillsSaving(true);
    setSkillsError(null);
    setSkillsSuccess(null);
    try {
      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skillsForm }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Failed to save skills");
      }
      const items = Array.isArray(json.skills) ? (json.skills as Skill[]) : [];
      setSkills(items);
      setSkillsForm(items);
      setSkillsSuccess("Saved & published");
    } catch (e: any) {
      setSkillsError(typeof e?.message === "string" ? e.message : "Failed to save skills");
    } finally {
      setSkillsSaving(false);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <div className="flex gap-2">
          <Link href="/admin/analytics">
            <Button variant="secondary">
              View Analytics
            </Button>
          </Link>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
            Logout
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Site Settings</h2>
            <p className="text-sm text-muted-foreground">Edits your global header/footer/SEO and publishes automatically.</p>
          </div>
          <Button onClick={saveSiteSettings} disabled={siteLoading || siteSaving}>
            {siteSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        {siteLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        ) : siteError ? (
          <p className="mt-4 text-sm text-red-600">{siteError}</p>
        ) : null}

        {siteSuccess ? <p className="mt-4 text-sm text-green-600">{siteSuccess}</p> : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Title</label>
            <Input
              value={siteForm.siteTitle ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, siteTitle: e.target.value }))}
              placeholder="Habib Portfolio"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Logo Text</label>
            <Input
              value={siteForm.logoText ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, logoText: e.target.value }))}
              placeholder="kd'slogo"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Site Description</label>
            <Textarea
              value={siteForm.siteDescription ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, siteDescription: e.target.value }))}
              placeholder="Full Stack Developer"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Footer About</label>
            <Textarea
              value={siteForm.footerAbout ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, footerAbout: e.target.value }))}
              placeholder="Short bio for footer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub URL</label>
            <Input
              value={siteForm.githubUrl ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, githubUrl: e.target.value }))}
              placeholder="https://github.com/yourname"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <Input
              value={siteForm.linkedinUrl ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, linkedinUrl: e.target.value }))}
              placeholder="https://linkedin.com/in/yourname"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Twitter URL</label>
            <Input
              value={siteForm.twitterUrl ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, twitterUrl: e.target.value }))}
              placeholder="https://twitter.com/yourname"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={siteForm.email ?? ""}
              onChange={(e) => setSiteForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="name@email.com"
            />
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <div>singletonId: {siteSettings?.singletonId ?? "—"}</div>
          <div>stage: {siteSettings?.stage ?? "—"}</div>
          <div>updatedAt: {siteSettings?.updatedAt ?? "—"}</div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Hero Text</h2>
            <p className="text-sm text-muted-foreground">Edits the main hero heading/subheading/button text.</p>
          </div>
          <Button onClick={saveHeroText} disabled={heroTextLoading || heroTextSaving}>
            {heroTextSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        {heroTextLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        ) : heroTextError ? (
          <p className="mt-4 text-sm text-red-600">{heroTextError}</p>
        ) : null}

        {heroTextSuccess ? <p className="mt-4 text-sm text-green-600">{heroTextSuccess}</p> : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Heading</label>
            <Input
              value={heroTextForm.heading ?? ""}
              onChange={(e) => setHeroTextForm((p) => ({ ...p, heading: e.target.value }))}
              placeholder="Hey, I'm Habib"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Sub Heading</label>
            <Textarea
              value={heroTextForm.subHeading ?? ""}
              onChange={(e) => setHeroTextForm((p) => ({ ...p, subHeading: e.target.value }))}
              placeholder="Full Stack Developer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Button Text</label>
            <Input
              value={heroTextForm.buttonText ?? ""}
              onChange={(e) => setHeroTextForm((p) => ({ ...p, buttonText: e.target.value }))}
              placeholder="View Projects"
            />
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <div>singletonId: {heroText?.singletonId ?? "—"}</div>
          <div>stage: {heroText?.stage ?? "—"}</div>
          <div>updatedAt: {heroText?.updatedAt ?? "—"}</div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Announcement Bar</h2>
            <p className="text-sm text-muted-foreground">Toggle + edit the top banner message.</p>
          </div>
          <Button onClick={saveAnnouncementBar} disabled={announcementLoading || announcementSaving}>
            {announcementSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        {announcementLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        ) : announcementError ? (
          <p className="mt-4 text-sm text-red-600">{announcementError}</p>
        ) : null}

        {announcementSuccess ? <p className="mt-4 text-sm text-green-600">{announcementSuccess}</p> : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Visible</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(announcementForm.isVisible)}
                onChange={(e) => setAnnouncementForm((p) => ({ ...p, isVisible: e.target.checked }))}
              />
              <span className="text-sm text-muted-foreground">Show on site</span>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Message</label>
            <Input
              value={announcementForm.message ?? ""}
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Freelance available"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link Text</label>
            <Input
              value={announcementForm.linkText ?? ""}
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, linkText: e.target.value }))}
              placeholder="Contact"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link URL</label>
            <Input
              value={announcementForm.linkUrl ?? ""}
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, linkUrl: e.target.value }))}
              placeholder="#contact"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Background Color</label>
            <Input
              value={announcementForm.backgroundColor ?? ""}
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, backgroundColor: e.target.value }))}
              placeholder="#4F46E5"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Text Color</label>
            <Input
              value={announcementForm.textColor ?? ""}
              onChange={(e) => setAnnouncementForm((p) => ({ ...p, textColor: e.target.value }))}
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <div>stage: {announcementBar?.stage ?? "—"}</div>
          <div>updatedAt: {announcementBar?.updatedAt ?? "—"}</div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">About Section</h2>
            <p className="text-sm text-muted-foreground">Edits the About section content and visibility.</p>
          </div>
          <Button onClick={saveAboutSection} disabled={aboutLoading || aboutSaving}>
            {aboutSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        {aboutLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        ) : aboutError ? (
          <p className="mt-4 text-sm text-red-600">{aboutError}</p>
        ) : null}

        {aboutSuccess ? <p className="mt-4 text-sm text-green-600">{aboutSuccess}</p> : null}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Visible</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(aboutForm.isVisible)}
                onChange={(e) => setAboutForm((p) => ({ ...p, isVisible: e.target.checked }))}
              />
              <span className="text-sm text-muted-foreground">Show on site</span>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={aboutForm.title ?? ""}
              onChange={(e) => setAboutForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="About Me"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Short Description</label>
            <Textarea
              value={aboutForm.shortDescription ?? ""}
              onChange={(e) => setAboutForm((p) => ({ ...p, shortDescription: e.target.value }))}
              placeholder="Short intro"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Long Description</label>
            <Textarea
              value={aboutForm.longDescription ?? ""}
              onChange={(e) => setAboutForm((p) => ({ ...p, longDescription: e.target.value }))}
              placeholder="Longer bio"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resume Button Text</label>
            <Input
              value={aboutForm.resumeButtonText ?? ""}
              onChange={(e) => setAboutForm((p) => ({ ...p, resumeButtonText: e.target.value }))}
              placeholder="Download Resume"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resume Link</label>
            <Input
              value={aboutForm.resumeLink ?? ""}
              onChange={(e) => setAboutForm((p) => ({ ...p, resumeLink: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          <div>image: {aboutSection?.profileImage?.url ?? "—"}</div>
          <div>stage: {aboutSection?.stage ?? "—"}</div>
          <div>updatedAt: {aboutSection?.updatedAt ?? "—"}</div>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Skills</h2>
            <p className="text-sm text-muted-foreground">Edits existing skills (name/level/category/visibility). Icons are managed in Hygraph.</p>
          </div>
          <Button onClick={saveSkills} disabled={skillsLoading || skillsSaving}>
            {skillsSaving ? "Saving..." : "Save"}
          </Button>
        </div>

        {skillsLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        ) : skillsError ? (
          <p className="mt-4 text-sm text-red-600">{skillsError}</p>
        ) : null}

        {skillsSuccess ? <p className="mt-4 text-sm text-green-600">{skillsSuccess}</p> : null}

        <div className="mt-6 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-2">Visible</th>
                <th className="py-2 pr-2">Name</th>
                <th className="py-2 pr-2">Level</th>
                <th className="py-2 pr-2">Category</th>
                <th className="py-2 pr-2">Icon</th>
              </tr>
            </thead>
            <tbody>
              {skillsForm.map((s, idx) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 pr-2">
                    <input
                      type="checkbox"
                      checked={Boolean(s.isVisible)}
                      onChange={(e) =>
                        setSkillsForm((prev) => {
                          const copy = [...prev];
                          copy[idx] = { ...copy[idx], isVisible: e.target.checked };
                          return copy;
                        })
                      }
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      value={s.name ?? ""}
                      onChange={(e) =>
                        setSkillsForm((prev) => {
                          const copy = [...prev];
                          copy[idx] = { ...copy[idx], name: e.target.value };
                          return copy;
                        })
                      }
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      type="number"
                      value={String(s.level ?? 0)}
                      onChange={(e) =>
                        setSkillsForm((prev) => {
                          const copy = [...prev];
                          copy[idx] = { ...copy[idx], level: Number(e.target.value) };
                          return copy;
                        })
                      }
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Input
                      value={s.category ?? ""}
                      onChange={(e) =>
                        setSkillsForm((prev) => {
                          const copy = [...prev];
                          copy[idx] = { ...copy[idx], category: e.target.value };
                          return copy;
                        })
                      }
                      placeholder="frontend / backend / database / ai"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    {s?.icon?.url ? (
                      <a className="text-blue-600 underline" href={s.icon.url} target="_blank" rel="noopener noreferrer">
                        view
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">skills: {skills?.length ?? 0}</div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Projects</h2>
            <p className="text-sm text-muted-foreground">
              Add / edit / publish projects directly in Hygraph. This admin page only reads data.
            </p>
          </div>
          <Button asChild>
            <a href="https://app.hygraph.com" target="_blank" rel="noopener noreferrer">
              Open Hygraph
            </a>
          </Button>
        </div>
      </Card>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Card key={p.id} className="p-4 space-y-2">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>
            <span className="text-xs bg-gray-200 rounded px-2 py-0.5">{p.category}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}