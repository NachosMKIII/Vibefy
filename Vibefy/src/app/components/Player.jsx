// src/app/components/Player.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
//lucide-react icons
import {
  Shuffle,
  SquarePlay,
  StepForward,
  StepBack,
  Repeat2,
  Volume2Icon,
} from "lucide-react";
import { useSpotifyApi } from "../Auth/Auth";
import { SpotifyContext } from "../context/SpotifyContext";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./metal-rock-theme/player.css";
import "./experimental-theme/player.css";
import "./cozy-theme/player.css";
import Slider from "./sub-components/Slider";
import { Volume2 } from "lucide-react";

const Player = ({ playbackState, isLoggedIn }) => {
  const { theme } = useContext(ThemeContext);
  const { deviceId, player } = useContext(SpotifyContext);
  const makeApiCall = useSpotifyApi();
  const [sliderValue, setSliderValue] = useState(50);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const isAdjustingRef = useRef(isAdjusting);
  useEffect(() => {
    isAdjustingRef.current = isAdjusting;
  }, [isAdjusting]);

  useEffect(() => {
    if (player) {
      const handlePlayerStateChange = (state) => {
        if (state && !isAdjustingRef.current) {
          console.log("Player state changed, volume:", state.volume);
          setSliderValue(Math.round((state.volume || 0.5) * 100));
        }
      };

      player.addListener("player_state_changed", handlePlayerStateChange);

      player.getCurrentState().then((state) => {
        if (state && !isAdjustingRef.current) {
          console.log("Initial state volume:", state.volume);
          setSliderValue(Math.round((state.volume || 0.5) * 100));
        }
      });

      return () => {
        player.removeListener("player_state_changed", handlePlayerStateChange);
      };
    }
  }, [player]);
  const handleLogout = async () => {
    try {
      if (player) {
        player.disconnect();
        console.log("Player disconnected");
      }
      await fetch("/api/logout", { method: "POST" });
      window.alert(
        "Logged out successfully! Remember to remove the app's access in your Spotify account."
      );
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      window.alert("Failed to log out. Please try again.");
    }
  };
  if (!playbackState || !playbackState.track_window?.current_track) {
    return (
      <div
        className={`main-player rounded fixed h-[16%] player w-[80%] flex justify-between items-center text-white px-4 bottom-[0px] left-[308px] ${theme}`}
      >
        <div className="hidden lg:flex relative right-2 items-center gap-4">
          <div className="max-w-[30ch]"></div>
        </div>

        <div className="gap-1 absolute left-125 m-auto">
          <div className="w-full mt-2 flex items-center"></div>
          <div className="flex gap-2">
            <Shuffle
              className={`w-8 h-8 relative top-5 cursor-pointer playback-control 
                
            `}
            />
            <StepBack className="w-8 h-8 top-5 relative cursor-pointer" />
            <SquarePlay
              className={`w-8 h-8 relative top-5 cursor-pointer playback-control `}
            />
            <StepForward className="w-8 h-8 top-5 relative cursor-pointer" />
            <Repeat2
              className={`w-8 h-8 top-5 relative cursor-pointer playback-control`}
            />
          </div>
          {isLoggedIn && (
            <div className=" flex items-center absolute z-10 left-[290px] top-[2px] justify-center">
              <button
                className="cursor-pointer login-button bg-green-500 py-2 px-16 rounded-full text-black"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="items-center flex relative mt-2"></div>
      </div>
    );
  }
  const isPlaying = !playbackState.paused;
  const currentTrack = playbackState?.track_window?.current_track || null;
  const albumImage = currentTrack?.album.images[0]?.url || null;
  const trackName = currentTrack?.name || "No track playing";
  const artistName =
    currentTrack?.artists?.map((artist) => artist.name).join(", ") ||
    "No artist";

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
    console.log("Setting slider value to:", newVolume);
    setSliderValue(newVolume); // Update local state immediately
    try {
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}&device_id=${deviceId}`,
        { method: "PUT" }
      );
      console.log("Volume set successfully to:", newVolume);
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
      className={`main-player rounded fixed h-[16%] player w-[80%] flex justify-between items-center text-white px-4 bottom-[0px] left-[308px] ${theme}`}
    >
      <div className="hidden lg:flex relative right-2 items-center gap-4">
        <img className="w-20 album-image" src={albumImage} alt="Album cover" />
        <div className="max-w-[30ch]">
          <p
            className="font-bold truncate track
          "
          >
            {trackName}
          </p>
          <p
            className="truncate artist
          "
          >
            {artistName}
          </p>
        </div>
      </div>

      <div className="gap-1 absolute left-125 m-auto">
        <div className="w-full mt-2 flex items-center">
          <span>{formatTime(playbackState?.position)}</span>
          <Slider
            min={0}
            max={playbackState?.duration || 0}
            value={playbackState?.position || 0}
            onChange={(e) => {
              if (player) {
                player.seek(parseInt(e.target.value, 10));
              }
            }}
            className="w-full mx-2"
            type="progress"
            theme={theme}
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
        {isLoggedIn && (
          <div className=" flex items-center absolute z-10 left-[290px] bottom-[10px] justify-center">
            <button
              className="cursor-pointer login-button bg-green-500 py-2 px-16 rounded-full text-black"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="items-center flex relative mt-2 gap-4">
        <Volume2 className="w-5 relative left-4" alt="Volume" />
        <Slider
          min={0}
          max={100}
          value={sliderValue}
          onChange={handleVolumeChange}
          onMouseDown={() => {
            setIsAdjusting(true);
            console.log("Started adjusting slider");
          }}
          onMouseUp={() => {
            setIsAdjusting(false);
            console.log("Stopped adjusting slider");
          }}
          className="w-24 ml-2"
          type="volume"
          theme={theme}
        />
      </div>
    </div>
  );
};

export default Player;
