// src/app/api/refresh/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    console.error("No refresh token available in /api/refresh");
    return NextResponse.json(
      { error: "No refresh token available" },
      { status: 400 }
    );
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("Missing Spotify credentials in environment variables", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
    });
    return NextResponse.json(
      { error: "Missing Spotify credentials in environment variables" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: params,
  });

  if (!response.ok) {
    console.error("Failed to refresh token:", await response.text());
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: response.status }
    );
  }

  const data = await response.json();
  cookieStore.set("access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  if (data.refresh_token) {
    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  cookieStore.set(
    "expiration_time",
    (Date.now() + data.expires_in * 1000).toString(),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    }
  );
  return NextResponse.json({ token: data.access_token });
}
