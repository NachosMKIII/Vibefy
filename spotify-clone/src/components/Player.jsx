//Player.jsx
import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets/assets";
//lucide-react icons
import { Shuffle } from "lucide-react";
import { SquarePlay } from "lucide-react";
import { StepForward } from "lucide-react";
import { StepBack } from "lucide-react";
import { Infinity } from "lucide-react";
import { Repeat2 } from "lucide-react";
//end of lucide-react-icons
import { useSpotifyApi } from "../backend/Auth";
import { SpotifyContext } from "../context/SpotifyContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./metal-rock-theme/player.css";
import "./experimental-theme/player.css";
import "./cozy-theme/player.css";

const Player = ({ playbackState }) => {
  const { theme } = useContext(ThemeContext);
  const { deviceId } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();
  const { player } = useContext(SpotifyContext);

  // Local state for slider value, default to 50%
  const [sliderValue, setSliderValue] = useState(50);

  // Update slider value when playbackState changes
  useEffect(() => {
    if (playbackState) {
      setSliderValue(Math.round((playbackState.volume || 0.5) * 100));
    }
  }, [playbackState]);

  // Check if there's no active playback or track
  if (!playbackState || !playbackState.track_window?.current_track) {
    return <div className="text-white">No track playing</div>;
  }

  // Extract track details from playbackState
  const isPlaying = !playbackState.paused;
  const currentTrack = playbackState?.track_window?.current_track || null;
  const albumImage = currentTrack?.album.images[0]?.url || assets.default_image;
  const trackName = currentTrack?.name || "No track playing";
  const artistName =
    currentTrack?.artists?.map((artist) => artist.name).join(", ") ||
    "No artist";

  // Toggle play/pause
  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await makeApiCall(
          `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`,
          { method: "PUT" }
        );
      } else {
        await makeApiCall(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          { method: "PUT" }
        );
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  // Skip to next track
  const nextTrack = async () => {
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`,
        { method: "POST" }
      );
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  };

  // Go to previous track
  const prevTrack = async () => {
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`,
        { method: "POST" }
      );
    } catch (error) {
      console.error("Error going to previous track:", error);
    }
  };

  // Toggle shuffle
  const toggleShuffle = async () => {
    try {
      const newState = !playbackState.shuffle;
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/shuffle?state=${newState}&device_id=${deviceId}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error toggling shuffle:", error);
    }
  };

  // Cycle repeat mode
  const cycleRepeatMode = async () => {
    try {
      const currentMode = playbackState.repeat_mode;
      let nextMode;
      if (currentMode === 0) {
        nextMode = "context";
      } else if (currentMode === 1) {
        nextMode = "track";
      } else {
        nextMode = "off";
      }
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/repeat?state=${nextMode}&device_id=${deviceId}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error cycling repeat mode:", error);
    }
  };

  // Handle volume change
  const handleVolumeChange = async (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setSliderValue(newVolume); // Update local state immediately
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}&device_id=${deviceId}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };
  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`main-player rounded fixed h-[16%] bg-gradient-to-br from-amber-950 via-amber-900 to-green-950 player w-[80%] flex justify-between items-center text-white px-4 bottom-[0px] left-[305px] ${theme}`}
    >
      <div className="hidden lg:flex relative right-2 w-[22ch] items-center gap-4">
        <img className="w-16" src={albumImage} alt="Album cover" />
        <div>
          <p className="font-bold whitespace-nowrap">{trackName}</p>
          <p className="whitespace-nowrap">{artistName}</p>
        </div>
      </div>

      <div className="gap-1 relative right-18 m-auto">
        <div className="w-full mt-2 flex items-center">
          <span>{formatTime(playbackState?.position)}</span>
          <input
            type="range"
            min="0"
            max={playbackState?.duration || 0}
            value={playbackState?.position || 0}
            onChange={(e) => {
              if (player) {
                player.seek(parseInt(e.target.value, 10));
              }
            }}
            className="w-full mx-2"
          />
          <span>{formatTime(playbackState?.duration)}</span>
        </div>
        <div className="flex gap-2">
          <Shuffle
            className={`w-8 h-8 relative top-2 cursor-pointer playback-control ${
              playbackState.shuffle ? "shuffle-on" : "shuffle-off"
            }`}
            onClick={toggleShuffle}
          />
          <StepBack
            className="w-8 h-8 top-2 relative cursor-pointer"
            onClick={prevTrack}
          />
          <SquarePlay
            className={`w-8 h-8 relative top-2 cursor-pointer playback-control ${
              isPlaying ? "play-on" : "play-off"
            }`}
            onClick={togglePlayPause}
          />
          <StepForward
            className="w-8 h-8 top-2 relative cursor-pointer"
            onClick={nextTrack}
          />
          <Repeat2
            className={`w-8 h-8 top-2 relative cursor-pointer playback-control ${
              playbackState?.repeat_mode === 0
                ? "loop-off"
                : playbackState?.repeat_mode === 1
                ? "loop-context"
                : "loop-track"
            }`}
            onClick={cycleRepeatMode}
          />
        </div>
      </div>
      <div className="items-center flex relative mt-2">
        <img className="w-4" src={assets.volume_icon} alt="Volume" />
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleVolumeChange}
          className="w-24 ml-2"
        />
      </div>
    </div>
  );
};

export default Player;
