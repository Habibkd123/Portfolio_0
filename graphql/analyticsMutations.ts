export const INCREMENT_ANALYTICS_VIEWS = /* GraphQL */ `
  mutation IncrementAnalyticsViews($type: String!, $slug: String!) {
    upsertAnalytics(
      where: { type_slug: { type: $type, slug: $slug } }
      upsert: {
        create: { type: $type, slug: $slug, views: 1, clicks: 0, stage: PUBLISHED }
        update: { views: { increment: 1 } }
      }
    ) {
      id
      type
      slug
      views
      clicks
      stage
    }
  }
`;

export const INCREMENT_ANALYTICS_CLICKS = /* GraphQL */ `
  mutation IncrementAnalyticsClicks($type: String!, $slug: String!) {
    upsertAnalytics(
      where: { type_slug: { type: $type, slug: $slug } }
      upsert: {
        create: { type: $type, slug: $slug, views: 0, clicks: 1, stage: PUBLISHED }
        update: { clicks: { increment: 1 } }
      }
    ) {
      id
      type
      slug
      views
      clicks
      stage
    }
  }
`;

export const GET_ANALYTICS_BY_TYPE_AND_SLUG = /* GraphQL */ `
  query GetAnalytics($type: String!, $slug: String!) {
    analytics(where: { type: $type, slug: $slug }) {
      id
      type
      slug
      views
      clicks
      stage
    }
  }
`;
