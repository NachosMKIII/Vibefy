import React, { useEffect, useState } from "react";
import Player from "../components/PlayerTest";
import { useSpotifyApi } from "./Auth"; // Adjust the path if needed

const ArtistData = () => {
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);
  const makeApiCall = useSpotifyApi();

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const data = await makeApiCall(
          "https://api.spotify.com/v1/artists/1rCIEwPp5OnXW0ornlSsRl"
        );
        setArtist(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching artist data:", error);
      }
    };

    fetchArtist();
  }, [makeApiCall]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!artist) {
    return <div>Loading artist data...</div>;
  }

  return <Player artist={artist} />;
};

export default ArtistData;
