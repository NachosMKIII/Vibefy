//TrackList.jsx
import React, { useState, useEffect, useContext } from "react";
import { useSpotifyApi } from "../backend/Auth";
import { PlaylistContext } from "../context/PlaylistContext";
import { CirclePlus } from "lucide-react";

const TrackList = ({ albumId, setSelectedAlbum }) => {
  const makeApiCall = useSpotifyApi();
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const { addTrack } = useContext(PlaylistContext);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await makeApiCall(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`
        );
        const tracksWithAlbum = await Promise.all(
          data.items.map(async (track) => {
            const albumData = await makeApiCall(
              `https://api.spotify.com/v1/albums/${albumId}`
            );
            return {
              ...track,
              album: { name: albumData.name, images: albumData.images },
            };
          })
        );
        setTracks(tracksWithAlbum);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchTracks();
  }, [albumId, makeApiCall]);

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="track-list p-4 flex-1">
      <button
        onClick={() => setSelectedAlbum(null)}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Back to Albums
      </button>
      <CirclePlus />
      <h2 className="text-2xl font-bold mb-4">Tracks</h2>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} className="flex justify-between items-center p-2">
            <span>{track.name}</span>
            <button
              onClick={() =>
                addTrack({
                  id: track.id,
                  name: track.name,
                  album: track.album.name,
                  uri: track.uri,
                  image: track.album.images[1]?.url || "fallback-image-url.jpg",
                })
              }
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList;
