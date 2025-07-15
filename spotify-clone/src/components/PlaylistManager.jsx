//PlaylistManager.jsx
import React, { useState, useEffect, useContext } from "react";
import { useSpotifyApi } from "../backend/Auth";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { themeAlbums } from "./Data/themeAlbums"; // Import shared themeAlbums

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

  // Fetch albums when selectedTheme changes
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

  // Fetch tracks when selectedAlbum changes
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
    setSelectedAlbum(null); // Reset album selection when theme changes
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

  const handleNameChange = (e) => {
    setCurrentPlaylist((prev) => ({ ...prev, name: e.target.value }));
  };

  if (!currentPlaylist) return null;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className={`playlist-manager p-4 flex flex-col w-[20%] h-[110%] ${theme}`}
    >
      <button
        onClick={() => setSidebarView("default")}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to Sidebar
      </button>
      <h2 className="text-2xl font-bold mb-4">Create Your Playlist</h2>

      {/* Theme Selection */}
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

      {/* Album or Track Display */}
      {selectedAlbum ? (
        <div>
          <button
            onClick={() => setSelectedAlbum(null)}
            className="mb-2 px-2 py-1 bg-gray-400 text-white rounded"
          >
            Back to Albums
          </button>
          <h3 className="text-xl font-semibold mb-2">Tracks in Album</h3>
          <div className="overflow-y-auto max-h-[200px]">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex justify-between items-center p-1"
              >
                <span>{track.name}</span>
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
          <div className="overflow-y-auto max-h-[200px]">
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedAlbum(album.id)}
              >
                <img
                  src={album.images[1]?.url || "fallback-image-url.jpg"}
                  alt={album.name}
                  className="w-8 h-8 rounded"
                />
                <p>{album.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Playlist */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Your Playlist</h3>
        <input
          type="text"
          placeholder="Playlist Name"
          value={currentPlaylist.name}
          onChange={handleNameChange}
          className="mb-2 p-1 border rounded w-full text-black"
        />
        <div className="overflow-y-auto max-h-[150px]">
          {currentPlaylist.tracks.length === 0 ? (
            <p>No tracks added yet</p>
          ) : (
            currentPlaylist.tracks.map((track) => (
              <div
                key={track.id}
                className="flex justify-between items-center p-1"
              >
                <span>{track.name}</span>
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
    </div>
  );
};

export default PlaylistManager;
