//Auth.jsx
"use client";
import { useCallback } from "react";

export const useSpotifyApi = () => {
  const makeApiCall = useCallback(
    async (url, options = {}) => {
      let accessToken = localStorage.getItem("access_token");
      const expirationTimeStr = localStorage.getItem("expiration_time");
      const expirationTime = expirationTimeStr
        ? parseInt(expirationTimeStr, 10)
        : null;

      if (!accessToken || !expirationTime || isNaN(expirationTime)) {
        throw new Error("Invalid access token or expiration time");
      }

      const currentTime = Date.now();
      if (currentTime >= expirationTime - 60000) {
        try {
          accessToken = await refreshAccessToken();
        } catch (error) {
          console.error("Failed to refresh access token:");
          throw new Error("Unable to refresh access token");
        }
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
    },
    [refreshAccessToken]
  );

  return makeApiCall;
};
