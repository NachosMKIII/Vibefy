//App.jsx
import React, { useState, useEffect, useRef } from "react";
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
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "experimental";
  });
  const playerRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

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

      playerRef.current = player;

      player.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with device ID:", device_id);
        setDeviceId(device_id);
        pollIntervalRef.current = setInterval(async () => {
          const state = await player.getCurrentState();
          if (state) {
            console.log("Polled state position:", state.position);
            setPlaybackState(state);
          } else {
            console.log("Polled state is null");
          }
        }, 100);
      });

      player.addListener("player_state_changed", (state) => {
        console.log("Playback state changed:", state?.position);
        setPlaybackState(state);
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error("Initialization Error:", message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error("Authentication Error:", message);
      });

      player.connect();
    };

    window.onSpotifyWebPlaybackSDKReady = initializePlayer;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete window.onSpotifyWebPlaybackSDKReady;
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <SpotifyContext.Provider value={{ deviceId }}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <div
                  className="h-screen z-50 w-screen overflow-hidden bg-center bg-cover bg-no-repeat"
                  style={{
                    backgroundImage: `url('/assets/images/theme-${theme}.png')`,
                  }}
                >
                  <div className="h-[100%] flex">
                    <Sidebar />
                    {accessToken ? (
                      <div className="flex-1 h-[75%] overflow-x-auto ml-5">
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
                    <div className=" w-[67.5%] fixed bottom-0 left-117 ml-5">
                      <Player playbackState={playbackState} />
                    </div>
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
