// LoginButton.jsx
import React from "react";

// Character set for code verifier as per PKCE spec
const charset =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

// Generate a random string of specified length
const generateRandomString = (length) => {
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  return Array.from(
    randomValues,
    (byte) => charset[byte % charset.length]
  ).join("");
};

// Compute SHA-256 hash and return base64-URL-encoded string
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

    // Generate a 64-character code verifier
    const codeVerifier = generateRandomString(64);
    localStorage.setItem("code_verifier", codeVerifier);

    // Generate code challenge from verifier
    const codeChallenge = await sha256(codeVerifier);

    // Generate a state parameter for CSRF protection
    const state = generateRandomString(16);

    // Construct the authorization URL
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
