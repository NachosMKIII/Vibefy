import React from "react";
import { usePlayback } from "../hooks/usePlayback"; // Adjust path as needed

const AlbumRow = ({ album }) => {
  const { playAlbum } = usePlayback();

  const albumImage =
    album.images && album.images.length > 0
      ? album.images[1].url
      : "fallback-image-url.jpg";

  const handlePlay = () => {
    playAlbum(album.id);
  };

  return (
    <div className="w-40 h-40 relative mt-4 bg-blue-200 mb-10">
      <img
        className="w-full h-full object-cover rounded cursor-pointer"
        src={albumImage}
        alt={`${album.name} cover`}
        onClick={handlePlay}
      />
      <p className="w-[21ch] line-clamp-2 text-white font-medium">
        {album.name}
      </p>
    </div>
  );
};

export default AlbumRow;
