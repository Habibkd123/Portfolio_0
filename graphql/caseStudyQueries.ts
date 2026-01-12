export const GET_CASE_STUDY_BY_ID = /* GraphQL */ `
  query CaseStudyById($id: ID!) {
    caseStudy(where: { id: $id }) {
      active
      challenges
      featured
      features
      gitHubUrl
      id
      liveUrl
      problem
      resultsOutcome
      shortDescription
      solution
      stage
      techStack
      title
      coverImage {
        url
      }
    }
  }
`;
