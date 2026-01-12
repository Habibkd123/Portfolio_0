import { notFound } from "next/navigation";
import { hygraphPublic } from "@/lib/hygraph";
import { GET_BLOG_POSTS_BY_SLUG } from "@/graphql/blogQueries";
import { QUERIES } from "@/graphql/operations";
import { getHygraphMetadata } from "@/lib/seo";
import Link from "next/link";
import type React from "react";
import type { Metadata } from "next";
import Image from "next/image";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: { raw: any } | null;
  coverImageUrl?: string | null;
  readTime?: string | null;
  publishedAt?: string | null;
  screenshots?: string[] | null;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fallbackTitle = "Blog";
  const fallbackDescription = "Blog post";

  let ogImageUrl: string | undefined
  try {
    const postRes = await hygraphPublic.request<{ blogPosts: BlogPost[] }>(GET_BLOG_POSTS_BY_SLUG, { slug })
    const post = Array.isArray(postRes?.blogPosts) && postRes.blogPosts.length > 0 ? postRes.blogPosts[0] : null
    ogImageUrl = post?.coverImageUrl ?? undefined
  } catch {
    ogImageUrl = undefined
  }

  return getHygraphMetadata({
    slug,
    fallbackTitle,
    fallbackDescription,
    openGraphImageUrl: ogImageUrl,
  });
}

function renderRichTextNode(node: any, key: React.Key): React.ReactNode {
  if (!node) return null;

  if (typeof node.text === "string") {
    let el: React.ReactNode = node.text;
    if (node.code) el = <code key={key}>{el}</code>;
    if (node.bold) el = <strong key={key}>{el}</strong>;
    if (node.italic) el = <em key={key}>{el}</em>;
    if (node.underline) el = <u key={key}>{el}</u>;
    return el;
  }

  const children = Array.isArray(node.children)
    ? node.children.map((child: any, i: number) => renderRichTextNode(child, `${key}-${i}`))
    : null;

  switch (node.type) {
    case "heading-one":
      return <h1 key={key}>{children}</h1>;
    case "heading-two":
      return <h2 key={key}>{children}</h2>;
    case "heading-three":
      return <h3 key={key}>{children}</h3>;
    case "heading-four":
      return <h4 key={key}>{children}</h4>;
    case "bulleted-list":
      return <ul key={key}>{children}</ul>;
    case "numbered-list":
      return <ol key={key}>{children}</ol>;
    case "list-item":
      return <li key={key}>{children}</li>;
    case "link": {
      const href = typeof node.href === "string" ? node.href : "#";
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    case "blockquote":
      return <blockquote key={key}>{children}</blockquote>;
    case "code-block":
      return (
        <pre key={key}>
          <code>{children}</code>
        </pre>
      );
    case "paragraph":
    default:
      return <p key={key}>{children}</p>;
  }
}

function renderRichText(raw: any): React.ReactNode {
  if (!raw || !Array.isArray(raw.children)) return null;
  return raw.children.map((node: any, i: number) => renderRichTextNode(node, `n-${i}`));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: BlogPost | null = null;
  try {
    const data = await hygraphPublic.request<{ blogPosts: BlogPost[] }>(GET_BLOG_POSTS_BY_SLUG, { slug });
    post = Array.isArray(data.blogPosts) && data.blogPosts.length > 0 ? data.blogPosts[0] : null;
  } catch (err: any) {
    const msg = typeof err?.message === "string" ? err.message : "";
    if (msg.toLowerCase().includes("not allowed") || msg.includes("403")) {
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Link href="/blog" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              ← Back to Blog
            </Link>
            <h1 className="text-2xl font-bold mt-6">Post not available</h1>
            <p className="text-foreground/70 mt-2">
              This post is not accessible from the current Hygraph API permissions/stage.
            </p>
            <p className="text-foreground/70 mt-2">
              Publish the post in Hygraph and allow public read for <code>BlogPost</code>, then refresh.
            </p>
          </div>
        </div>
      );
    }
    throw err;
  }

  if (!post) return notFound();

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/blog" className="text-sm text-foreground/70 hover:text-primary transition-colors">
            ← Back to Blog
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
          <div className="mt-3 text-sm text-foreground/60">
            {post.publishedAt ? <span>{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
            {post.publishedAt && post.readTime ? <span className="mx-2">·</span> : null}
            {post.readTime ? <span>{post.readTime}</span> : null}
          </div>
          {post.excerpt ? <p className="text-foreground/70 mt-3">{post.excerpt}</p> : null}
        </header>

        <div className="relative overflow-hidden aspect-video rounded-lg mb-8">
          <Image
            src={post.coverImageUrl || "/placeholder.svg"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        {post.content?.raw ? (
          <div className="prose prose-neutral dark:prose-invert max-w-none">{renderRichText(post.content.raw)}</div>
        ) : null}

        {Array.isArray(post.screenshots) && post.screenshots.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.screenshots.map((url) => (
                <div key={url} className="overflow-hidden rounded-lg border">
                  <img src={url} alt="Screenshot" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}
