//AlbumRow.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { usePlayback } from "../hooks/usePlayback";
import { useSpotifyApi } from "../backend/Auth";
import "./cozy-theme/album-row.css";
import "./metal-rock-theme/album-row.css";
import "./experimental-theme/album-row.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function AlbumRow({ title, albumIds }) {
  const { theme } = useContext(ThemeContext);
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const makeApiCall = useSpotifyApi();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    let selectedAlbumIds;
    if (theme === "cozy") {
      selectedAlbumIds = [
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
      ];
    } else if (theme === "rock-metal") {
      selectedAlbumIds = [
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
      selectedAlbumIds = [
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
      selectedAlbumIds = ["4LileDrFwEUFB5UPA3AEia", "2yAO7HQOfO4t146QLyK26a"];
    }
    const fetchAlbums = async () => {
      try {
        const data = await makeApiCall(
          `https://api.spotify.com/v1/albums?ids=${selectedAlbumIds.join(",")}`
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
      <div className="flex items-center justify-between mb-2 mt-4">
        <h2 className="text-2xl font-bold text-amber-100">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full bg-amber-800/30 hover:bg-amber-700/40 transition-colors border border-amber-700/20 ${
              !canScrollLeft
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-amber-200" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full bg-amber-800/30 hover:bg-amber-700/40 transition-colors border border-amber-700/20 ${
              !canScrollRight
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-amber-200" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
        onScroll={checkScrollButtons}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
    album.images?.[0]?.url || "/placeholder.svg?height=160&width=160";
  const artistName =
    album.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist";

  const handlePlay = () => {
    playAlbum(album.id);
  };

  return (
    <div
      className={`main-album-row album-row flex-shrink-0 w-40 group cursor-pointer ${theme}`}
    >
      <div className="relative mb-1 overflow-hidden rounded-lg">
        <img
          className="w-40 h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          src={albumImage}
          alt={`${album.name} cover`}
          onClick={handlePlay}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <button
            onClick={handlePlay}
            className="p-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <Play className="w-6 h-6 text-amber-950 fill-current" />
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/40 backdrop-blur-sm rounded-lg p-3 border border-amber-700/20">
        <h3 className="font-medium text-amber-100 text-sm line-clamp-2 mb-1">
          {album.name}
        </h3>
        <p className="text-amber-300 text-xs line-clamp-1">{artistName}</p>
      </div>
    </div>
  );
}
