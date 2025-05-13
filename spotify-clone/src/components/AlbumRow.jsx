import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayback } from "../hooks/usePlayback";
import { useSpotifyApi } from "../backend/Auth";
import "./cozy-theme/album-row.css";

export default function AlbumRow({ title, albumIds, theme }) {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const makeApiCall = useSpotifyApi();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      const albumIds = [
        "4LileDrFwEUFB5UPA3AEia",
        "2yAO7HQOfO4t146QLyK26a",
        "7DxmOS2dKJgTfLLRNOP4ch",
        "7izZDSBxj6nB2PieJo6U0u",
        "4T95uimM0PQNgAkcyLTym0",
        "1K6TvnkvmnLKPhifmPb6N7",
        "63TYyeXlBYoYKNvE6rT3hI",
        "1vWOYk3hF5bgVUUUaPvYLh",
        "6EtrZFZ6FMR6fbB82oHUWi",
        "38NEzyo2N5T68j7aFetd4x",
      ].join(",");

      try {
        const data = await makeApiCall(
          `https://api.spotify.com/v1/albums?ids=${albumIds}`
        );
        setAlbums(data.albums);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [albumIds, makeApiCall]);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (albums.length === 0) {
    return <div>Loading albums...</div>;
  }

  return (
    <div className={`w-full main-album-row ${theme}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold album-title">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={[
              "p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors",
              !canScrollLeft && "opacity-50 cursor-not-allowed",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={[
              "p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors",
              !canScrollRight && "opacity-50 cursor-not-allowed",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
        onScroll={checkScrollButtons}
      >
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function AlbumCard({ album, theme }) {
  const { playAlbum } = usePlayback();

  const albumImage =
    album.images && album.images.length > 0
      ? album.images[1].url
      : "fallback-image-url.jpg";

  const handlePlay = () => {
    playAlbum(album.id);
  };

  return (
    <div
      className={`main-album-row album-row flex-shrink-0 w-40 h-54 rounded-2xl transition-transform ${theme}`}
    >
      <div className="relative mb-2 hover:scale-105 transition-transform">
        <img
          className="object-cover rounded cursor-pointer w-40 h-40"
          src={albumImage}
          alt={`${album.name} cover`}
          onClick={handlePlay}
        />
      </div>
      <div className="description rounded h-14 -mt-3">
        <p className=" w-[18ch] pl-0.5 pt-2 line-clamp-2 font-medium">
          {album.name}
        </p>
      </div>
    </div>
  );
}
