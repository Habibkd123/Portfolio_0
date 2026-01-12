import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hygraphAdmin } from "@/lib/hygraph";
import { QUERIES } from "@/graphql/operations";

type SiteSettings = {
  id: string;
  singletonId: string;
  siteTitle?: string | null;
  siteDescription?: string | null;
  logoText?: string | null;
  footerAbout?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  email?: string | null;
};

const UPDATE_SINGLETON = /* GraphQL */ `
  mutation UpdateSingleton($id: ID!, $data: SingletonUpdateInput!) {
    updateSingleton(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const PUBLISH_SINGLETON = /* GraphQL */ `
  mutation PublishSingleton($id: ID!) {
    publishSingleton(where: { id: $id }) {
      id
      stage
    }
  }
`;

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await hygraphAdmin.request<{ singletons: SiteSettings[] }>(QUERIES.site.settings, { singletonId: "site" });
    const siteSettings = Array.isArray(res?.singletons) && res.singletons.length > 0 ? res.singletons[0] : null;
    return NextResponse.json({ siteSettings });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load site settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<SiteSettings> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const current = await hygraphAdmin.request<{ singletons: SiteSettings[] }>(QUERIES.site.settings, { singletonId: "site" });
    const siteSettings = Array.isArray(current?.singletons) && current.singletons.length > 0 ? current.singletons[0] : null;

    if (!siteSettings?.id) {
      return NextResponse.json(
        { error: "SiteSettings singleton not found. Create a Singleton record with singletonId = site." },
        { status: 404 }
      );
    }

    const data: Record<string, any> = {
      siteTitle: body.siteTitle ?? null,
      siteDescription: body.siteDescription ?? null,
      logoText: body.logoText ?? null,
      footerAbout: body.footerAbout ?? null,
      githubUrl: body.githubUrl ?? null,
      linkedinUrl: body.linkedinUrl ?? null,
      twitterUrl: body.twitterUrl ?? null,
      email: body.email ?? null,
    };

    await hygraphAdmin.request(UPDATE_SINGLETON, { id: siteSettings.id, data });
    await hygraphAdmin.request(PUBLISH_SINGLETON, { id: siteSettings.id });

    const refreshed = await hygraphAdmin.request<{ singletons: SiteSettings[] }>(QUERIES.site.settings, { singletonId: "site" });
    const updated = Array.isArray(refreshed?.singletons) && refreshed.singletons.length > 0 ? refreshed.singletons[0] : null;

    return NextResponse.json({ siteSettings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update site settings" }, { status: 500 });
  }
}
