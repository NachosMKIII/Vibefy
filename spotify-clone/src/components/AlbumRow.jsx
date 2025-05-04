//AlbumRow.jsx
"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayback } from "../hooks/usePlayback"; // Adjust path as needed

export default function AlbumRow({ title, albums }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
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

  return (
    <div className="w-full">
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
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}

function AlbumCard({ album }) {
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
      className="flex-shrink-0 w-40 h-54 transition-transform"
      style={{ backgroundColor: "var(--color2t)" }}
    >
      <div className=" relative mb-2 hover:scale-105 transition-transform">
        <img
          className=" object-cover rounded cursor-pointer w-40 h-40"
          src={albumImage}
          alt={`${album.name} cover`}
          onClick={handlePlay}
        />
      </div>
      <p className="w-[18ch] ml-0.5 line-clamp-2 album-title font-medium">
        {album.name}
      </p>
    </div>
  );
}
