//PlaylistCustomizer.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { useSpotifyApi } from "../backend/Auth";

const PlaylistCustomizer = ({ setSidebarView, playlist }) => {
  const { theme } = useContext(ThemeContext);
  const { removeTrackFromPlaylist, deletePlaylist } =
    useContext(PlaylistContext);
  const { deviceId } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();

  const handlePlayPlaylist = async () => {
    if (!playlist.tracks.length) return;
    const uris = playlist.tracks.map((track) => track.uri);
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris }),
        }
      );
    } catch (error) {
      console.error("Error playing playlist:", error);
    }
  };

  const handleAddTracks = () => {
    // Placeholder for customization logic (e.g., switch to track selection mode)
    console.log("Entering customization mode to add tracks");
  };

  return (
    <div
      className={`playlist-customizer p-4 flex flex-col w-[20%] h-[110%] ${theme}`}
    >
      <button
        onClick={() => setSidebarView("default")}
        className="mb-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to Sidebar
      </button>
      <button
        onClick={handleAddTracks}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Tracks
      </button>
      <h2 className="text-2xl font-bold mb-4">{playlist.name}</h2>
      <div className="overflow-y-auto max-h-[300px]">
        {playlist.tracks.length === 0 ? (
          <p>No tracks in this playlist</p>
        ) : (
          playlist.tracks.map((track) => (
            <div
              key={track.id}
              className="flex justify-between items-center p-2"
            >
              <span>{track.name}</span>
              <button
                onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <button
        onClick={handlePlayPlaylist}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Play Playlist
      </button>
      <button
        onClick={() => deletePlaylist(playlist.id)}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Playlist
      </button>
    </div>
  );
};

export default PlaylistCustomizer;
