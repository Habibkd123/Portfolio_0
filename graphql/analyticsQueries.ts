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
