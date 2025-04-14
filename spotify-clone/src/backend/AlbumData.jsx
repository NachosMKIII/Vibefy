//AlbumData.jsx
import React, { useEffect, useState } from "react";
import AlbumRow from "../components/AlbumRow"; // Adjust path as needed
import { useSpotifyApi } from "./Auth";

const AlbumData = () => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const makeApiCall = useSpotifyApi();

  useEffect(() => {
    const fetchAlbums = async () => {
      const albumIds = [
        "4LileDrFwEUFB5UPA3AEia",
        "2yAO7HQOfO4t146QLyK26a",
        "7DxmOS2dKJgTfLLRNOP4ch",
        "7izZDSBxj6nB2PieJo6U0u",
        "4T95uimM0PQNgAkcyLTym0",
        "1K6TvnkvmnLKPhifmPb6N7",
        "63TYyeXlBYoYKNvE6rT3hI",
        "1vWOYk3hF5bgVUUUaPvYLh",
        "6EtrZFZ6FMR6fbB82oHUWi",
        "38NEzyo2N5T68j7aFetd4x",
      ].join(",");

      try {
        const data = await makeApiCall(
          `https://api.spotify.com/v1/albums?ids=${albumIds}`
        );
        setAlbums(data.albums);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [makeApiCall]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (albums.length === 0) {
    return <div>Loading album data...</div>;
  }

  return <AlbumRow title="Featured Albums" albums={albums} />;
};

export default AlbumData;
