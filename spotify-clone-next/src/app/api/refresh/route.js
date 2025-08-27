import { refreshAccessToken } from "@/lib/SpotifyUtils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await refreshAccessToken();
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
