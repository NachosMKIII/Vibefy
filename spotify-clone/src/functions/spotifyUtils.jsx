// spotifyUtils.jsx

console.log("spotifyUtils env variables:", import.meta.env);
console.log(
  "VITE_SPOTIFY_CLIENT_ID type:",
  typeof import.meta.env.VITE_SPOTIFY_CLIENT_ID
);
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);
  params.append("client_id", clientId);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }
  const expirationTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem("expiration_time", expirationTime);
  return data.access_token;
};
