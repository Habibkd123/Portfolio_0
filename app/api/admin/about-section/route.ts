import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hygraphAdmin } from "@/lib/hygraph";
import { QUERIES } from "@/graphql/operations";

type AboutSection = {
  id: string;
  isVisible?: boolean | null;
  title?: string | null;
  shortDescription?: string | null;
  longDescription?: string | null;
  resumeButtonText?: string | null;
  resumeLink?: string | null;
  profileImage?: { url?: string | null } | null;
  stage?: string | null;
  updatedAt?: string | null;
};

const GET_ABOUT_SECTION_ADMIN = /* GraphQL */ `
  query AboutSectionAdmin {
    aboutSections(first: 1) {
      id
      isVisible
      title
      shortDescription
      longDescription
      resumeButtonText
      resumeLink
      profileImage {
        url
      }
      stage
      updatedAt
    }
  }
`;

const UPDATE_ABOUT_SECTION = /* GraphQL */ `
  mutation UpdateAboutSection($id: ID!, $data: AboutSectionUpdateInput!) {
    updateAboutSection(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const PUBLISH_ABOUT_SECTION = /* GraphQL */ `
  mutation PublishAboutSection($id: ID!) {
    publishAboutSection(where: { id: $id }) {
      id
      stage
    }
  }
`;

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await hygraphAdmin.request<{ aboutSections: AboutSection[] }>(GET_ABOUT_SECTION_ADMIN);
    const aboutSection = Array.isArray(res?.aboutSections) && res.aboutSections.length > 0 ? res.aboutSections[0] : null;
    return NextResponse.json({ aboutSection });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load about section" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<AboutSection> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const current = await hygraphAdmin.request<{ aboutSections: AboutSection[] }>(GET_ABOUT_SECTION_ADMIN);
    const aboutSection = Array.isArray(current?.aboutSections) && current.aboutSections.length > 0 ? current.aboutSections[0] : null;

    if (!aboutSection?.id) {
      return NextResponse.json({ error: "AboutSection not found. Create at least one AboutSection record." }, { status: 404 });
    }

    const data: Record<string, any> = {
      isVisible: body.isVisible ?? false,
      title: body.title ?? null,
      shortDescription: body.shortDescription ?? null,
      longDescription: body.longDescription ?? null,
      resumeButtonText: body.resumeButtonText ?? null,
      resumeLink: body.resumeLink ?? null,
    };

    await hygraphAdmin.request(UPDATE_ABOUT_SECTION, { id: aboutSection.id, data });
    await hygraphAdmin.request(PUBLISH_ABOUT_SECTION, { id: aboutSection.id });

    const refreshed = await hygraphAdmin.request<{ aboutSections: AboutSection[] }>(GET_ABOUT_SECTION_ADMIN);
    const updated = Array.isArray(refreshed?.aboutSections) && refreshed.aboutSections.length > 0 ? refreshed.aboutSections[0] : null;

    return NextResponse.json({ aboutSection: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update about section" }, { status: 500 });
  }
}
