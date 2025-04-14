//Sidebar.jsx
import React from "react";
import { assets } from "../assets/assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[35%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      <div className=" sidebar1  h-[15%] rounded flex flex-col justify-around">
        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img className="w-6" src={assets.home_icon} alt="" />
          <p className="font-bold">Home</p>
        </div>
        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img className="w-6" src={assets.search_icon} alt="" />
          <p className="font-bold">Search</p>
        </div>
      </div>
      <div className=" sidebar1 h-[70%] rounded">
        <div className="p-4 flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img className="w-5" src={assets.arrow_icon} alt="" />
            <img className="w-5" src={assets.plus_icon} alt="" />
          </div>
        </div>
        <div className="p-4  sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
          <h1>Create a playlist with your desired songs</h1>
          <button
            className="p-4 cursor-pointer  text-white"
            href="https://accounts.spotify.com/authorize?client_id=4a5d0df8f02649c9a121fe843b20824a&response_type=code&redirect_uri=http://localhost:5175/
        &scope=user-read-private%20user-read-email%20streaming%20user-modify-playback-state%20user-read-playback-state&code_challenge_method=S256&code_challenge=theCodeChallenge"
          >
            Button
          </button>
        </div>
        <div className="p-4  sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4 ">
          <h1>Get a random song from the cozy vibe</h1>

          <button className="px-4 py-1.5 text-[15px] rounded-full mt-4 token cursor-pointer">
            Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
