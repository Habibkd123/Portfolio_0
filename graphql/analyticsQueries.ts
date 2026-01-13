export const GET_ANALYTICS_BY_TYPE = /* GraphQL */ `
  query AnalyticsByType($type: String!) {
    analytics(where: { type: $type }) {
      stage
      type
      views
      slug
      id
      clicks
    }
  }
`;

export const GET_ALL_ANALYTICS = /* GraphQL */ `
  query GetAllAnalytics {
    analytics(first: 100, orderBy: views_DESC) {
      id
      type
      slug
      views
      clicks
      updatedAt
    }
  }
`;
