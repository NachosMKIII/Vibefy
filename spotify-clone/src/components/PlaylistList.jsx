//PlaylistList.jsx
import React, { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";

const PlaylistList = ({ setSidebarView }) => {
  const { playlists, selectPlaylist } = useContext(PlaylistContext);

  const handleSelectPlaylist = (playlistId) => {
    selectPlaylist(playlistId);
    setSidebarView("playlistCustomizer");
  };

  return (
    <div className="playlist-list p-4 w-[20%] h-[110%]">
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
      {playlists.length === 0 ? (
        <p>No playlists created yet.</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li
              key={playlist.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-700/50 cursor-pointer"
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
  );
};

export default PlaylistList;
