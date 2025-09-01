// src/app/api/get-token/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); // Fetch cookies once
  const accessToken = cookieStore.get("access_token")?.value;
  const expirationTime = cookieStore.get("expiration_time")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken || !expirationTime || !refreshToken) {
    console.error("Missing cookies in /api/get-token");
    return NextResponse.json(
      { error: "No access token available" },
      { status: 401 }
    );
  }

  const currentTime = Date.now();
  if (currentTime >= parseInt(expirationTime, 10) - 60000) {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
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
      secure: process.env.NODE_ENV === "production", // Allow non-secure in dev
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

    return NextResponse.json({ access_token: data.access_token });
  }

  return NextResponse.json({ access_token: accessToken });
}
