import { GET_PROJECTS, GET_PROJECT_BY_ID, GET_PROJECTS_BY_ID } from "./projectQueries";
import { GET_BLOG_POSTS, GET_BLOG_POST_BY_SLUG, GET_BLOG_POSTS_BY_SLUG } from "./blogQueries";
import { GET_ANALYTICS_BY_TYPE } from "./analyticsQueries";
import { GET_CASE_STUDY_BY_ID } from "./caseStudyQueries";
import {
  GET_ANNOUNCEMENT_BAR,
  GET_ABOUT_SECTION,
  GET_CTA_SECTION,
  GET_FOOTER_LINKS,
  GET_FOOTER_SECTION,
  GET_HERO_SECTION,
  GET_HERO_TEXT,
  GET_NAVIGATION,
  GET_SEO_SECTION,
  GET_SITE_SETTINGS,
  GET_SKILLS,
  GET_TESTIMONIALS,
} from "./siteQueries";

export const QUERIES = {
  projects: {
    list: GET_PROJECTS,
    byId: GET_PROJECT_BY_ID,
    byIdFallback: GET_PROJECTS_BY_ID,
  },
  blog: {
    list: GET_BLOG_POSTS,
    bySlug: GET_BLOG_POST_BY_SLUG,
    bySlugFallback: GET_BLOG_POSTS_BY_SLUG,
  },
  analytics: {
    byType: GET_ANALYTICS_BY_TYPE,
  },
  caseStudy: {
    byId: GET_CASE_STUDY_BY_ID,
  },
  site: {
    settings: GET_SITE_SETTINGS,
    seoSection: GET_SEO_SECTION,
    hero: GET_HERO_SECTION,
    heroText: GET_HERO_TEXT,
    aboutSection: GET_ABOUT_SECTION,
    skills: GET_SKILLS,
    ctaSection: GET_CTA_SECTION,
    testimonials: GET_TESTIMONIALS,
    announcementBar: GET_ANNOUNCEMENT_BAR,
    navigation: GET_NAVIGATION,
    footerLinks: GET_FOOTER_LINKS,
    footerSection: GET_FOOTER_SECTION,
  },
} as const;
