export const GET_SITE_SETTINGS = /* GraphQL */ `
  query SiteSettings($singletonId: String!) {
    singletons(where: { singletonId: $singletonId }, first: 1) {
      id
      singletonId
      siteTitle
      siteDescription
      logoText
      footerAbout
      githubUrl
      linkedinUrl
      twitterUrl
      email
      stage
      updatedAt
    }
  }
`;

export const GET_NAVIGATION = /* GraphQL */ `
  query Navigation($singletonId: String!) {
    navigation(where: { singletonId: $singletonId }) {
      singletonId
      links {
        label
        href
        order
      }
    }
  }
`;

export const GET_FOOTER_LINKS = /* GraphQL */ `
  query FooterLinks {
    footerLinks(orderBy: order_ASC) {
      group
      label
      href
      order
    }
  }
`;

export const GET_FOOTER_SECTION = /* GraphQL */ `
  query FooterSection {
    footerSections(first: 1) {
      isVisible
      footerText
      quickLinks {
        label
        slug
      }
      socialLinks {
        github
        linkedin
        twitter
        instagram
      }
      contactInfo {
        email
        phone
        address
      }
    }
  }
`;

export const GET_SEO_SECTION = /* GraphQL */ `
  query SeoSection($slug: String!) {
    seoSections(where: { slug: $slug }, first: 1) {
      metaTitle
      metaDescription
      keywords
      ogImage {
        url
      }
      url
    }
  }
`;

export const GET_HERO_SECTION = /* GraphQL */ `
  query HeroSection($singletonId: String!) {
    heroSections(where: { singletonId: $singletonId }, first: 1) {
      singletonId
      badgeText
      headingLine1
      headingHighlight
      subheading
      primaryButtonText
      primaryButtonHref
      secondaryButtonText
      secondaryButtonHref
      heroImageUrl {
        url
      }
    }
  }
`;

export const GET_HERO_TEXT = /* GraphQL */ `
  query HeroText($singletonId: String!) {
    heroTexts(where: { singletonId: $singletonId }, first: 1) {
      id
      singletonId
      heading
      subHeading
      buttonText
      stage
      updatedAt
    }
  }
`;

export const GET_ABOUT_SECTION = /* GraphQL */ `
  query AboutSection {
    aboutSections(first: 1) {
      isVisible
      title
      shortDescription
      longDescription
      resumeButtonText
      resumeLink
      profileImage {
        url
      }
    }
  }
`;

export const GET_SKILLS = /* GraphQL */ `
  query Skills {
    skills(orderBy: level_DESC) {
      id
      name
      level
      category
      isVisible
      icon {
        url
      }
    }
  }
`;

export const GET_CTA_SECTION = /* GraphQL */ `
  query CtaSection {
    ctas(first: 1) {
      isVisible
      title
      description
      buttonText
      buttonLink
      backgroundColor
    }
  }
`;

export const GET_TESTIMONIALS = /* GraphQL */ `
  query Testimonials {
    testimonials(orderBy: name_ASC) {
      name
      role
      message
      photo {
        url
      }
    }
  }
`;

export const GET_ANNOUNCEMENT_BAR = /* GraphQL */ `
  query AnnouncementBar {
    announcementBars(first: 1) {
      id
      isVisible
      message
      linkText
      linkUrl
      backgroundColor
      textColor
      stage
      updatedAt
    }
  }
`;
