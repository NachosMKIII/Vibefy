import { useSpotifyApi } from "../backend/Auth";

export const usePlayback = () => {
  const makeApiCall = useSpotifyApi();

  const playAlbum = async (albumId) => {
    const contextUri = `spotify:album:${albumId}`;
    try {
      await makeApiCall("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        body: JSON.stringify({ context_uri: contextUri }),
      });
      console.log(`Started playing album with ID: ${albumId}`);
    } catch (error) {
      console.error("Error playing album:", error);
      throw error; // You can handle this error in the component if needed
    }
  };

  return { playAlbum };
};
