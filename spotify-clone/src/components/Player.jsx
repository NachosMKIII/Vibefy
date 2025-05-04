import React from "react";
import { assets } from "../assets/assets/assets"; // Ensure this path is correct
import { useSpotifyApi } from "../backend/Auth"; // Adjust path as needed

const accessToken = localStorage.getItem("access_token");

const Player = ({ playbackState }) => {
  const makeApiCall = useSpotifyApi();

  // Check if there's no active playback or track
  if (!playbackState || !playbackState.item) {
    return;
  }

  // Extract track details from playbackState
  const currentTrack = playbackState.item;
  const albumImage = currentTrack.album.images[0]?.url || ""; // Use first image from album
  const trackName = currentTrack.name;
  const artistName = currentTrack.artists
    .map((artist) => artist.name)
    .join(", ");

  // Toggle play/pause
  const togglePlayPause = async () => {
    try {
      if (playbackState.is_playing) {
        await makeApiCall("https://api.spotify.com/v1/me/player/pause", {
          method: "PUT",
        });
      } else {
        await makeApiCall("https://api.spotify.com/v1/me/player/play", {
          method: "PUT",
        });
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  // Skip to next track
  const nextTrack = async () => {
    try {
      await makeApiCall("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  };

  // Go to previous track
  const prevTrack = async () => {
    try {
      await makeApiCall("https://api.spotify.com/v1/me/player/previous", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error going to previous track:", error);
    }
  };

  return (
    <div className="h-[10%] player flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src={albumImage} alt="Album cover" />
        <div>
          <p className="font-bold">{trackName}</p>
          <p>{artistName}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img
            className="w-4 cursor-pointer"
            src={assets.shuffle_icon}
            alt="Shuffle"
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.prev_icon}
            alt="Previous"
            onClick={prevTrack}
          />
          <img
            className="w-4 cursor-pointer"
            src={
              playbackState.is_playing ? assets.pause_icon : assets.play_icon
            }
            alt={playbackState.is_playing ? "Pause" : "Play"}
            onClick={togglePlayPause}
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.next_icon}
            alt="Next"
            onClick={nextTrack}
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.loop_icon}
            alt="Loop"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
