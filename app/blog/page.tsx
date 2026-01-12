import Link from "next/link";
import type { Metadata } from "next";
import { hygraphPublic } from "@/lib/hygraph";
import { GET_BLOG_POSTS } from "@/graphql/blogQueries";
import { QUERIES } from "@/graphql/operations";
import { getHygraphMetadata } from "@/lib/seo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  readTime?: string | null;
  publishedAt?: string | null;
};

export async function generateMetadata(): Promise<Metadata> {
  const fallbackTitle = "Blog";
  const fallbackDescription = "All articles and tutorials.";

  return getHygraphMetadata({
    slug: "blog",
    fallbackTitle,
    fallbackDescription,
  });
}

export default async function BlogIndexPage() {
  const data = await hygraphPublic.request<{ blogPosts: BlogPostListItem[] }>(GET_BLOG_POSTS);
  const posts = data.blogPosts ?? [];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
        <p className="text-foreground/70 mt-2">All articles and tutorials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="h-full flex flex-col overflow-hidden">
            <div className="relative overflow-hidden aspect-video">
              <Image
                src={post.coverImageUrl || "/placeholder.svg"}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                className="object-cover"
              />
            </div>

            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
              <CardDescription className="text-foreground/70">
                {post.excerpt || ""}
              </CardDescription>
            </CardContent>

            <CardFooter className="justify-end">
              <Button asChild>
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
