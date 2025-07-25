//PlaylistList.jsx
import React, { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { ThemeContext } from "../context/ThemeContext";
import "./cozy-theme/sidebar.css";

const PlaylistList = ({ setSidebarView }) => {
  const { playlists, selectPlaylist } = useContext(PlaylistContext);
  const { theme, setTheme } = useContext(ThemeContext);

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
        <button
          onClick={() => setSidebarView("default")}
          className="mb-2 ml-1 px-4 py-2 button3 text-white rounded cursor-pointer
          "
        >
          Back to Sidebar
        </button>
        {playlists.length === 0 ? (
          <p className="ml-1">No playlists created yet.</p>
        ) : (
          <ul className="max-h-[551px] overflow-y-auto">
            {playlists.map((playlist) => (
              <li
                key={playlist.id}
                className="flex items-center ml-1 gap-2 mt-4 album-playlist cursor-pointer rounded max-w-64"
                onClick={() => handleSelectPlaylist(playlist.id)}
              >
                {playlist.tracks.length > 0 && (
                  <img
                    src={playlist.tracks[0].image || "fallback-image-url.jpg"}
                    alt="Playlist cover"
                    className="w-12 h-12 rounded"
                  />
                )}
                <p className="font-medium">{playlist.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaylistList;
