import React from "react";

const AlbumRow = ({ album }) => {
  // Get the first image from the album images array or fallback if unavailable
  const albumImage =
    album.images && album.images.length > 0
      ? album.images[1].url
      : "fallback-image-url.jpg";

  return (
    <div className="w-50 h-50 relative top-10 bg-blue-200">
      <img
        className="rounded cursor-pointer"
        src={albumImage}
        alt={`${album.name} cover`}
      />
      <p className="w-[21ch] line-clamp-2 text-white font-medium">
        {album.name}
      </p>
    </div>
  );
};

export default AlbumRow;
