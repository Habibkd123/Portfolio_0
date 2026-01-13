
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hygraphAdmin } from "@/lib/hygraph";
import { GET_ALL_ANALYTICS } from "@/graphql/analyticsQueries";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await hygraphAdmin.request<{ analytics: any[] }>(GET_ALL_ANALYTICS);
        return NextResponse.json({ analytics: data.analytics || [] });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Failed to load analytics" }, { status: 500 });
    }
}
