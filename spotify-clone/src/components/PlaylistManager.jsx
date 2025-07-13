//PlaylistManager.jsx
import React, { useState, useEffect, useContext } from "react";
import { useSpotifyApi } from "../backend/Auth";
import { ThemeContext } from "../context/ThemeContext";
import { PlaylistContext } from "../context/PlaylistContext";
import { SpotifyContext } from "../context/SpotifyContext";

const PlaylistManager = ({ setSidebarView }) => {
  const { theme } = useContext(ThemeContext);
  const { playlist, addTrack, removeTrack } = useContext(PlaylistContext);
  const { deviceId, isPlayerReady } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  const themeAlbums = {
    cozy: [
      "7DxmOS2dKJgTfLLRNOP4ch",
      "1K6TvnkvmnLKPhifmPb6N7",
      "6EtrZFZ6FMR6fbB82oHUWi",
      "38NEzyo2N5T68j7aFetd4x",
      "0AL7olZ75pi55q9p1eHaD8",
      "1aFyAtSRxLNzSTGwHMRvWj",
      "0vhRTvVCv9O5orRMgFjxT1",
      "02UhY4AQiAry5S2ZpgEKIt",
      "2kz6FGzMkZUyGZPywlkcOu",
      "60EzsIzS77S9MWHT0Tm37s",
    ],
    "rock-metal": [
      "2kcJ3TxBhSwmki0QWFXUz8",
      "08pnia1NUFsyIWfhE9sZz1",
      "1QJmLRcuIMMjZ49elafR3K",
      "1XkGORuUX2QGOEIL4EbJKm",
      "1gsoIHeBan6QywhysNgApK",
      "5sMSJ6uAozdrqFELMwl3NU",
      "1j57Q5ntVi7crpibb0h4sv",
      "6a5n1Frj3nxGcyTqT1xfrg",
      "5XgUtV3205kTcgoSLNf8ix",
      "6DJwvB2iCquvxxrXRW0cFz",
      "3HFbH1loOUbqCyPsLuHLLh",
      "7izZDSBxj6nB2PieJo6U0u",
      "7rSZXXHHvIhF4yUFdaOCy9",
    ],
    experimental: [
      "4LileDrFwEUFB5UPA3AEia",
      "2yAO7HQOfO4t146QLyK26a",
      "7izZDSBxj6nB2PieJo6U0u",
      "4T95uimM0PQNgAkcyLTym0",
      "63TYyeXlBYoYKNvE6rT3hI",
      "1vWOYk3hF5bgVUUUaPvYLh",
      "2TN3NIEBmAOGWmvP96DFs5",
      "6wRDKCpKw3ap6dhkpdXNIN",
      "0VDB8LxXpOS8qQeiab3LqG",
      "7GjVWG39IOj4viyWplJV4H",
      "3ddMQ2PZjiD8Zxm0lu92rb",
      "1WwiyWxa40PKucRxIKlEVM",
    ],
    null: [
      "7DxmOS2dKJgTfLLRNOP4ch",
      "1K6TvnkvmnLKPhifmPb6N7",
      "6EtrZFZ6FMR6fbB82oHUWi",
      "38NEzyo2N5T68j7aFetd4x",
      "0AL7olZ75pi55q9p1eHaD8",
      "1aFyAtSRxLNzSTGwHMRvWj",
      "0vhRTvVCv9O5orRMgFjxT1",
      "02UhY4AQiAry5S2ZpgEKIt",
      "2kz6FGzMkZUyGZPywlkcOu",
      "60EzsIzS77S9MWHT0Tm37s",
    ],
  };

  useEffect(() => {
    const albumIds = themeAlbums[theme] || themeAlbums.null;
    const fetchAlbums = async () => {
      try {
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
  }, [theme, makeApiCall]);

  useEffect(() => {
    setSelectedAlbum(null);
    setTracks([]);
  }, [theme]);

  const fetchTracks = async (albumId) => {
    setIsLoadingTracks(true);
    try {
      const data = await makeApiCall(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`
      );
      setTracks(data.items);
      setSelectedAlbum(albumId);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching tracks:", error);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const handleAddTrack = (track) => {
    const albumName =
      albums.find((album) => album.id === selectedAlbum)?.name ||
      "Unknown Album";
    addTrack({
      id: track.id,
      name: track.name,
      album: albumName,
      uri: track.uri,
    });
  };

  const handlePlayPlaylist = async () => {
    if (!isPlayerReady || !deviceId || playlist.length === 0) {
      console.error(
        "Player is not ready, no device ID, or no tracks in playlist"
      );
      return;
    }
    const uris = playlist.map((track) => track.uri);
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: uris,
          }),
        }
      );
    } catch (error) {
      console.error("Error playing playlist:", error);
    }
  };

  if (error) {
    return <div className={`text-white ${theme}`}>Error: {error}</div>;
  }

  if (albums.length === 0) {
    return <div className={`text-white ${theme}`}>Loading albums...</div>;
  }

  return (
    <div
      className={`playlist-manager p-4 flex flex-col w-[20%] h-[110%] bg-white ${theme}`}
    >
      <button
        onClick={() => setSidebarView("default")}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to Sidebar
      </button>
      <h2 className="text-2xl font-bold mb-4">Manage Your Playlist</h2>
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Available Albums</h3>
          <div className="overflow-y-auto max-h-[300px]">
            {albums.map((album) => (
              <div
                key={album.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-700/50 cursor-pointer rounded"
                onClick={() => fetchTracks(album.id)}
              >
                <img
                  src={album.images[1]?.url || "fallback-image-url.jpg"}
                  alt={album.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-medium">{album.name}</p>
                  <p className="text-sm text-gray-400">
                    {album.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedAlbum && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Tracks</h3>
            {isLoadingTracks ? (
              <p>Loading tracks...</p>
            ) : (
              <div className="overflow-y-auto max-h-[300px]">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded"
                  >
                    <div>
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-gray-400">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddTrack(track)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add to Playlist
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div>
          <h3 className="text-xl font-semibold mb-2">Your Playlist</h3>
          <div className="overflow-y-auto max-h-[300px]">
            {playlist.length === 0 ? (
              <p>No tracks in playlist</p>
            ) : (
              playlist.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded"
                >
                  <div>
                    <p className="font-medium">{track.name}</p>
                    <p className="text-sm text-gray-400">{track.album}</p>
                  </div>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
          {playlist.length > 0 && (
            <button
              onClick={handlePlayPlaylist}
              disabled={!isPlayerReady}
              className={`mt-4 px-4 py-2 text-white rounded hover:bg-green-600 ${
                isPlayerReady
                  ? "bg-green-500"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Play Playlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistManager;
