//PlaylistManager.jsx
import React, { useState, useEffect, useContext } from "react";
import { useSpotifyApi } from "../backend/Auth";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { themeAlbums } from "./data/themeAlbums";
import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";
import "./experimental-theme/sidebar.css";

const PlaylistManager = ({ setSidebarView }) => {
  const { theme } = useContext(ThemeContext);
  const { currentPlaylist, setCurrentPlaylist, removeTrack, savePlaylist } =
    useContext(PlaylistContext);
  const { deviceId, isPlayerReady } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();

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
    const fetchAlbums = async () => {
      try {
        const albumIds = themeAlbums[selectedTheme] || themeAlbums.null;
        const data = await makeApiCall(
          `https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`
        );
        setAlbums(data.albums);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchAlbums();
  }, [selectedTheme, makeApiCall]);

  useEffect(() => {
    if (selectedAlbum) {
      const fetchTracks = async () => {
        try {
          const data = await makeApiCall(
            `https://api.spotify.com/v1/albums/${selectedAlbum}/tracks`
          );
          const album = albums.find((a) => a.id === selectedAlbum);
          const albumImage = album?.images[1]?.url || "fallback-image-url.jpg";
          const albumUri = album?.uri; // Get the album URI
          setTracks(
            data.items.map((track) => ({
              ...track,
              image: albumImage,
              albumUri, // Add album URI to each track
            }))
          );
        } catch (error) {
          setError(error.message);
        }
      };
      fetchTracks();
    } else {
      setTracks([]);
    }
  }, [selectedAlbum, makeApiCall, albums]);

  const handleThemeChange = (newTheme) => {
    setSelectedTheme(newTheme);
    setSelectedAlbum(null);
  };

  const handleAddTrack = (track) => {
    const album = albums.find((a) => a.id === selectedAlbum);
    const albumName = album?.name || "Unknown Album";
    const albumImage = album?.images[1]?.url || "fallback-image-url.jpg";
    setCurrentPlaylist((prev) => ({
      ...prev,
      tracks: [
        ...prev.tracks,
        {
          id: track.id,
          name: track.name,
          album: albumName,
          uri: track.uri,
          image: albumImage,
        },
      ],
    }));
  };

  const handleRemoveTrack = (trackId) => {
    removeTrack(trackId);
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

  const handleNameChange = (e) =>
    setCurrentPlaylist((prev) => ({ ...prev, name: e.target.value }));

  if (!currentPlaylist) return null;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className={`playlist-manager main-sidebar sidebar w-[20%] h-[130%] mr-5 p-2 flex-col gap-2 hidden lg:flex ${theme}`}
    >
      <div className="sidebar1 rounded hidden lg:flex flex-col">
        <button
          onClick={() => setSidebarView("default")}
          className="mb-2 mx-2 mt-2 px-4 py-2 rounded cursor-pointer button3"
        >
          Back to Sidebar
        </button>
        <h2 className="text-2xl font-bold ml-2 mb-4">Create Your Playlist</h2>

        <div className="mb-4">
          <h3 className="text-lg ml-2 font-semibold">Select Theme</h3>
          <div className="flex gap-2">
            {["cozy", "rock-metal", "experimental"].map((th) => (
              <button
                key={th}
                onClick={() => handleThemeChange(th)}
                className={`px-3 py-1 rounded cursor-pointer ml-1 mr-1 ${
                  selectedTheme === th ? "button2" : "button1"
                }`}
              >
                {th}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedAlbum ? (
        <div>
          <button
            onClick={() => setSelectedAlbum(null)}
            className="mb-2 px-2 mt-2 py-1 button3 rounded my-1"
          >
            Back to Albums
          </button>
          <h3 className="text-xl font-semibold mb-2">Tracks in Album</h3>
          <div
            className={`overflow-y-auto max-h-[250px] rounded sidebar2b custom-scrollbar-${theme}`}
          >
            {tracks.map((track) => {
              const isAdded = currentPlaylist.tracks.some(
                (t) => t.id === track.id
              );
              return (
                <div
                  key={track.id}
                  className="flex justify-between album-playlist2 items-center gap-2 p-1"
                  onDoubleClick={() =>
                    handlePlayTrackFromAlbum(track.albumUri, track.uri)
                  }
                >
                  <div className="inline-flex">
                    <img
                      src={track.image || "fallback-image-url.jpg"}
                      alt={track.album || "Album"}
                      className="w-10 h-10 rounded cursor-pointer"
                      onClick={() =>
                        handlePlayTrackFromAlbum(track.albumUri, track.uri)
                      }
                    />
                    <span
                      className="truncate max-w-[17ch] cursor-pointer"
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
                      className="px-2 py-1 add-button rounded cursor-pointer"
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
        <div>
          <h3 className="text-xl font-semibold mt-1 mb-2">Available Albums</h3>
          <div
            className={`overflow-y-auto max-h-[200px] rounded sidebar2b custom-scrollbar-${theme}`}
          >
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex items-center gap-2 p-2 album-playlist2 cursor-pointer"
                onClick={() => setSelectedAlbum(album.id)}
              >
                <img
                  src={album.images[1]?.url || "fallback-image-url.jpg"}
                  alt={album.name}
                  className="w-10 h-10 rounded"
                />
                <p>{album.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <input
          type="text"
          placeholder="Playlist Name"
          value={currentPlaylist.name}
          onChange={handleNameChange}
          className="mb-2 p-1 border rounded w-full button1"
          maxLength="25"
        />
        <button
          onClick={savePlaylist}
          className="mt-2 px-4 py-2 button2 cursor-pointer rounded"
        >
          Save Playlist
        </button>
      </div>
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

export default PlaylistManager;
