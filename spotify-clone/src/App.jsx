///App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AlbumRow from "./components/AlbumRow";
import LoginButton from "./components/LoginButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./backend/Callback";
import Player from "./components/Player";
import { SpotifyContext } from "./context/SpotifyContext";
import { refreshAccessToken } from "./functions/spotifyUtils"; // Import refreshAccessToken

const App = () => {
  const accessToken = localStorage.getItem("access_token");
  const [deviceId, setDeviceId] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);

  useEffect(() => {
    const initializePlayer = () => {
      const player = new Spotify.Player({
        name: "My Web Player",
        getOAuthToken: async (callback) => {
          let accessToken = localStorage.getItem("access_token");
          const expirationTime = localStorage.getItem("expiration_time");
          const currentTime = Date.now();

          if (expirationTime && currentTime >= expirationTime - 60000) {
            try {
              accessToken = await refreshAccessToken();
            } catch (error) {
              console.error("Failed to refresh access token:", error);
              // Optionally redirect to login or handle the error
            }
          }
          callback(accessToken);
        },
      });

      // Capture device ID when player is ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with device ID:", device_id);
        setDeviceId(device_id);
      });

      // Update playback state when it changes
      player.addListener("player_state_changed", (state) => {
        console.log("Playback state changed:", state);
        setPlaybackState(state);
      });

      // Add error listeners for better debugging
      player.addListener("initialization_error", ({ message }) => {
        console.error("Initialization Error:", message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error("Authentication Error:", message);
      });

      // Connect the player
      player.connect();

      // Clean up on unmount
      return () => {
        player.disconnect();
      };
    };

    // Set the callback before loading the script
    window.onSpotifyWebPlaybackSDKReady = initializePlayer;

    // Load the SDK script dynamically
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
      // Clear the callback to prevent memory leaks
      delete window.onSpotifyWebPlaybackSDKReady;
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <SpotifyContext.Provider value={{ deviceId }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="h-screen bg-[url('./assets/images/theme-cozy.jpg')] bg-center bg-cover bg-no-repeat w-screen overflow-hidden">
                <div className="h-[90%] flex">
                  <Sidebar theme="cozy" />
                  {accessToken ? (
                    <div className="flex-1 overflow-x-auto">
                      <AlbumRow theme="cozy" />
                      <AlbumRow theme="cozy" />
                    </div>
                  ) : (
                    <div>Please log in to see albums.</div>
                  )}
                </div>
                {!accessToken ? <LoginButton /> : ""}
                <Player theme="cozy" playbackState={playbackState} />
              </div>
            }
          />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </Router>
    </SpotifyContext.Provider>
  );
};

export default App;
