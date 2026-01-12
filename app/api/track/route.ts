
import { NextResponse } from "next/server"

type TrackEventName = "view" | "click"

type TrackPayload = {
  type: string
  slug: string
  event: TrackEventName
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as TrackPayload | null

    if (!body || typeof body.type !== "string" || typeof body.slug !== "string" || (body.event !== "view" && body.event !== "click")) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
