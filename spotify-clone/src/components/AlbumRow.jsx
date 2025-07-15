//AlbumRow.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayback } from "../hooks/usePlayback";
import { useSpotifyApi } from "../backend/Auth";
import "./cozy-theme/album-row.css";
import "./metal-rock-theme/album-row.css";
import "./experimental-theme/album-row.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AlbumRow({ title, albumIds, playbackState }) {
  const { theme } = useContext(ThemeContext);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const makeApiCall = useSpotifyApi();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let albumIds;
    if (theme === "cozy") {
      albumIds = [
        "7DxmOS2dKJgTfLLRNOP4ch",
        "1K6TvnkvmnLKPhifmPb6N7",
        "6EtrZFZ6FMR6fbB82oHUWi",
        "38NEzyo2N5T68j7aFetd4x",
        "0AL7olZ75pi55q9p1eHaD8",
        "1aFyAtSRxLNzSTGwHMRvWj",
        "0vhRTvVCv9O5orRMgFjxT1",
        "02UhY4AQiAry5S2ZpgEKIt",
        "2kz6FGzMkZUyGZPywlkcOu",
        "60EzsIzS77S9MWHT0Tm37s",
        "02gFZUaqAcQNtV6rmVIsN0",
      ];
    } else if (theme === "rock-metal") {
      albumIds = [
        "2kcJ3TxBhSwmki0QWFXUz8",
        "08pnia1NUFsyIWfhE9sZz1",
        "1QJmLRcuIMMjZ49elafR3K",
        "1XkGORuUX2QGOEIL4EbJKm",
        "1gsoIHeBan6QywhysNgApK",
        "5sMSJ6uAozdrqFELMwl3NU",
        "1j57Q5ntVi7crpibb0h4sv",
        "6a5n1Frj3nxGcyTqT1xfrg",
        "5XgUtV3205kTcgoSLNf8ix",
        "6DJwvB2iCquvxxrXRW0cFz",
        "3HFbH1loOUbqCyPsLuHLLh",
        "7izZDSBxj6nB2PieJo6U0u",
        "7rSZXXHHvIhF4yUFdaOCy9",
      ];
    } else if (theme === "experimental") {
      albumIds = [
        "4LileDrFwEUFB5UPA3AEia",
        "2yAO7HQOfO4t146QLyK26a",
        "7izZDSBxj6nB2PieJo6U0u",
        "4T95uimM0PQNgAkcyLTym0",
        "63TYyeXlBYoYKNvE6rT3hI",
        "1vWOYk3hF5bgVUUUaPvYLh",
        "2TN3NIEBmAOGWmvP96DFs5",
        "6wRDKCpKw3ap6dhkpdXNIN",
        "0VDB8LxXpOS8qQeiab3LqG",
        "7GjVWG39IOj4viyWplJV4H",
        "3ddMQ2PZjiD8Zxm0lu92rb",
        "1WwiyWxa40PKucRxIKlEVM",
      ];
    } else {
      // Fallback to a default set (e.g., cozy)
      albumIds = [
        "7DxmOS2dKJgTfLLRNOP4ch",
        "1K6TvnkvmnLKPhifmPb6N7",
        "6EtrZFZ6FMR6fbB82oHUWi",
        "38NEzyo2N5T68j7aFetd4x",
        "0AL7olZ75pi55q9p1eHaD8",
        "1aFyAtSRxLNzSTGwHMRvWj",
        "0vhRTvVCv9O5orRMgFjxT1",
        "02UhY4AQiAry5S2ZpgEKIt",
        "2kz6FGzMkZUyGZPywlkcOu",
        "60EzsIzS77S9MWHT0Tm37s",
        "02gFZUaqAcQNtV6rmVIsN0" /* ... default albums */,
        ,
        ,
      ];
    }
    const fetchAlbums = async () => {
      try {
        const data = await makeApiCall(
          `https://api.spotify.com/v1/albums?ids=${albumIds.join(",")}`
        );
        setAlbums(data.albums);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [theme, makeApiCall]);

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
      className={`main-album-row album-row mb-6 flex-shrink-0 w-40 h-54 rounded-2xl transition-transform mr-2 ${theme}`}
    >
      <div className="relative mb-2 hover:scale-105 transition-transform">
        <img
          className="object-cover rounded cursor-pointer w-40 h-40"
          src={albumImage}
          alt={`${album.name} cover`}
          onClick={handlePlay}
        />
      </div>
      <div
        className="description 
      backdrop-blur-sm rounded-lg p-3 border"
      >
        <h3 className="album-name font-medium text-sm line-clamp-2 mb-1">
          {album.name}
        </h3>
        <p className="album-artist  text-xs line-clamp-1">
          {album.artists.map((artist) => artist.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
