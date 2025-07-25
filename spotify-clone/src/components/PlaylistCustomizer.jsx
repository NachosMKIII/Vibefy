// PlaylistCustomizer.jsx
import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { useSpotifyApi } from "../backend/Auth";
import { themeAlbums } from "./Data/themeAlbums";
import { CirclePlay, Trash2 } from "lucide-react";
//import "./cozy-theme/sidebar.css";

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

  // Fetch albums when in add tracks mode and theme changes
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
    console.log("isAddingTracks changed:", isAddingTracks);
  }, [isAddingTracks]);

  // Fetch tracks when an album is selected
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
          console.error("Error fetching tracks:", error);
        }
      };
      fetchTracks();
    } else {
      setTracks([]);
    }
  }, [selectedAlbum, makeApiCall]);

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris }),
        }
      );
    } catch (error) {
      console.error("Error playing playlist:", error);
    }
  };

  const handleAddTracks = () => {
    setIsAddingTracks(true);
  };

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
                        ? "button2 "
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
                className="mb-2 mt-4 px-2 py-1 rounded button1"
              >
                Back to Albums
              </button>
              <h3 className="text-xl font-semibold mb-2">Tracks in Album</h3>
              <div className="overflow-y-auto sidebar1 max-h-[441px]">
                {tracks.map((track) => {
                  const isAdded = playlist.tracks.some(
                    (t) => t.id === track.id
                  );
                  return (
                    <div
                      key={track.id}
                      className="flex justify-between items-center p-1"
                    >
                      <span className="truncate">{track.name}</span>
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
              <div className="overflow-y-auto max-h-[463px]">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-700/50 cursor-pointer rounded"
                    onClick={() => setSelectedAlbum(album.id)}
                  >
                    <img
                      src={album.images[1]?.url || "fallback-image-url.jpg"}
                      alt={album.name}
                      className="w-8 h-8 rounded"
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
            <div className="overflow-y-auto sidebar2b max-h-[423px]">
              {playlist.tracks.length === 0 ? (
                <p>No tracks in this playlist</p>
              ) : (
                playlist.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex justify-between items-center p-2"
                  >
                    <span className="truncate">{track.name}</span>
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
    </div>
  );
};

export default PlaylistCustomizer;
