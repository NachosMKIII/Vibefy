// auth.js
import { useCallback } from "react";
import { refreshAccessToken } from "../functions/spoitfyUtils";

export const useSpotifyApi = () => {
  const makeApiCall = useCallback(
    async (url, options = {}) => {
      let accessToken = localStorage.getItem("access_token");
      const expirationTime = localStorage.getItem("expiration_time");
      if (!accessToken || !expirationTime) {
        throw new Error("No access token or expiration time found");
      }

      const currentTime = Date.now();
      if (currentTime >= expirationTime - 60000) {
        try {
          accessToken = await refreshAccessToken();
        } catch (error) {
          console.error("Failed to refresh access token:", error);
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
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      return response.json();
    },
    [refreshAccessToken]
  );

  return makeApiCall;
};
