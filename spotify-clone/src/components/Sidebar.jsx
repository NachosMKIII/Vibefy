//Sidebar.jsx
import React from "react";
import { assets } from "../assets/assets/assets";
//import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./experimental-theme/sidebar.css";

const Sidebar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div
      className={`main-sidebar sidebar w-[20%] h-[133%] -mt-[7px] -ml-[7.7px] p-2 flex-col gap-2 hidden lg:flex 
        bg-gradient-to-b from-amber-950 via-amber-900 to-green-950 text-white 
        ${theme}`}
    >
      <div className="sidebar1 h-[15%] rounded flex flex-col justify-around">
        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img className="w-6" src={assets.home_icon} alt="" />
          <p className="font-bold">Home</p>
        </div>
        <div className="flex items-center gap-3 pl-8 cursor-pointer">
          <img className="w-6" src={assets.search_icon} alt="" />
          <p className="font-bold">Search</p>
        </div>
      </div>
      <div className="sidebar1 h-[70%] rounded">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={assets.stack_icon} alt="" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3">
            <img className="w-5" src={assets.arrow_icon} alt="" />
            <img className="w-5" src={assets.plus_icon} alt="" />
          </div>
        </div>
        <div className="p-4 z-50 sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
          <h1>Create a playlist with your desired songs</h1>
          <button className="button p-4 py-1.5 text-[15px] rounded-full mt-4 cursor-pointer">
            Button
          </button>
        </div>
        <div className="p-4 sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
          <h1>Get a random song from the {theme} vibe</h1>
          <button className="button px-4 py-1.5 text-[15px] rounded-full mt-4 cursor-pointer">
            Button
          </button>
        </div>
        <div className="p-4 sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4">
          <h1>Change the vibe</h1>
          <div className="">
            <button
              onClick={() => setTheme("cozy")}
              className="button px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer mr-2"
            >
              Cozy
            </button>
            <button
              onClick={() => setTheme("rock-metal")}
              className="button px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer mr-2"
            >
              Rock-Metal
            </button>
            <button
              onClick={() => setTheme("experimental")}
              className="button px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer"
            >
              Experimental
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
