//Sidebar.jsx
import React, { useState } from "react";
import { Home, Search, Library, ArrowRight, Plus } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";
import "./experimental-theme/sidebar.css";

const Sidebar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const themes = [
    { id: "cozy", name: "Cozy", color: "from-amber-600 to-amber-700" },
    {
      id: "rock-metal",
      name: "Rock-Metal",
      color: "from-slate-600 to-slate-700",
    },
    {
      id: "experimental",
      name: "Experimental",
      color: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div
      className={`w-[30%] h-full p-3  flex-col gap-3 hidden lg:flex ${
        theme === "cozy"
          ? "bg-gradient-to-b from-amber-950 via-amber-900 to-green-950"
          : `main-sidebar sidebar ${theme}`
      }`}
    >
      {theme === "cozy" && (
        <div>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-green-900/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(217,119,6,0.1),transparent_50%)]" />
        </div>
      )}
      <div className="relative z-10">
        {/* Navigation Section */}
        <div
          className={`${
            theme === "cozy"
              ? "bg-gradient-to-br from-amber-900/60 to-amber-800/60 backdrop-blur-sm rounded-xl p-4 border border-amber-700/30 mb-7"
              : "sidebar1 h-[15%] rounded flex flex-col justify-around mb-7"
          }`}
        >
          <div className="space-y-4 ">
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-amber-800/30 transition-colors cursor-pointer group">
              <Home className="w-6 h-6 text-amber-200 group-hover:text-amber-100" />
              <span className="font-bold text-amber-100 group-hover:text-white">
                Home
              </span>
            </div>
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-amber-800/30 transition-colors cursor-pointer group">
              <Search className="w-6 h-6 text-amber-200 group-hover:text-amber-100" />
              <span className="font-bold text-amber-100 group-hover:text-white">
                Search
              </span>
            </div>
          </div>
        </div>

        {/* Library Section */}
        <div
          className={`${
            theme === "cozy"
              ? "bg-gradient-to-br from-amber-900/60 to-amber-800/60 backdrop-blur-sm rounded-xl p-4 border border-amber-700/30 flex-1"
              : "sidebar1 h-[70%] rounded"
          }`}
        >
          {/* Library Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Library className="w-6 h-6 text-amber-200" />
              <span className="font-bold text-amber-100">Your Library</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-full hover:bg-amber-800/30 transition-colors">
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-amber-800/30 transition-colors">
                <Plus className="w-5 h-5 text-amber-300" />
              </button>
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            {/* Create Playlist Card */}
            <div
              className={`${
                theme === "cozy"
                  ? "bg-gradient-to-br from-amber-800/40 to-green-800/40 rounded-lg p-4 border border-amber-700/20"
                  : "sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4"
              }`}
            >
              <h3 className="font-semibold text-amber-100 mb-3 leading-tight">
                Create a playlist with your desired songs
              </h3>
              <button
                className={`${
                  theme === "cozy"
                    ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
                    : "button px-4 py-1.5 text-[15px] rounded-full mt-4 cursor-pointer"
                }`}
              >
                Create Playlist
              </button>
            </div>

            {/* Random Song Card */}
            <div
              className={`${
                theme === "cozy"
                  ? "bg-gradient-to-br from-green-800/40 to-amber-800/40 rounded-lg p-4 border border-green-700/20"
                  : "sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4"
              }`}
            >
              <h3 className="font-semibold text-amber-100 mb-3 leading-tight">
                Get a random song from the {theme} vibe
              </h3>
              <button
                className={`${
                  theme === "cozy"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-full px-4 py-1.5 text-[15px]"
                    : "button px-4 py-1.5 text-[15px] rounded-full mt-4 cursor-pointer"
                } font-medium text-green-950`}
              >
                Random Song
              </button>
            </div>

            {/* Theme Selector Card */}
            <div
              className={`${
                theme === "cozy"
                  ? "bg-gradient-to-br from-amber-800/40 to-amber-700/40 rounded-lg p-4 border border-amber-700/20"
                  : "sidebar2 m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4"
              }`}
            >
              <h3 className="font-semibold text-amber-100 mb-4">
                Change the vibe
              </h3>
              <div className="flex flex-wrap gap-2">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-md ${
                      theme === themeOption.id
                        ? `bg-gradient-to-r ${themeOption.color} text-white shadow-lg`
                        : "bg-amber-700/30 text-amber-200 hover:bg-amber-600/40 hover:text-amber-100"
                    }`}
                  >
                    {themeOption.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
