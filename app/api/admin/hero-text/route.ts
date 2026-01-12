import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hygraphAdmin } from "@/lib/hygraph";
import { QUERIES } from "@/graphql/operations";

type HeroText = {
  id: string;
  singletonId: string;
  heading?: string | null;
  subHeading?: string | null;
  buttonText?: string | null;
  stage?: string | null;
  updatedAt?: string | null;
};

const UPDATE_HERO_TEXT = /* GraphQL */ `
  mutation UpdateHeroText($id: ID!, $data: HeroTextUpdateInput!) {
    updateHeroText(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const PUBLISH_HERO_TEXT = /* GraphQL */ `
  mutation PublishHeroText($id: ID!) {
    publishHeroText(where: { id: $id }) {
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
    const res = await hygraphAdmin.request<{ heroTexts: HeroText[] }>(QUERIES.site.heroText, { singletonId: "heroText" });
    const heroText = Array.isArray(res?.heroTexts) && res.heroTexts.length > 0 ? res.heroTexts[0] : null;
    return NextResponse.json({ heroText });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load hero text" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Partial<HeroText> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const current = await hygraphAdmin.request<{ heroTexts: HeroText[] }>(QUERIES.site.heroText, { singletonId: "heroText" });
    const heroText = Array.isArray(current?.heroTexts) && current.heroTexts.length > 0 ? current.heroTexts[0] : null;

    if (!heroText?.id) {
      return NextResponse.json(
        { error: "HeroText not found. Create a HeroText record with singletonId = heroText." },
        { status: 404 }
      );
    }

    const data: Record<string, any> = {
      heading: body.heading ?? null,
      subHeading: body.subHeading ?? null,
      buttonText: body.buttonText ?? null,
    };

    await hygraphAdmin.request(UPDATE_HERO_TEXT, { id: heroText.id, data });
    await hygraphAdmin.request(PUBLISH_HERO_TEXT, { id: heroText.id });

    const refreshed = await hygraphAdmin.request<{ heroTexts: HeroText[] }>(QUERIES.site.heroText, { singletonId: "heroText" });
    const updated = Array.isArray(refreshed?.heroTexts) && refreshed.heroTexts.length > 0 ? refreshed.heroTexts[0] : null;

    return NextResponse.json({ heroText: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update hero text" }, { status: 500 });
  }
}
