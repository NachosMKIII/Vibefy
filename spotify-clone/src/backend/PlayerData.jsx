import React, { useEffect, useState } from "react";
import Player from "../components/PlayerTest"; // Ensure this path matches your structure
import { useSpotifyApi } from "./Auth"; // Adjust the path if needed

const PlayerData = () => {
  const [playbackState, setPlaybackState] = useState(null);
  const [error, setError] = useState(null);
  const makeApiCall = useSpotifyApi();

  useEffect(() => {
    const fetchPlaybackState = async () => {
      try {
        const data = await makeApiCall("https://api.spotify.com/v1/me/player");
        setPlaybackState(data || { is_playing: false, item: null }); // Handle no active playback
      } catch (error) {
        setError(error.message);
        console.error("Error fetching playback state:", error);
      }
    };

    fetchPlaybackState();
    // Poll every 5 seconds to keep the playback state updated
    const interval = setInterval(fetchPlaybackState, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [makeApiCall]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!playbackState) {
    return <div>Loading playback data...</div>;
  }

  return <Player playbackState={playbackState} />;
};

export default PlayerData;
