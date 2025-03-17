import React from "react";
import { assets } from "../assets/assets/assets";

const Player = ({ artist }) => {
  // Choose the first image as the display image
  const artistImage = artist.images?.[2]?.url || "";
  // Join genres array into a comma-separated string. If empty, display a fallback.
  const artistGenres =
    artist.genres && artist.genres.length > 0
      ? artist.genres.join(", ")
      : "Genre not available";

  return (
    <div className="h-[10%] bg-pink-300 flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src={artistImage} alt={`${artist.name} image`} />
        <div>
          <p className="font-bold">{artist.name}</p>
          <p className="font-bold">{artistGenres}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img
            className="w-4 cursor-pointer"
            src={assets.shuffle_icon}
            alt="Shuffle"
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.prev_icon}
            alt="Previous"
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.play_icon}
            alt="Play"
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.next_icon}
            alt="Next"
          />
          <img
            className="w-4 cursor-pointer"
            src={assets.loop_icon}
            alt="Loop"
          />
        </div>
        <div className="flex items-center gap-5"></div>
      </div>
    </div>
  );
};

export default Player;
