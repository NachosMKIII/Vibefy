//PlaylistManager.jsx
import React, { useState, useEffect, useContext } from "react";
import { useSpotifyApi } from "../backend/Auth";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { themeAlbums } from "./Data/themeAlbums";

const PlaylistManager = ({ setSidebarView }) => {
  const { theme } = useContext(ThemeContext);
  const { currentPlaylist, setCurrentPlaylist, removeTrack, savePlaylist } =
    useContext(PlaylistContext);
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
          setTracks(data.items);
        } catch (error) {
          setError(error.message);
        }
      };
      fetchTracks();
    } else {
      setTracks([]);
    }
  }, [selectedAlbum, makeApiCall]);

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

  const handleNameChange = (e) =>
    setCurrentPlaylist((prev) => ({ ...prev, name: e.target.value }));

  if (!currentPlaylist) return null;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className={`playlist-manager main-sidebar sidebar p-4 flex flex-col w-[20%] h-[110%] ${theme}`}
    >
      <button
        onClick={() => setSidebarView("default")}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to Sidebar
      </button>
      <h2 className="text-2xl font-bold mb-4">Create Your Playlist</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Select Theme</h3>
        <div className="flex gap-2">
          {["cozy", "rock-metal", "experimental"].map((th) => (
            <button
              key={th}
              onClick={() => handleThemeChange(th)}
              className={`px-3 py-1 rounded ${
                selectedTheme === th ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      {selectedAlbum ? (
        <div>
          <button
            onClick={() => setSelectedAlbum(null)}
            className="mb-2 px-2 py-1 bg-gray-400 text-white rounded"
          >
            Back to Albums
          </button>
          <h3 className="text-xl font-semibold mb-2">Tracks in Album</h3>
          <div
            className={`overflow-y-auto max-h-[200px] custom-scrollbar-${theme}`}
          >
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex justify-between items-center gap-2 p-1"
              >
                <div className="inline-flex">
                  <img
                    src={track.image || "fallback-image-url.jpg"}
                    alt={track.album || "Album"}
                    className="w-10 h-10 rounded"
                  />
                  <span className="truncate max-w[20ch]">{track.name}</span>
                </div>
                <button
                  onClick={() => handleAddTrack(track)}
                  className="px-2 py-1 bg-green-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">Available Albums</h3>
          <div
            className={`overflow-y-auto max-h-[200px] custom-scrollbar-${theme}`}
          >
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
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
        <h3 className="text-xl font-semibold mb-2">Your Playlist</h3>
        <input
          type="text"
          placeholder="Playlist Name"
          value={currentPlaylist.name}
          onChange={handleNameChange}
          className="mb-2 p-1 border rounded w-full text-black"
        />
        <div
          className={`overflow-y-auto max-h-[200px] custom-scrollbar-${theme}`}
        >
          {currentPlaylist.tracks.length === 0 ? (
            <p>No tracks added yet</p>
          ) : (
            currentPlaylist.tracks.map((track) => (
              <div key={track.id} className="flex items-center gap-2 p-1">
                <img
                  src={track.image || "fallback-image-url.jpg"}
                  alt={track.album || "Album"}
                  className="w-10 h-10 rounded"
                />
                <span className="truncate flex-1">{track.name}</span>
                <button
                  onClick={() => removeTrack(track.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <button
          onClick={savePlaylist}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save Playlist
        </button>
      </div>
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
        }c
      `}</style>
    </div>
  );
};

export default PlaylistManager;
