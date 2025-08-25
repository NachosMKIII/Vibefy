//TrackList.jsx
import React, { useState, useEffect, useContext } from "react";
import { useSpotifyApi } from "../Auth/Auth";
import { PlaylistContext } from "../context/PlaylistContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { CirclePlay } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";
import "./experimental-theme/sidebar.css";

const TrackList = ({ albumId, setSelectedAlbum }) => {
  const makeApiCall = useSpotifyApi();
  const [tracks, setTracks] = useState([]);
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState(null);
  const { addTrack } = useContext(PlaylistContext);
  const { deviceId, isPlayerReady } = useContext(SpotifyContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchAlbumAndTracks = async () => {
      try {
        const albumData = await makeApiCall(
          `https://api.spotify.com/v1/albums/${albumId}`
        );
        setAlbum(albumData);

        const tracksData = await makeApiCall(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`
        );
        const tracksWithAlbum = tracksData.items.map((track, index) => ({
          ...track,
          album: {
            name: albumData.name,
            images: albumData.images,
            uri: albumData.uri,
          },
          position: index, // Store track position for offset
        }));
        setTracks(tracksWithAlbum);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchAlbumAndTracks();
  }, [albumId, makeApiCall]);

  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayAlbum = async () => {
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
          body: JSON.stringify({ context_uri: album.uri }),
        }
      );
    } catch (error) {
      console.error("Error playing album:", error);
    }
  };

  const handlePlayTrackFromAlbum = async (albumUri, trackPosition) => {
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
            offset: { position: trackPosition },
          }),
        }
      );
    } catch (error) {
      console.error("Error playing track from album:", error);
    }
  };

  if (error) return <div className={`text-white ${theme}`}>Error: {error}</div>;
  if (!album) return <div className={`${theme}`}>Loading...</div>;

  return (
    <div
      className={`track-list main-sidebar sidebar rounded p-4 flex-1 ${theme}`}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setSelectedAlbum(null)}
          className="px-4 py-2 button3 rounded"
        >
          Back to Albums
        </button>
        <CirclePlay
          onClick={handlePlayAlbum}
          disabled={!isPlayerReady}
          className={`w-8 h-8 cursor-pointer p-1 rounded-full ${
            isPlayerReady ? "play-icon" : "text-gray-400 cursor-not-allowed"
          }`}
        />
      </div>
      <h2 className="text-2xl font-bold mb-4">{album.name}</h2>
      <div
        className={`overflow-y-auto max-h-[480px] custom-scrollbar-${theme}`}
      >
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center track-container album-playlist2 justify-between p-2 border-b cursor-pointer"
            onClick={() => handlePlayTrackFromAlbum(album.uri, track.position)}
          >
            <div className="inline-flex gap-2">
              <img
                src={track.album.images[1]?.url || "fallback-image-url.jpg"}
                alt={track.name}
                className="w-10 h-10 rounded"
              />
              <span className="truncate max-w-[70ch]">{track.name}</span>
            </div>
            <span className="text-sm text-white w-12">
              {formatTime(track.duration_ms)}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        .custom-scrollbar-${theme}::-webkit-scrollbar {
          width: 12px;
        }
        .custom-scrollbar-${theme}::-webkit-scrollbar-track {
          background: ${
            theme === "cozy"
              ? "#92400e"
              : theme === "rock-metal"
              ? "#1e293b"
              : "#581c87"
          };
          border-radius: 6px;
        }
        .custom-scrollbar-${theme}::-webkit-scrollbar-thumb {
          background: ${
            theme === "cozy"
              ? "linear-gradient(180deg, #22c55e, #16a34a)"
              : theme === "rock-metal"
              ? "linear-gradient(180deg, #0ea5e9, #0284c7)"
              : "linear-gradient(180deg, #eab308, #ca8a04)"
          };
          border-radius: 6px;
          border: 2px solid ${
            theme === "cozy"
              ? "#92400e"
              : theme === "rock-metal"
              ? "#1e293b"
              : "#581c87"
          };
        }
        .custom-scrollbar-${theme}::-webkit-scrollbar-thumb:hover {
          background: ${
            theme === "cozy"
              ? "linear-gradient(180deg, #4ade80, #22c55e)"
              : theme === "rock-metal"
              ? "linear-gradient(180deg, #38bdf8, #0ea5e9)"
              : "linear-gradient(180deg, #fbbf24, #eab308)"
          };
        }
      `}</style>
    </div>
  );
};

export default TrackList;
