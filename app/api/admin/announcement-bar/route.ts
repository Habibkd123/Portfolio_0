import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hygraphAdmin } from "@/lib/hygraph";
import { QUERIES } from "@/graphql/operations";

type AnnouncementBar = {
  id: string;
  isVisible?: boolean | null;
  message?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  stage?: string | null;
  updatedAt?: string | null;
};

const UPDATE_ANNOUNCEMENT_BAR = /* GraphQL */ `
  mutation UpdateAnnouncementBar($id: ID!, $data: AnnouncementBarUpdateInput!) {
    updateAnnouncementBar(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const PUBLISH_ANNOUNCEMENT_BAR = /* GraphQL */ `
  mutation PublishAnnouncementBar($id: ID!) {
    publishAnnouncementBar(where: { id: $id }) {
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
    const res = await hygraphAdmin.request<{ announcementBars: AnnouncementBar[] }>(QUERIES.site.announcementBar);
    const announcementBar =
      Array.isArray(res?.announcementBars) && res.announcementBars.length > 0 ? res.announcementBars[0] : null;
    return NextResponse.json({ announcementBar });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load announcement bar" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<AnnouncementBar> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const current = await hygraphAdmin.request<{ announcementBars: AnnouncementBar[] }>(QUERIES.site.announcementBar);
    const announcementBar =
      Array.isArray(current?.announcementBars) && current.announcementBars.length > 0 ? current.announcementBars[0] : null;

    if (!announcementBar?.id) {
      return NextResponse.json(
        { error: "AnnouncementBar not found. Create at least one AnnouncementBar record." },
        { status: 404 }
      );
    }

    const data: Record<string, any> = {
      isVisible: body.isVisible ?? false,
      message: body.message ?? null,
      linkText: body.linkText ?? null,
      linkUrl: body.linkUrl ?? null,
      backgroundColor: body.backgroundColor ?? null,
      textColor: body.textColor ?? null,
    };

    await hygraphAdmin.request(UPDATE_ANNOUNCEMENT_BAR, { id: announcementBar.id, data });
    await hygraphAdmin.request(PUBLISH_ANNOUNCEMENT_BAR, { id: announcementBar.id });

    const refreshed = await hygraphAdmin.request<{ announcementBars: AnnouncementBar[] }>(QUERIES.site.announcementBar);
    const updated =
      Array.isArray(refreshed?.announcementBars) && refreshed.announcementBars.length > 0 ? refreshed.announcementBars[0] : null;

    return NextResponse.json({ announcementBar: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update announcement bar" }, { status: 500 });
  }
}
