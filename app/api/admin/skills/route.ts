import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hygraphAdmin } from "@/lib/hygraph";

type Skill = {
  id: string;
  name: string;
  level: number;
  category?: string | null;
  isVisible?: boolean | null;
  icon?: { url?: string | null } | null;
};

const GET_SKILLS_ADMIN = /* GraphQL */ `
  query SkillsAdmin {
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

const UPDATE_SKILL = /* GraphQL */ `
  mutation UpdateSkill($id: ID!, $data: SkillUpdateInput!) {
    updateSkill(where: { id: $id }, data: $data) {
      id
    }
  }
`;

const PUBLISH_SKILL = /* GraphQL */ `
  mutation PublishSkill($id: ID!) {
    publishSkill(where: { id: $id }) {
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
    const res = await hygraphAdmin.request<{ skills: Skill[] }>(GET_SKILLS_ADMIN);
    return NextResponse.json({ skills: Array.isArray(res?.skills) ? res.skills : [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load skills" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { skills?: Partial<Skill>[] } | null;
  if (!body || !Array.isArray(body.skills)) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    for (const s of body.skills) {
      if (!s?.id) continue;
      const data: Record<string, any> = {
        name: s.name ?? null,
        level: typeof s.level === "number" ? s.level : null,
        category: s.category ?? null,
        isVisible: typeof s.isVisible === "boolean" ? s.isVisible : null,
      };

      await hygraphAdmin.request(UPDATE_SKILL, { id: s.id, data });
      await hygraphAdmin.request(PUBLISH_SKILL, { id: s.id });
    }

    const refreshed = await hygraphAdmin.request<{ skills: Skill[] }>(GET_SKILLS_ADMIN);
    return NextResponse.json({ skills: Array.isArray(refreshed?.skills) ? refreshed.skills : [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update skills" }, { status: 500 });
  }
}
