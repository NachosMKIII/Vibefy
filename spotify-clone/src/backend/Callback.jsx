//Callback.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Callback = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    console.log("Authorization code:", code);

    if (code) {
      const codeVerifier = localStorage.getItem("code_verifier");
      console.log("Code verifier:", codeVerifier);
      if (!codeVerifier) {
        console.error("Code verifier not found in local storage");
        return;
      }

      const clientId = "4a5d0df8f02649c9a121fe843b20824a"; // Replace with your Spotify client ID
      const redirectUri = "http://localhost:5173/callback"; // Replace with your redirect URI

      const params = new URLSearchParams();
      params.append("client_id", clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", redirectUri);
      params.append("code_verifier", codeVerifier);

      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      })
        .then((response) => {
          console.log("Token response status:", response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Token data:", data);
          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            const expirationTime = Date.now() + data.expires_in * 1000;
            localStorage.setItem("expiration_time", expirationTime);
            console.log("Tokens stored successfully");
            window.location.href = "/";
          } else {
            console.error("Failed to retrieve tokens:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching token:", error);
        });
    } else {
      console.error("No authorization code found in URL");
    }
  }, [location]);

  return <div>Processing login...</div>;
};

export default Callback;
