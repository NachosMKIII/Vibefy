// src/app/components/PlaylistCustomizer.jsx
"use client";
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { useSpotifyApi } from "../Auth/Auth";
import { themeAlbums } from "./data/themeAlbums";
import { CirclePlay, Trash2, ArrowBigLeftDash } from "lucide-react";
import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";
import "./experimental-theme/sidebar.css";

const PlaylistCustomizer = ({ setSidebarView, playlist }) => {
  const { theme } = useContext(ThemeContext);
  const { deviceId, isPlayerReady } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();
  const { addTrackToPlaylist, removeTrackFromPlaylist, deletePlaylist } =
    useContext(PlaylistContext);
  const [isAddingTracks, setIsAddingTracks] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);

  const scrollbarConfig = {
    cozy: {
      trackColor: "#92400e",
      thumbColor: "linear-gradient(180deg, #22c55e, #16a34a)",
      thumbHover: "linear-gradient(180deg, #4ade80, #22c55e)",
      thumbActive: "linear-gradient(180deg, #86efac, #4ade80)",
    },
    "rock-metal": {
      trackColor: "#1e293b",
      thumbColor: "linear-gradient(180deg, #0ea5e9, #0284c7)",
      thumbHover: "linear-gradient(180deg, #38bdf8, #0ea5e9)",
      thumbActive: "linear-gradient(180deg, #7dd3fc, #38bdf8)",
    },
    experimental: {
      trackColor: "#581c87",
      thumbColor: "linear-gradient(180deg, #eab308, #ca8a04)",
      thumbHover: "linear-gradient(180deg, #fbbf24, #eab308)",
      thumbActive: "linear-gradient(180deg, #fde047, #fbbf24)",
    },
    null: {
      trackColor: "#92400e",
      thumbColor: "linear-gradient(180deg, #22c55e, #16a34a)",
      thumbHover: "linear-gradient(180deg, #4ade80, #22c55e)",
      thumbActive: "linear-gradient(180deg, #86efac, #4ade80)",
    },
  };

  useEffect(() => {
    if (isAddingTracks) {
      const fetchAlbums = async () => {
        try {
          const albumIds = themeAlbums[selectedTheme] || themeAlbums.null;
          const data = await makeApiCall(
            `https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`
          );
          setAlbums(data.albums);
        } catch (error) {
          setError(error.message);
          console.error("Error fetching albums:", error);
        }
      };
      fetchAlbums();
    }
  }, [isAddingTracks, selectedTheme, makeApiCall]);

  useEffect(() => {
    if (selectedAlbum) {
      const fetchTracks = async () => {
        try {
          const data = await makeApiCall(
            `https://api.spotify.com/v1/albums/${selectedAlbum}/tracks`
          );
          const album = albums.find((a) => a.id === selectedAlbum);
          const albumImage = album?.images[1]?.url || "fallback-image-url.jpg";
          const albumUri = album?.uri;
          setTracks(
            data.items.map((track) => ({
              ...track,
              image: albumImage,
              albumUri,
            }))
          );
        } catch (error) {
          setError(error.message);
          console.error("Error fetching tracks:", error);
        }
      };
      fetchTracks();
    } else {
      setTracks([]);
    }
  }, [selectedAlbum, makeApiCall, albums]);

  const handlePlayPlaylist = async () => {
    if (!isPlayerReady || !deviceId || !playlist.tracks.length) {
      console.error("Player not ready, no device ID, or empty playlist");
      return;
    }
    const uris = playlist.tracks.map((track) => track.uri);
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uris }),
        }
      );
    } catch (error) {
      console.error("Error playing playlist:", error);
    }
  };

  const handlePlayTrackFromAlbum = async (albumUri, trackUri) => {
    if (!isPlayerReady || !deviceId) {
      console.error("Player not ready or no device ID");
      return;
    }
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            context_uri: albumUri,
            offset: { uri: trackUri },
          }),
        }
      );
    } catch (error) {
      console.error("Error playing track from album:", error);
    }
  };

  const handlePlayTrackFromPlaylist = async (startIndex) => {
    if (!isPlayerReady || !deviceId) {
      console.error("Player not ready or no device ID");
      return;
    }
    const uris = playlist.tracks.map((track) => track.uri);
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uris,
            offset: { position: startIndex },
          }),
        }
      );
    } catch (error) {
      console.error("Error playing track from playlist:", error);
    }
  };

  const handleAddTracks = () => {
    console.log("Switching to add tracks view");
    setIsAddingTracks(true);
  };

  const handleBackToPlaylist = () => {
    console.log("Returning to playlist view, playlist ID:", playlist.id);
    setIsAddingTracks(false);
    setSelectedAlbum(null);
  };

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    setSelectedAlbum(null);
  };

  const handleAddTrack = (track) => {
    const album = albums.find((a) => a.id === selectedAlbum);
    const albumName = album?.name || "Unknown Album";
    const albumImage = album?.images[1]?.url || "fallback-image-url.jpg";
    addTrackToPlaylist(playlist.id, {
      id: track.id,
      name: track.name,
      album: albumName,
      uri: track.uri,
      image: albumImage,
    });
    console.log("Added track to playlist:", track.name);
  };

  const handleRemoveTrack = (trackId) => {
    removeTrackFromPlaylist(playlist.id, trackId);
    console.log("Removed track from playlist, ID:", trackId);
  };

  if (!playlist) return null;
  if (error) return <div className={`text-white ${theme}`}>Error: {error}</div>;

  return (
    <div
      className={`playlist-customizer main-sidebar sidebar w-[20%] h-[130%] mr-5 p-2 flex-col gap-2 hidden lg:flex ${theme}`}
    >
      {isAddingTracks ? (
        <div className="hidden lg:flex flex-col">
          <div className="sidebar1 rounded hidden lg:flex flex-col">
            <ArrowBigLeftDash
              onClick={handleBackToPlaylist} // Goes back to playlist tracks
              className="mb-2 ml-3 mt-2 w-8 h-8 button1 rounded cursor-pointer p-1"
            />
            <h2 className="text-xl font-bold ml-2 mb-4">
              Add Tracks to {playlist.name}
            </h2>
            <div className="mb-4">
              <h3 className="text-lg ml-2 font-semibold">Select Theme</h3>
              <div className="flex gap-1 max-w-[280px]">
                {["cozy", "rock-metal", "experimental"].map((th) => (
                  <button
                    key={th}
                    onClick={() => handleThemeChange(th)}
                    className={`px-3 py-1 rounded cursor-pointer ml-1 mr-1 ${
                      selectedTheme === th ? "button2" : "button1"
                    }`}
                  >
                    {th.charAt(0).toUpperCase() + th.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {selectedAlbum ? (
            <div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="mb-2 mt-4 px-2 py-1 rounded cursor-pointer button1"
              >
                Back to Albums
              </button>
              <h3 className="text-xl font-semibold mb-2">Tracks</h3>
              <div
                className={`overflow-y-auto sidebar1 max-h-[422px] rounded custom-scrollbar-${theme}`}
              >
                {tracks.map((track) => {
                  const isAdded = playlist.tracks.some(
                    (t) => t.id === track.id
                  );
                  return (
                    <div
                      key={track.id}
                      className="flex items-center album-playlist2 justify-between gap-2 pt-2 p-1"
                      onDoubleClick={() =>
                        handlePlayTrackFromAlbum(track.albumUri, track.uri)
                      }
                    >
                      <div className="inline-flex gap-1">
                        <img
                          src={track.image}
                          alt={`${track.name} album cover`}
                          className="w-10 h-10 rounded cursor-pointer"
                          onClick={() =>
                            handlePlayTrackFromAlbum(track.albumUri, track.uri)
                          }
                        />
                        <span
                          className="truncate max-w-[15ch] relative top-1 cursor-pointer"
                          onClick={() =>
                            handlePlayTrackFromAlbum(track.albumUri, track.uri)
                          }
                        >
                          {track.name}
                        </span>
                      </div>
                      {isAdded ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTrack(track.id);
                          }}
                          className="px-2 py-1 button2 rounded cursor-pointer"
                        >
                          Added
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddTrack(track);
                          }}
                          className="px-2 py-1 cursor-pointer rounded add-button"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="sidebar2b rounded mt-2">
              <h3 className="text-xl font-semibold mt-1 ml-2 mb-2">
                Available Albums
              </h3>
              <div
                className={`overflow-y-auto max-h-[480px] custom-scrollbar-${theme}`}
              >
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="flex items-center gap-2 p-2 album-playlist2 cursor-pointer rounded"
                    onClick={() => setSelectedAlbum(album.id)}
                  >
                    <img
                      src={album.images[1]?.url || "fallback-image-url.jpg"}
                      alt={album.name}
                      className="w-10 h-10 rounded"
                    />
                    <p className="truncate">{album.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden lg:flex flex-col">
          <div className="sidebar1 hidden lg:flex flex-col mt-10 rounded">
            <button
              onClick={handleAddTracks}
              className="mb-4 px-4 mx-2 py-2 ml-2 cursor-pointer rounded button2 mt-2"
            >
              Add Tracks
            </button>
            <ArrowBigLeftDash
              onClick={() => setSidebarView("playlistList")} // Goes to playlist list
              className="mb-2 ml-3 mt-2 w-8 h-8 button1 rounded cursor-pointer p-1"
            />
            <CirclePlay
              onClick={handlePlayPlaylist}
              disabled={!isPlayerReady}
              className={`w-8 h-8 my-2 cursor-pointer ml-3 p-1 rounded-full ${
                isPlayerReady ? "play-icon" : "text-gray-400 cursor-not-allowed"
              }`}
            />
            <Trash2
              onClick={() => deletePlaylist(playlist.id)}
              className="w-8 h-8 my-2 cursor-pointer remove-button rounded-full p-1 ml-3"
            />
            <h2 className="text-xl ml-1 font-bold mb-4">{playlist.name}</h2>
            <div
              className={`overflow-y-auto sidebar2b max-h-[430px] custom-scrollbar-${theme}`}
            >
              {playlist.tracks.length === 0 ? (
                <p>No tracks in this playlist</p>
              ) : (
                playlist.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center track-container justify-between pt-2 p-1"
                    onDoubleClick={() => handlePlayTrackFromPlaylist(index)}
                  >
                    <div className="inline-flex gap-1">
                      <img
                        src={track.image}
                        alt={`${track.name} album cover`}
                        className="w-10 h-10 rounded cursor-pointer"
                        onClick={() => handlePlayTrackFromPlaylist(index)}
                      />
                      <span
                        className="truncate max-w-[16ch] cursor-pointer"
                        onClick={() => handlePlayTrackFromPlaylist(index)}
                      >
                        {track.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrackFromPlaylist(playlist.id, track.id);
                      }}
                      className="px-2 py-1 relative top-1 cursor-pointer remove-button"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar-cozy::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar-cozy::-webkit-scrollbar-track {
          background: ${scrollbarConfig.cozy.trackColor};
          border-radius: 6px;
        }
        .custom-scrollbar-cozy::-webkit-scrollbar-thumb {
          background: ${scrollbarConfig.cozy.thumbColor};
          border-radius: 6px;
          border: 2px solid ${scrollbarConfig.cozy.trackColor};
        }
        .custom-scrollbar-cozy::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarConfig.cozy.thumbHover};
        }
        .custom-scrollbar-cozy::-webkit-scrollbar-thumb:active {
          background: ${scrollbarConfig.cozy.thumbActive};
        }

        .custom-scrollbar-rock-metal::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar-rock-metal::-webkit-scrollbar-track {
          background: ${scrollbarConfig["rock-metal"].trackColor};
          border-radius: 6px;
        }
        .custom-scrollbar-rock-metal::-webkit-scrollbar-thumb {
          background: ${scrollbarConfig["rock-metal"].thumbColor};
          border-radius: 6px;
          border: 2px solid ${scrollbarConfig["rock-metal"].trackColor};
        }
        .custom-scrollbar-rock-metal::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarConfig["rock-metal"].thumbHover};
        }
        .custom-scrollbar-rock-metal::-webkit-scrollbar-thumb:active {
          background: ${scrollbarConfig["rock-metal"].thumbActive};
        }

        .custom-scrollbar-experimental::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar-experimental::-webkit-scrollbar-track {
          background: ${scrollbarConfig.experimental.trackColor};
          border-radius: 6px;
        }
        .custom-scrollbar-experimental::-webkit-scrollbar-thumb {
          background: ${scrollbarConfig.experimental.thumbColor};
          border-radius: 6px;
          border: 2px solid ${scrollbarConfig.experimental.trackColor};
        }
        .custom-scrollbar-experimental::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarConfig.experimental.thumbHover};
        }
        .custom-scrollbar-experimental::-webkit-scrollbar-thumb:active {
          background: ${scrollbarConfig.experimental.thumbActive};
        }

        .custom-scrollbar-null::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar-null::-webkit-scrollbar-track {
          background: ${scrollbarConfig.null.trackColor};
          border-radius: 6px;
        }
        .custom-scrollbar-null::-webkit-scrollbar-thumb {
          background: ${scrollbarConfig.null.thumbColor};
          border-radius: 6px;
          border: 2px solid ${scrollbarConfig.null.trackColor};
        }
        .custom-scrollbar-null::-webkit-scrollbar-thumb:hover {
          background: ${scrollbarConfig.null.thumbHover};
        }
        .custom-scrollbar-null::-webkit-scrollbar-thumb:active {
          background: ${scrollbarConfig.null.thumbActive};
        }
      `}</style>
    </div>
  );
};

export default PlaylistCustomizer;
