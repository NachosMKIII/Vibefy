// PlaylistCustomizer.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { useSpotifyApi } from "../backend/Auth";
import { themeAlbums } from "./Data/themeAlbums";
import { CirclePlay, Trash2 } from "lucide-react";
import "./cozy-theme/sidebar.css";

const PlaylistCustomizer = ({ setSidebarView, playlist }) => {
  const { theme } = useContext(ThemeContext);
  const { addTrackToPlaylist, removeTrackFromPlaylist, deletePlaylist } =
    useContext(PlaylistContext);
  const { deviceId, isPlayerReady } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();

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
          setTracks(
            data.items.map((track) => ({
              ...track,
              albumImage,
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

  const handleAddTracks = () => setIsAddingTracks(true);

  const handleBackToPlaylist = () => {
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
            <button
              onClick={handleBackToPlaylist}
              className="mb-2 mx-2 mt-2 px-4 py-2 rounded cursor-pointer button3"
            >
              Back to Playlist
            </button>
            <h2 className="text-2xl font-bold ml-2 mb-4">
              Add Tracks to {playlist.name}
            </h2>
            <div className="mb-4">
              <h3 className="text-lg ml-2 font-semibold">Select Theme</h3>
              <div className="flex gap-1 max-w-[280px]">
                {["cozy", "rock-metal", "experimental"].map((th) => (
                  <button
                    key={th}
                    onClick={() => handleThemeChange(th)}
                    className={`px-3 py-1 rounded cursor-pointer ml-2 ${
                      selectedTheme === th
                        ? "button2"
                        : "bg-gray-300 text-black"
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
              <h3 className="text-xl font-semibold mb-2">Tracks in Album</h3>
              <div
                className={`overflow-y-auto sidebar1 max-h-[441px] custom-scrollbar-${theme}`}
              >
                {tracks.map((track) => {
                  const isAdded = playlist.tracks.some(
                    (t) => t.id === track.id
                  );
                  return (
                    <div
                      key={track.id}
                      className="flex items-center justify-between gap-2 pt-2 p-1"
                    >
                      <div className="inline-flex gap-1">
                        <img
                          src={track.albumImage}
                          alt={`${track.name} album cover`}
                          className="w-10 h-10 rounded"
                        />
                        <span className="truncate max-w-[15ch] relative top-1">
                          {track.name}
                        </span>
                      </div>
                      {isAdded ? (
                        <span className="px-2 py-1 bg-gray-500 text-white rounded">
                          Added
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddTrack(track)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
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
                className={`overflow-y-auto max-h-[463px] custom-scrollbar-${theme}`}
              >
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700/50 cursor-pointer rounded"
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
              onClick={() => setSidebarView("default")}
              className="mb-2 mx-2 px-4 py-2 mt-2 cursor-pointer rounded button1"
            >
              Back to Sidebar
            </button>
            <button
              onClick={handleAddTracks}
              className="mb-4 px-4 mx-2 py-2 cursor-pointer rounded button2"
            >
              Add Tracks
            </button>
            <CirclePlay
              onClick={handlePlayPlaylist}
              disabled={!isPlayerReady}
              className={`w-8 h-8 my-2 cursor-pointer ${
                isPlayerReady
                  ? "text-green-500"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            />
            <Trash2
              onClick={() => deletePlaylist(playlist.id)}
              className="w-8 h-8 my-2 cursor-pointer text-red-500"
            />
            <h2 className="text-2xl font-bold mb-4">{playlist.name}</h2>
            <div
              className={`overflow-y-auto sidebar2b max-h-[423px] custom-scrollbar-${theme}`}
            >
              {playlist.tracks.length === 0 ? (
                <p>No tracks in this playlist</p>
              ) : (
                playlist.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between gap-2 pt-4 p-2"
                  >
                    <div className="inline-flex gap-1">
                      <img
                        src={track.image}
                        alt={`${track.name} album cover`}
                        className="w-10 h-10 rounded"
                      />
                      <span className="truncate">{track.name}</span>
                    </div>
                    <button
                      onClick={() =>
                        removeTrackFromPlaylist(playlist.id, track.id)
                      }
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
      <style jsx>{`
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
