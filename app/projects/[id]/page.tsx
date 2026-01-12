import Link from "next/link";
import { notFound } from "next/navigation";
import { hygraphPublic } from "@/lib/hygraph";
import { GET_PROJECTS_BY_ID } from "@/graphql/projectQueries";
import { QUERIES } from "@/graphql/operations";
import { getHygraphMetadata } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import TrackView from "@/components/track-view";
import type { Metadata } from "next";
import Image from "next/image";

type Project = {
  id: string;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  tags?: string[] | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  createdAt?: string | null;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const fallbackTitle = "Project";
  const fallbackDescription = "Project details";

  let ogImageUrl: string | undefined
  try {
    const projectRes = await hygraphPublic.request<{ projects: Project[] }>(GET_PROJECTS_BY_ID, { id })
    const project = Array.isArray(projectRes?.projects) && projectRes.projects.length > 0 ? projectRes.projects[0] : null
    ogImageUrl = project?.imageUrl ?? undefined
  } catch {
    ogImageUrl = undefined
  }

  return getHygraphMetadata({
    slug: id,
    fallbackTitle,
    fallbackDescription,
    openGraphImageUrl: ogImageUrl,
  });
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let project: Project | null = null;
  try {
    const data = await hygraphPublic.request<{ projects: Project[] }>(GET_PROJECTS_BY_ID, { id });
    project = Array.isArray(data.projects) && data.projects.length > 0 ? data.projects[0] : null;
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "";
    if (msg.toLowerCase().includes("not allowed") || msg.includes("403")) {
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Link href="/#projects" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              ← Back to Projects
            </Link>
            <h1 className="text-2xl font-bold mt-6">Project not available</h1>
            <p className="text-foreground/70 mt-2">
              This project is not accessible from the current Hygraph API permissions/stage.
            </p>
            <p className="text-foreground/70 mt-2">
              Publish the project in Hygraph and allow public read for <code>Project</code>, then refresh.
            </p>
          </div>
        </div>
      );
    }
    throw err;
  }

  if (!project) return notFound();

  return (
    <div className="container mx-auto px-4 py-16">
      <TrackView type="project" slug={id} />
      <article className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/#projects" className="text-sm text-foreground/70 hover:text-primary transition-colors">
            ← Back to Projects
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
          {project.category ? <p className="text-foreground/60 mt-2">{project.category}</p> : null}
          {project.description ? <p className="text-foreground/70 mt-3">{project.description}</p> : null}
        </header>

        <div className="relative overflow-hidden aspect-video rounded-lg mb-8 border">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title || "Project"}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {Array.isArray(project.tags) && project.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex gap-3">
          {project.githubUrl ? (
            <a
              className="text-sm text-primary underline"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              className="text-sm text-primary underline"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </a>
          ) : null}
        </div>
      </article>
    </div>
  );
}
