export const GET_PROJECTS = /* GraphQL */ `
  query Projects {
    projects(orderBy: createdAt_DESC) {
      id
      title
      description
      imageUrl
      tags
      githubUrl
      liveUrl
      category
      createdAt
    }
  }
`;

export const GET_PROJECT_BY_ID = /* GraphQL */ `
  query ProjectById($id: ID!) {
    project(where: { id: $id }) {
      id
      title
      description
      imageUrl
      tags
      githubUrl
      liveUrl
      category
      createdAt
    }
  }
`;

export const GET_PROJECTS_BY_ID = /* GraphQL */ `
  query ProjectsById($id: ID!) {
    projects(where: { id: $id }, first: 1) {
      id
      title
      description
      imageUrl
      tags
      githubUrl
      liveUrl
      category
      createdAt
    }
  }
`;
