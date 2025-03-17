import React, { useEffect, useState } from "react";
import AlbumRow from "../components/AlbumRow";

const AlbumData = () => {
  const [albums, setAlbums] = useState([]);

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
        const response = await fetch(
          `https://api.spotify.com/v1/albums?ids=${albumIds}`,
          {
            headers: {
              Authorization:
                "Bearer BQAig6szS4Xv9u27L1uyuQHJ-34V7dFsYCnVNZ4Txg8dV54TqwsxWTw3vm7OpbznnKt-H5VNhzbSTWZk7zjrxPgzrrmoEqCaOGa8BeDGiiGyfVKjFFT1uTAerKT-4Hp4ZlwSmqL6_j0",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAlbums(data.albums);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  if (albums.length === 0) {
    return <div>Loading album data...</div>;
  }

  return (
    <div className="flex flex-row gap-x-7 overflow-hidden">
      {albums.map((album) => (
        <AlbumRow key={album.id} album={album} />
      ))}
    </div>
  );
};

export default AlbumData;
