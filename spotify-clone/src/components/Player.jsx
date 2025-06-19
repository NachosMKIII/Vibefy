//Player.jsx
import React, { useState, useEffect } from "react";
import { useSpotifyApi } from "../backend/Auth";
import { SpotifyContext } from "../context/SpotifyContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import CozySlider from "./cozySlider";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
} from "lucide-react";
import "./cozy-theme/player.css";
import "./metal-rock-theme/player.css";
import "./experimental-theme/player.css";

const Player = ({ playbackState }) => {
  const { theme } = useContext(ThemeContext);
  const { deviceId } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();
  const [estimatedPosition, setEstimatedPosition] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    if (playbackState) {
      setSliderValue(Math.round((playbackState.volume || 0.5) * 100));
      setEstimatedPosition(playbackState.position);
    }
  }, [playbackState]);

  if (!playbackState || !playbackState.track_window?.current_track) {
    return (
      <div className="flex items-center justify-center h-32 bg-gradient-to-r from-amber-900/20 to-green-900/20 rounded-lg border border-amber-800/30">
        <span className="text-amber-200">No track playing</span>
      </div>
    );
  }

  const isPlaying = !playbackState.paused;
  const currentTrack = playbackState.track_window.current_track;
  const albumImage =
    currentTrack.album.images[0]?.url || "/placeholder.svg?height=64&width=64";
  const trackName = currentTrack.name || "No track playing";
  const artistName =
    currentTrack.artists?.map((artist) => artist.name).join(", ") ||
    "No artist";

  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = async (event) => {
    const newPosition = parseInt(event.target.value, 10);
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${newPosition}&device_id=${deviceId}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

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

  const handleVolumeChange = async (event) => {
    const newVolume = parseInt(event.target.value, 10);
    setSliderValue(newVolume);
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}&device_id=${deviceId}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };

  return (
    <div
      className={`relative z-10 ${
        theme === "cozy"
          ? "bg-gradient-to-br from-amber-950 via-amber-900 to-green-950 p-6 rounded-2xl shadow-2xl border border-amber-800/30 backdrop-blur-sm w-[101%] relative right-2"
          : `main-player  player px-4 mb-10 ${theme}`
      }`}
    >
      {theme === "cozy" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-green-900/10 rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.1),transparent_50%)] rounded-2xl" />
        </>
      )}
      <div className="relative z-10 flex flex-col justify-between">
        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-200 text-sm font-medium">
              {formatTime(estimatedPosition)}
            </span>
            <span className="text-amber-200 text-sm font-medium">
              {formatTime(playbackState.duration)}
            </span>
          </div>
          <CozySlider
            min={0}
            max={playbackState.duration}
            value={estimatedPosition}
            onChange={handleSeek}
            type="progress"
            className="mb-1"
          />
        </div>

        {/* Main Controls */}
        <div className="flex justify-between items-center">
          {/* Track Info */}
          <div className="hidden lg:flex items-center gap-4 min-w-0 flex-1">
            <div className="relative">
              <img
                className="w-16 h-16 rounded-lg shadow-lg border-2 border-amber-600/50"
                src={albumImage}
                alt="Album cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-amber-100 truncate text-lg">
                {trackName}
              </p>
              <p className="text-amber-300 truncate">{artistName}</p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex gap-4 items-center mx-8">
            <button
              onClick={toggleShuffle}
              className="p-2 rounded-full hover:bg-amber-800/30 transition-colors duration-200 relative right-107"
            >
              <Shuffle
                className={`w-5 h-5 transition-colors duration-200 ${
                  playbackState.shuffle
                    ? "text-green-400 opacity-100"
                    : "text-amber-300 opacity-80 hover:opacity-100"
                }`}
              />
            </button>
            <button
              onClick={prevTrack}
              className="p-2 rounded-full hover:bg-amber-800/30 transition-colors duration-200 relative right-107"
            >
              <SkipBack className="w-6 h-6 text-amber-300 opacity-80 hover:opacity-100 transition-opacity duration-200" />
            </button>
            <button
              onClick={togglePlayPause}
              className="p-3 relative right-107 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-amber-950" />
              ) : (
                <Play className="w-6 h-6 text-amber-950" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 rounded-full hover:bg-amber-800/30 transition-colors duration-200 relative right-107"
            >
              <SkipForward className="w-6 h-6 text-amber-300 opacity-80 hover:opacity-100 transition-opacity duration-200" />
            </button>
            <button
              onClick={cycleRepeatMode}
              className="p-2 rounded-full hover:bg-amber-800/30 transition-colors duration-200 relative right-107"
            >
              <Repeat
                className={`w-5 h-5 transition-colors duration-200 ${
                  playbackState.repeat_mode > 0
                    ? "text-green-400 opacity-100"
                    : "text-amber-300 opacity-80 hover:opacity-100"
                }`}
              />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 min-w-0">
            <Volume2 className="w-4 h-4 text-amber-300 opacity-80" />
            <CozySlider
              min={0}
              max={100}
              value={sliderValue}
              onChange={handleVolumeChange}
              type="volume"
              className="w-24"
            />
            <span className="text-amber-300 text-sm font-medium w-8 text-right">
              {sliderValue}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
