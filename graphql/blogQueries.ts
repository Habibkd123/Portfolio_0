export const GET_BLOG_POSTS = /* GraphQL */ `
  query BlogPosts {
    blogPosts(orderBy: publishedAt_DESC) {
      id
      slug
      title
      excerpt
      coverImageUrl
      readTime
      publishedAt
    }
  }
`;

export const GET_BLOG_POST_BY_SLUG = /* GraphQL */ `
  query BlogPostBySlug($slug: String!) {
    blogPost(where: { slug: $slug }) {
      id
      slug
      title
      excerpt
      coverImageUrl
      readTime
      publishedAt
      content {
        raw
      }
      screenshots
    }
  }
`;

export const GET_BLOG_POSTS_BY_SLUG = /* GraphQL */ `
  query BlogPostsBySlug($slug: String!) {
    blogPosts(where: { slug: $slug }, first: 1) {
      id
      slug
      title
      excerpt
      coverImageUrl
      readTime
      publishedAt
      content {
        raw
      }
      screenshots
    }
  }
`;
