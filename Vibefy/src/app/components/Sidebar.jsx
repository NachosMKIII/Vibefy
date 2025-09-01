// src/app/components/Sidebar.jsx
"use client";
import React from "react";
import { BookHeadphones, CirclePlus } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { useSpotifyApi } from "../Auth/Auth";
import { themeAlbums } from "./data/themeAlbums";
import "./experimental-theme/sidebar.css";
import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";

const Sidebar = ({ setSidebarView, startNewPlaylist }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const makeApiCall = useSpotifyApi();
  const { deviceId } = useContext(SpotifyContext);

  const handleRandomSong = async () => {
    const albums = themeAlbums[theme];
    if (!albums || albums.length === 0) {
      console.error("No albums for the selected theme");
      return;
    }
    const randomAlbumId = albums[Math.floor(Math.random() * albums.length)];
    try {
      const tracksResponse = await makeApiCall(
        `https://api.spotify.com/v1/albums/${randomAlbumId}/tracks`
      );
      const tracks = tracksResponse.items;
      if (!tracks || tracks.length === 0) {
        console.error("No tracks found for the album");
        return;
      }
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      const trackUri = randomTrack.uri;
      if (!deviceId) {
        console.error("No device ID available");
        return;
      }
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [trackUri] }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error playing random song:", error);
    }
  };

  return (
    <div
      className={`main-sidebar sidebar w-[20%] h-[130%] mr-5 p-2 flex-col gap-2 hidden lg:flex ${theme}`}
    >
      <div className="sidebar1 h-[80%] rounded mt-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookHeadphones
              className="w-12 h-12 -ml-1 -mb-4 cursor-pointer icon"
              onClick={() => setSidebarView("playlistList")}
            />
            <p
              className="text-2xl relative top-6 -mt-10 font-bold cursor-pointer"
              onClick={() => setSidebarView("playlistList")}
            >
              Playlists
            </p>
          </div>
        </div>
        <div className="p-4 sidebar2a m-2 rounded font-semibold flex flex-col items-start h-[160px] justify-start gap-1 pl-4 mt-10">
          <h1>Get a random song from the {theme} vibe</h1>
          <button
            onClick={handleRandomSong}
            className="button1 px-4 py-1.5 text-[22px] rounded-full mt-4 cursor-pointer font-normal transition-all duration-200 hover:scale-105"
          >
            Random song
          </button>
        </div>
        <div className="p-4 sidebar2a m-2 rounded font-semibold h-[160px] flex flex-col items-start justify-start gap-1 pl-4 mt-10">
          <h1>Create a playlist with your desired songs</h1>
          <button
            onClick={startNewPlaylist}
            className="button1 px-4 py-1.5 text-[22px] rounded-full mt-4 cursor-pointer font-normal transition-all duration-200 hover:scale-105"
          >
            Create playlist
          </button>
        </div>
        <div className="p-4 sidebar2b m-2 rounded h-[160px] font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-10">
          <h1>Change the vibe</h1>
          <div>
            <button
              onClick={() => setTheme("cozy")}
              className="button2 px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer mr-2 hover:scale-105 shadow-md"
            >
              Cozy
            </button>
            <button
              onClick={() => setTheme("rock-metal")}
              className="button2 px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer mr-2 hover:scale-105 shadow-md"
            >
              Rock-Metal
            </button>
            <button
              onClick={() => setTheme("experimental")}
              className="button2 px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer hover:scale-105 shadow-md"
            >
              Experimental
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
