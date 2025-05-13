//App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AlbumRow from "./components/AlbumRow";
import LoginButton from "./components/LoginButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./backend/Callback";
import Player from "./components/Player";
import { SpotifyContext } from "./context/SpotifyContext";

const App = () => {
  const accessToken = localStorage.getItem("access_token");
  const [deviceId, setDeviceId] = useState(null);
  const [playbackState, setPlaybackState] = useState(null); // Add state for playbackState

  useEffect(() => {
    const initializePlayer = () => {
      const player = new Spotify.Player({
        name: "My Web Player",
        getOAuthToken: (callback) => {
          const token = localStorage.getItem("access_token");
          callback(token);
        },
      });

      // Capture device ID when player is ready
      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      // Update playback state when it changes
      player.addListener("player_state_changed", (state) => {
        setPlaybackState(state);
      });

      // Connect the player
      player.connect();

      // Clean up on unmount
      return () => {
        player.disconnect();
      };
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }
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
                <LoginButton />
                {accessToken && (
                  <Player theme="cozy" playbackState={playbackState} />
                )}
              </div>
            }
          />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </Router>
    </SpotifyContext.Provider>
  );
};

export default App; //end of App.jsx
