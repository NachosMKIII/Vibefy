// src/lib/spotifyUtils.jsx
"use server";
import { cookies } from "next/headers";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

export const refreshAccessToken = async () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!clientId) {
    throw new Error("Missing Spotify Client ID in environment variables");
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
    throw new Error("Failed to refresh token");
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
  return data.access_token;
};
