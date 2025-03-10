import React from "react";
import { assets } from "../assets/assets/assets";

const Player = () => {
  return (
    <div className="h-[10%] bg-amber-300 flex justify-between items-center text-white px-4">
      <div className="hidden lg:flex items-center gap-4">
        <img className="w-12" src="song-image-goes here" alt="" />
        <div>
          <p className="font-bold">Song name goes here</p>
          <p className="font-bold">Song description goes here</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 m-auto">
        <div className="flex gap-4">
          <img
            className="w-4 cursor-pointer"
            src={assets.shuffle_icon}
            alt=""
          />
          <img className="w-4 cursor-pointer" src={assets.prev_icon} alt="" />
          <img className="w-4 cursor-pointer" src={assets.play_icon} alt="" />
          <img className="w-4 cursor-pointer" src={assets.next_icon} alt="" />
          <img className="w-4 cursor-pointer" src={assets.loop_icon} alt="" />
        </div>
        <div className="flex items-center gap-5"></div>
      </div>
    </div>
  );
};

export default Player;
