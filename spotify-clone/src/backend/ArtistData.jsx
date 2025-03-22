import React, { useEffect, useState } from "react";
import Player from "../components/PlayerTest";

const ArtistData = () => {
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.spotify.com/v1/artists/1rCIEwPp5OnXW0ornlSsRl?si=wGlAS6wQTH20qiHEZr-Pcg",
      {
        headers: {
          // If Spotify requires an authorization token, add it here.
          // Authorization: "Bearer YOUR_ACCESS_TOKEN",
          Authorization:
            "Bearer BQDwXJ0goEjKHHkpBeVK89t_xWOaJaQw03TxDV-RBjuNGKLX5z0_nRCok7O3V3TzoVF69Qsl1SrlEXjfoK_xsjimIVIzXrPQqv2ymyS6cgUuQ3fVA4S_uSX7FRUaFTy9Mr7L9FQQxVE",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setArtist(data))
      .catch((error) => console.error("Error fetching artist data:", error));
  }, []);

  if (!artist) {
    return <div>Loading artist data...</div>;
  }

  return <Player artist={artist} />;
};

export default ArtistData;
