import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Callback = () => {
  const location = useLocation();

  useEffect(() => {
    // Parse URL parameters
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    // const state = searchParams.get('state'); // Optionally verify state

    if (code) {
      // Retrieve stored code verifier
      const codeVerifier = localStorage.getItem("code_verifier");
      if (!codeVerifier) {
        console.error("Code verifier not found in local storage");
        return;
      }

      // Spotify app credentials
      const clientId = "4a5d0df8f02649c9a121fe843b20824a"; // Same as in Login.js
      const redirectUri = "http://localhost:5173/callback";

      // Prepare token request parameters
      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", redirectUri);
      params.append("client_id", clientId);
      params.append("code_verifier", codeVerifier);

      // Request tokens from Spotify
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.refresh_token) {
            // Store the refresh token
            localStorage.setItem("refresh_token", data.refresh_token);
            console.log("Refresh token retrieved:", data.refresh_token);
            // Optionally store access token and other data
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("expires_in", data.expires_in);
            // Redirect to main app page (optional)
            window.location.href = "/";
          } else {
            console.error("Failed to retrieve refresh token:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching token:", error);
        });
    } else {
      console.error("No authorization code found in URL");
    }
  }, [location]);

  return <div>Processing Spotify authorization...</div>;
};

export default Callback;
