export const CREATE_ANALYTICS = /* GraphQL */ `
  mutation CreateAnalytic($type: String!, $slug: String!, $views: Int!, $clicks: Int!) {
    createAnalytic(data: { type: $type, slug: $slug, views: $views, clicks: $clicks }) {
      id
      views
      clicks
    }
  }
`;

export const PUBLISH_ANALYTICS = /* GraphQL */ `
  mutation PublishAnalytic($id: ID!) {
    publishAnalytic(where: { id: $id }) {
      id
      stage
    }
  }
`;

export const UPDATE_ANALYTICS_VIEWS = /* GraphQL */ `
  mutation UpdateAnalyticViews($id: ID!, $views: Int!) {
    updateAnalytic(where: { id: $id }, data: { views: $views }) {
      id
      views
      clicks
    }
  }
`;

export const UPDATE_ANALYTICS_CLICKS = /* GraphQL */ `
  mutation UpdateAnalyticClicks($id: ID!, $clicks: Int!) {
    updateAnalytic(where: { id: $id }, data: { clicks: $clicks }) {
      id
      views
      clicks
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
