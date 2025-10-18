// src/app/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AlbumRow from "./components/AlbumRow";
import AlbumRow2 from "./components/AlbumRow2";
import LoginButton from "./components/LoginButton";
import Player from "./components/Player";
import { SpotifyContext } from "./context/SpotifyContext";
import { PlaylistContext } from "./context/PlaylistContext";
import PlaylistManager from "./components/PlaylistManager";
import PlaylistList from "./components/PlaylistList";
import PlaylistCustomizer from "./components/PlaylistCustomizer";
import TrackList from "./components/TrackList";
import { ThemeContext } from "./context/ThemeContext";
//CSS
import "./components/cozy-theme/page.css";
import "./components/metal-rock-theme/page.css";
import "./components/experimental-theme/page.css";

const Page = () => {
  const [accessToken, setAccessToken] = useState(null); // Store token in state
  const [deviceId, setDeviceId] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "cozy";
  });
  const [sidebarView, setSidebarView] = useState("default");
  const [playlists, setPlaylists] = useState(() => {
    const savedPlaylists = localStorage.getItem("playlists");
    return savedPlaylists ? JSON.parse(savedPlaylists) : [];
  });
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/get-token");
        const data = await response.json();
        if (data.access_token) {
          setAccessToken(data.access_token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);

  const addTrackToCurrent = (track) => {
    if (currentPlaylist) {
      setCurrentPlaylist((prev) => ({
        ...prev,
        tracks: [...prev.tracks, track],
      }));
    }
  };

  const removeTrackFromCurrent = (trackId) => {
    if (currentPlaylist) {
      setCurrentPlaylist((prev) => ({
        ...prev,
        tracks: prev.tracks.filter((t) => t.id !== trackId),
      }));
    }
  };

  const addTrackToPlaylist = (playlistId, track) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((p) =>
        p.id === playlistId ? { ...p, tracks: [...p.tracks, track] } : p
      )
    );
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((p) =>
        p.id === playlistId
          ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
          : p
      )
    );
  };

  const deletePlaylist = (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((p) => p.id === playlistId)
      );
      setSidebarView("default");
      setSelectedPlaylistId(null);
    }
  };

  const startNewPlaylist = () => {
    setCurrentPlaylist({ id: Date.now(), name: "", tracks: [] });
    setSidebarView("playlistManager");
  };

  const savePlaylist = () => {
    if (
      currentPlaylist &&
      currentPlaylist.name &&
      currentPlaylist.tracks.length > 0
    ) {
      setPlaylists((prev) => [...prev, currentPlaylist]);
      setCurrentPlaylist(null);
      setSidebarView("default");
    } else {
      alert("Provide a name and add at least one track.");
    }
  };

  const selectPlaylist = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setSidebarView("playlistCustomizer");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        player.getCurrentState().then((state) => {
          setPlaybackState(state);
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [player]);

  useEffect(() => {
    const initializePlayer = () => {
      const player = new Spotify.Player({
        name: "My Web Player",
        getOAuthToken: async (callback) => {
          try {
            const response = await fetch("/api/get-token");
            const data = await response.json();
            if (data.access_token) {
              callback(data.access_token);
            } else {
              console.error("No token in get-token response:", data);
              callback(null);
            }
          } catch (error) {
            console.error("Failed to fetch access token:", error);
            callback(null);
          }
        },
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Player is ready with Device ID:", device_id);
        setDeviceId(device_id);
        setIsPlayerReady(true);
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

      player.connect().then((success) => {
        if (success) {
          console.log("Player connected successfully");
        } else {
          console.error("Player failed to connect");
        }
      });

      setPlayer(player);

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
      <SpotifyContext.Provider value={{ deviceId, player, isPlayerReady }}>
        <PlaylistContext.Provider
          value={{
            playlists,
            currentPlaylist,
            setCurrentPlaylist,
            addTrack: addTrackToCurrent,
            addTrackToPlaylist,
            removeTrack: removeTrackFromCurrent,
            removeTrackFromPlaylist,
            savePlaylist,
            selectPlaylist,
            deletePlaylist,
          }}
        >
          <div
            className={`h-screen w-screen main-container overflow-hidden z-2 ${theme}`}
          >
            <div
              className={`absolute bg-image inset-0 -z-3 bg-cover bg-center`}
              style={{
                backgroundImage: `url('/assets/images/theme-${theme}.png')`,
              }}
            />
            <div
              className={`absolute color-container ${theme} inset-0 -z-4 bg-cover bg-center`}
            />
            <div className="h-[90%] flex">
              {sidebarView === "default" ? (
                <Sidebar
                  setSidebarView={setSidebarView}
                  startNewPlaylist={startNewPlaylist}
                />
              ) : sidebarView === "playlistManager" ? (
                <PlaylistManager setSidebarView={setSidebarView} />
              ) : sidebarView === "playlistCustomizer" && selectedPlaylistId ? (
                <PlaylistCustomizer
                  setSidebarView={setSidebarView}
                  playlist={playlists.find((p) => p.id === selectedPlaylistId)}
                />
              ) : (
                <PlaylistList
                  setSidebarView={setSidebarView}
                  startNewPlaylist={startNewPlaylist}
                />
              )}
              {accessToken ? (
                <div className="flex-1 overflow-x-auto">
                  {selectedAlbum ? (
                    <TrackList
                      albumId={selectedAlbum}
                      setSelectedAlbum={setSelectedAlbum}
                    />
                  ) : (
                    <>
                      <AlbumRow setSelectedAlbum={setSelectedAlbum} />
                      <AlbumRow2 setSelectedAlbum={setSelectedAlbum} />
                    </>
                  )}
                </div>
              ) : (
                <div>
                  <p className="relative top-2 rounded-full py-2 px-10 bg-black text-white">
                    Log in to see albums
                  </p>
                </div>
              )}
            </div>
            {!accessToken ? (
              <div>
                <LoginButton />
                <Player
                  playbackState={playbackState}
                  isLoggedIn={!!accessToken}
                />
              </div>
            ) : (
              isPlayerReady && (
                <Player
                  playbackState={playbackState}
                  isLoggedIn={!!accessToken}
                />
              )
            )}
          </div>
        </PlaylistContext.Provider>
      </SpotifyContext.Provider>
    </ThemeContext.Provider>
  );
};
export default Page;
