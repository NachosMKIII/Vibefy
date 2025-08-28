// src/app/Auth.jsx
"use client";

import { useCallback } from "react";

export const useSpotifyApi = () => {
  const makeApiCall = useCallback(async (url, options = {}) => {
    let accessToken;
    try {
      const response = await fetch("/api/get-token");
      const data = await response.json();
      if (!data.access_token) {
        throw new Error("No access token available");
      }
      accessToken = data.access_token;
    } catch (error) {
      console.error("Failed to fetch access token:", error);
      throw new Error("Unable to fetch access token");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(
          `Network response was not ok: ${response.status} - ${JSON.stringify(
            errorData
          )}`
        );
      } else {
        const text = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} - ${text}`
        );
      }
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      return response.text();
    }
  }, []);

  return makeApiCall;
};
