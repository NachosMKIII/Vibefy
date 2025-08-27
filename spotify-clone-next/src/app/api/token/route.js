// src/app/api/token/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { code, codeVerifier } = await request.json();

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);
  params.append("code_verifier", codeVerifier);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await response.json();

  if (data.access_token) {
    const cookieStore = cookies();
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(data, { status: response.status });
  }
}
