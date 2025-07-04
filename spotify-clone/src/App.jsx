//App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AlbumRow from "./components/AlbumRow";
import LoginButton from "./components/LoginButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./backend/Callback";
import Player from "./components/Player";
import { SpotifyContext } from "./context/SpotifyContext";
import { refreshAccessToken } from "./functions/spotifyUtils";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

const App = () => {
  const accessToken = localStorage.getItem("access_token");
  const [deviceId, setDeviceId] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "cozy";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        player.getCurrentState().then((state) => {
          setPlaybackState(state);
        });
      }, 500); // Update every 500ms
      return () => clearInterval(interval);
    }
  }, [player]);

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
            }
          }
          callback(accessToken);
        },
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with device ID:", device_id);
        setDeviceId(device_id);
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with device ID:", device_id);
        setDeviceId(device_id);
        setIsPlayerReady(true); // Ensure this is set here
      });

      player.addListener("player_state_changed", (state) => {
        console.log("Playback state changed:", state);
        setPlaybackState(state);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("Initialization Error:", message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error("Authentication Error:", message);
      });

      player.connect();
      setPlayer(player);

      player.connect();

      return () => {
        player.disconnect();
      };
    };

    window.onSpotifyWebPlaybackSDKReady = initializePlayer;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete window.onSpotifyWebPlaybackSDKReady;
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <SpotifyContext.Provider value={{ deviceId, player }}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <div
                  className="h-screen w-screen overflow-hidden bg-center bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url('/assets/images/theme-${theme}.png')`,
                  }}
                >
                  <div className="h-[90%] flex">
                    <Sidebar />
                    {accessToken ? (
                      <div className="flex-1 overflow-x-auto">
                        <AlbumRow />
                        <AlbumRow />
                      </div>
                    ) : (
                      <div>Please log in to see albums.</div>
                    )}
                  </div>
                  {!accessToken ? (
                    <LoginButton />
                  ) : (
                    isPlayerReady && <Player playbackState={playbackState} />
                  )}
                </div>
              }
            />
            <Route path="/callback" element={<Callback />} />
          </Routes>
        </Router>
      </SpotifyContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
