// src/app/components/PlaylistList.jsx
"use client";
import React, { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { ThemeContext } from "../context/ThemeContext";
import { ArrowBigLeftDash } from "lucide-react";
import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";
import "./experimental-theme/sidebar.css";

const PlaylistList = ({ setSidebarView, startNewPlaylist }) => {
  const { playlists, selectPlaylist } = useContext(PlaylistContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const scrollbarConfig = {
    cozy: {
      trackColor: "#92400e",
      thumbColor: "linear-gradient(180deg, #22c55e, #16a34a)",
      thumbHover: "linear-gradient(180deg, #4ade80, #22c55e)",
      thumbActive: "linear-gradient(180deg, #86efac, #4ade80)",
    },
    "rock-metal": {
      trackColor: "#1e293b",
      thumbColor: "linear-gradient(180deg, #0ea5e9, #0284c7)",
      thumbHover: "linear-gradient(180deg, #38bdf8, #0ea5e9)",
      thumbActive: "linear-gradient(180deg, #7dd3fc, #38bdf8)",
    },
    experimental: {
      trackColor: "#581c87",
      thumbColor: "linear-gradient(180deg, #eab308, #ca8a04)",
      thumbHover: "linear-gradient(180deg, #fbbf24, #eab308)",
      thumbActive: "linear-gradient(180deg, #fde047, #fbbf24)",
    },
    null: {
      trackColor: "#92400e",
      thumbColor: "linear-gradient(180deg, #22c55e, #16a34a)",
      thumbHover: "linear-gradient(180deg, #4ade80, #22c55e)",
      thumbActive: "linear-gradient(180deg, #86efac, #4ade80)",
    },
  };

  const handleSelectPlaylist = (playlistId) => {
    selectPlaylist(playlistId);
    setSidebarView("playlistCustomizer");
  };

  return (
    <div
      className={`playlist-list main-sidebar sidebar w-[20%] h-[130%] mr-5 p-2 flex-col gap-2 hidden lg:flex ${theme}`}
    >
      <div className="sidebar1 pb-4 rounded mt-10">
        <h2 className="text-2xl font-bold m-4 ml-2">Your Playlists</h2>
        <ArrowBigLeftDash
          onClick={() => setSidebarView("default")}
          className="mb-2 ml-3 relative top-2 w-8 h-8 button1 rounded cursor-pointer p-1
          "
        />

        {playlists.length === 0 ? (
          <button
            onClick={startNewPlaylist}
            className=" mb-2 mt-2 ml-3 px-4 py-2 rounded cursor-pointer button3 "
          >
            Create your first playlist
          </button>
        ) : (
          <ul
            className={`max-h-[551px] overflow-y-auto custom-scrollbar-${theme}`}
          >
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                className="flex items-center ml-3 gap-2 mt-4 album-playlist cursor-pointer rounded max-w-66"
                onClick={() => handleSelectPlaylist(playlist.id)}
              >
                {playlist.tracks.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={playlist.tracks[0].image || "fallback-image-url.jpg"}
                      alt="Playlist cover"
                      className="w-12 h-12 rounded"
                    />
                    <p className="font-medium">{playlist.name}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <img
                      src={"./assets/images/no-songs.jpg"}
                      alt="Playlist cover"
                      className="w-12 h-12 rounded"
                    />
                    <p className="font-medium">{playlist.name}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        <style jsx>{`
          .custom-scrollbar-cozy::-webkit-scrollbar {
            width: 12px;
          }
          .custom-scrollbar-cozy::-webkit-scrollbar-track {
            background: ${scrollbarConfig.cozy.trackColor};
            border-radius: 6px;
          }
          .custom-scrollbar-cozy::-webkit-scrollbar-thumb {
            background: ${scrollbarConfig.cozy.thumbColor};
            border-radius: 6px;
            border: 2px solid ${scrollbarConfig.cozy.trackColor};
          }
          .custom-scrollbar-cozy::-webkit-scrollbar-thumb:hover {
            background: ${scrollbarConfig.cozy.thumbHover};
          }
          .custom-scrollbar-cozy::-webkit-scrollbar-thumb:active {
            background: ${scrollbarConfig.cozy.thumbActive};
          }

          .custom-scrollbar-rock-metal::-webkit-scrollbar {
            width: 12px;
          }
          .custom-scrollbar-rock-metal::-webkit-scrollbar-track {
            background: ${scrollbarConfig["rock-metal"].trackColor};
            border-radius: 6px;
          }
          .custom-scrollbar-rock-metal::-webkit-scrollbar-thumb {
            background: ${scrollbarConfig["rock-metal"].thumbColor};
            border-radius: 6px;
            border: 2px solid ${scrollbarConfig["rock-metal"].trackColor};
          }
          .custom-scrollbar-rock-metal::-webkit-scrollbar-thumb:hover {
            background: ${scrollbarConfig["rock-metal"].thumbHover};
          }
          .custom-scrollbar-rock-metal::-webkit-scrollbar-thumb:active {
            background: ${scrollbarConfig["rock-metal"].thumbActive};
          }

          .custom-scrollbar-experimental::-webkit-scrollbar {
            width: 12px;
          }
          .custom-scrollbar-experimental::-webkit-scrollbar-track {
            background: ${scrollbarConfig.experimental.trackColor};
            border-radius: 6px;
          }
          .custom-scrollbar-experimental::-webkit-scrollbar-thumb {
            background: ${scrollbarConfig.experimental.thumbColor};
            border-radius: 6px;
            border: 2px solid ${scrollbarConfig.experimental.trackColor};
          }
          .custom-scrollbar-experimental::-webkit-scrollbar-thumb:hover {
            background: ${scrollbarConfig.experimental.thumbHover};
          }
          .custom-scrollbar-experimental::-webkit-scrollbar-thumb:active {
            background: ${scrollbarConfig.experimental.thumbActive};
          }

          .custom-scrollbar-null::-webkit-scrollbar {
            width: 12px;
          }
          .custom-scrollbar-null::-webkit-scrollbar-track {
            background: ${scrollbarConfig.null.trackColor};
            border-radius: 6px;
          }
          .custom-scrollbar-null::-webkit-scrollbar-thumb {
            background: ${scrollbarConfig.null.thumbColor};
            border-radius: 6px;
            border: 2px solid ${scrollbarConfig.null.trackColor};
          }
          .custom-scrollbar-null::-webkit-scrollbar-thumb:hover {
            background: ${scrollbarConfig.null.thumbHover};
          }
          .custom-scrollbar-null::-webkit-scrollbar-thumb:active {
            background: ${scrollbarConfig.null.thumbActive};
          }
        `}</style>
      </div>
    </div>
  );
};

export default PlaylistList;
