// src/app/components/LoginButton.jsx
import React from "react";

const charset =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

const generateRandomString = (length) => {
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  return Array.from(
    randomValues,
    (byte) => charset[byte % charset.length]
  ).join("");
};

const sha256 = async (string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hash = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashString = hashArray.map((b) => String.fromCharCode(b)).join("");
  return btoa(hashString)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// Spotify app credentials (replace with your own)
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
const scope =
  "user-read-email user-read-playback-state user-read-private user-modify-playback-state user-read-currently-playing streaming"; // Adjust scopes as needed

const LoginButton = () => {
  const authorizeSpotify = async () => {
    if (!clientId || !redirectUri) {
      console.error(
        "Missing environment variables: VITE_SPOTIFY_CLIENT_ID or VITE_REDIRECT_URI"
      );
      alert("App configuration error. Please check environment variables.");
      return;
    }

    const codeVerifier = generateRandomString(64);
    localStorage.setItem("code_verifier", codeVerifier);

    const codeChallenge = await sha256(codeVerifier);

    const state = generateRandomString(16);

    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `code_challenge_method=S256&` +
      `code_challenge=${codeChallenge}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;

    // Redirect to Spotify authorization page
    window.location.href = authUrl;
  };

  return (
    <div className=" flex items-center absolute z-10 left-[800px] bottom-[60px] justify-center">
      <button
        className="cursor-pointer login-button bg-green-500 py-2 px-10 rounded-full text-black"
        onClick={authorizeSpotify}
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default LoginButton;
