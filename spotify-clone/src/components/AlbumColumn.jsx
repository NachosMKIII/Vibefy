import React from "react";

const AlbumColumn = ({ album }) => {
  // Get the first image from the album images array or fallback if unavailable
  const albumImage =
    album.images && album.images.length > 0
      ? album.images[2].url
      : "fallback-image-url.jpg";

  return (
    <div>
      <img className="rounded" src={albumImage} alt={`${album.name} cover`} />
      <p>{album.name}</p>
    </div>
  );
};

export default AlbumColumn;
