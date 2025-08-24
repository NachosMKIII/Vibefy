// usePlayback.js
import { useContext } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import { useSpotifyApi } from "../Auth/Auth";

export const usePlayback = () => {
  const { deviceId } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();

  const playAlbum = async (albumId) => {
    // Check if deviceId is available
    if (!deviceId) {
      console.error(
        "No device ID available. Please wait for the player to initialize."
      );
      return;
    }

    const contextUri = `spotify:album:${albumId}`;
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ context_uri: contextUri }),
        }
      );
      console.log(
        `Started playing album with ID: ${albumId} on device: ${deviceId}`
      );
    } catch (error) {
      console.error("Error playing album:", error);
      throw error; // Let the calling component handle the error if needed
    }
  };

  return { playAlbum };
};
