// src/app/api/refresh/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token available" },
      { status: 400 }
    );
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Missing Spotify Client ID in environment variables" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", clientId);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: response.status }
    );
  }

  const data = await response.json();
  cookieStore.set("access_token", data.access_token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  if (data.refresh_token) {
    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
  }
  cookieStore.set(
    "expiration_time",
    (Date.now() + data.expires_in * 1000).toString(),
    {
      httpOnly: true,
      secure: true,
      path: "/",
    }
  );
  return NextResponse.json({ token: data.access_token });
}
