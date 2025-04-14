import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AlbumData from "./backend/AlbumData";
import LoginButton from "./components/LoginButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./backend/Callback";
import Player from "./components/Player";
import { SpotifyContext } from "./context/SpotifyContext";

const App = () => {
  const accessToken = localStorage.getItem("access_token");
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    // Function to initialize the Spotify Player
    const initializePlayer = () => {
      const player = new Spotify.Player({
        name: "My Web Player",
        getOAuthToken: (callback) => {
          const token = localStorage.getItem("access_token");
          callback(token);
        },
      });

      // Capture the device ID when the player is ready
      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      // Connect the player
      player.connect();
    };

    // Check if the SDK is already loaded
    if (window.Spotify) {
      // If loaded, initialize the player immediately
      initializePlayer();
    } else {
      // Otherwise, set the callback for when the SDK loads
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <SpotifyContext.Provider value={{ deviceId }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="h-screen bg-[url('./assets/images/theme-cozy.jpg')] bg-center bg-cover bg-no-repeat w-screen overflow-hidden">
                <div className="h-[90%] flex">
                  <Sidebar />
                  {accessToken ? (
                    <div className="flex-1 overflow-x-auto">
                      <AlbumData />
                      <AlbumData />
                    </div>
                  ) : (
                    <div>Please log in to see albums.</div>
                  )}
                </div>
                <LoginButton />
                {accessToken && <Player />}
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
