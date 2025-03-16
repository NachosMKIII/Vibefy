import React, { useEffect, useState } from "react";
import AlbumColumn from "../components/AlbumColumn";

const AlbumData = () => {
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    fetch("https://api.spotify.com/v1/albums/4LileDrFwEUFB5UPA3AEia", {
      headers: {
        // Insert your valid Spotify access token below
        Authorization:
          " Bearer BQDwXJ0goEjKHHkpBeVK89t_xWOaJaQw03TxDV-RBjuNGKLX5z0_nRCok7O3V3TzoVF69Qsl1SrlEXjfoK_xsjimIVIzXrPQqv2ymyS6cgUuQ3fVA4S_uSX7FRUaFTy9Mr7L9FQQxVE",
      },
    })
      .then((response) => response.json())
      .then((data) => setAlbum(data))
      .catch((error) => console.error("Error fetching album data:", error));
  }, []);

  if (!album) {
    return <div>Loading album data...</div>;
  }

  return <AlbumColumn album={album} />;
};

export default AlbumData;
