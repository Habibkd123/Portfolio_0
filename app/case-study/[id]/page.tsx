import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { hygraphPublic } from '@/lib/hygraph';
import { QUERIES } from '@/graphql/operations';
import { getHygraphMetadata } from '@/lib/seo';
import TrackView from '@/components/track-view';


type CaseStudy = {
  id: string;
  title: string;
  shortDescription?: string | null;
  problem?: string | null;
  solution?: string | null;
  resultsOutcome?: string | null;
  challenges?: string[] | null;
  features?: string[] | null;
  techStack?: string[] | null;
  stage?: string | null;
  gitHubUrl?: string | null;
  liveUrl?: string | null;
  coverImage?: {
    url: string;
  } | null;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const fallbackTitle = 'Case Study';
  const fallbackDescription = 'Detailed case study';

  let ogImageUrl: string | undefined;
  try {
    const { caseStudy } = await hygraphPublic.request<{ caseStudy: CaseStudy | null }>(
      QUERIES.caseStudy.bySlug,
      { slug: id }
    );
    ogImageUrl = caseStudy?.coverImage?.url ?? undefined;
  } catch {
    ogImageUrl = undefined;
  }

  return getHygraphMetadata({
    slug: id,
    fallbackTitle,
    fallbackDescription,
    openGraphImageUrl: ogImageUrl,
  });
}
export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let caseStudy: CaseStudy | null = null;

  try {
    const data = await hygraphPublic.request<{ caseStudy: CaseStudy | null }>(
      QUERIES.caseStudy.bySlug,
      { slug: id }
    );
    caseStudy = data.caseStudy;
  } catch (err) {
    console.error('Error fetching case study:', err);
    return notFound();
  }

  if (!caseStudy) {
    return notFound();
  }

  const techStack = Array.isArray(caseStudy.techStack)
    ? caseStudy.techStack
    : typeof (caseStudy as any).techStack === 'string'
      ? [(caseStudy as any).techStack]
      : []

  const challenges = Array.isArray(caseStudy.challenges)
    ? caseStudy.challenges
    : typeof (caseStudy as any).challenges === 'string'
      ? [(caseStudy as any).challenges]
      : []

  const features = Array.isArray(caseStudy.features)
    ? caseStudy.features
    : typeof (caseStudy as any).features === 'string'
      ? [(caseStudy as any).features]
      : []

  // // Track view on the client side
  // const TrackCaseStudyView = () => {
  //   // useEffect(() => {
  //     trackEvent({ type: 'case-study', slug: id, event: 'view' });
  //   // }, [id]);
  //   return <></>;
  // };

  return (
    <div className="container mx-auto px-4 py-12">
      <TrackView type="case-study" slug={id} />

      <div className="mb-8">
        <Link href="/#case-studies" className="text-sm text-foreground/70 hover:text-primary transition-colors">
          ← Back to Case Studies
        </Link>
      </div>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{caseStudy.title}</h1>
          {caseStudy.shortDescription && (
            <p className="text-xl text-foreground/80">{caseStudy.shortDescription}</p>
          )}
        </header>

        {caseStudy.coverImage?.url && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 border">
            <Image
              src={caseStudy.coverImage.url}
              alt={caseStudy.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div className="prose max-w-none dark:prose-invert">
          {caseStudy.problem && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">The Challenge</h2>
              <p className="whitespace-pre-line">{caseStudy.problem}</p>
            </section>
          )}

          {caseStudy.solution && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">The Solution</h2>
              <p className="whitespace-pre-line">{caseStudy.solution}</p>
            </section>
          )}

          {caseStudy.resultsOutcome && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Results & Impact</h2>
              <p className="whitespace-pre-line">{caseStudy.resultsOutcome}</p>
            </section>
          )}

          {challenges.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Key Challenges</h2>
              <ul className="list-disc pl-6 space-y-2">
                {challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </section>
          )}

          {features.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                {features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {caseStudy.liveUrl && (
            <Button asChild>
              <a href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                View Live Project
              </a>
            </Button>
          )}
          {caseStudy.gitHubUrl && (
            <Button variant="outline" asChild>
              <a href={caseStudy.gitHubUrl} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          )}
        </div>
      </article>
    </div>
  );
}
