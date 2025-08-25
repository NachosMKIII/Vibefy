//Slider.jsx
import React from "react";

const Slider = ({
  min,
  max,
  value,
  onChange,
  onMouseDown,
  onMouseUp,
  className = "",
  type = "progress",
  theme,
}) => {
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;

  // Define theme-specific colors
  let trackBg, progressBg, glowBg, thumbBg;
  if (theme === "cozy") {
    trackBg = "from-amber-900/50 to-green-900/50";
    progressBg = "from-amber-400 via-green-500 to-green-400";
    glowBg = "from-amber-300/60 to-green-300/60";
    thumbBg = "from-amber-300 to-green-300";
  } else if (theme === "rock-metal") {
    trackBg = "from-slate-800/50 to-slate-700/50";
    progressBg = "from-slate-400 via-cyan-500 to-slate-500";
    glowBg = "from-slate-300/60 to-cyan-400/60";
    thumbBg = "from-slate-300 to-cyan-400";
  } else if (theme === "experimental") {
    trackBg = "from-yellow-900/50 to-orange-800/50 border border-yellow-700/30";
    progressBg = "from-yellow-400 via-orange-500 to-yellow-600";
    glowBg = "from-yellow-300/70 to-orange-400/70";
    thumbBg = "from-yellow-300 to-orange-500";
  } else {
    trackBg = "from-amber-900/50 to-green-900/50";
    progressBg = "from-amber-400 via-green-500 to-green-400";
    glowBg = "from-amber-300/60 to-green-300/60";
    thumbBg = "from-amber-300 to-green-300";
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative w-full h-2 group">
        {/* Track background */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${trackBg} rounded-full shadow-inner`}
        />

        {/* Progress fill */}
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${progressBg} rounded-full shadow-lg transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />

        {/* Glow effect */}
        <div
          className={`absolute left-0 top-0 h-full bg-gradient-to-r ${glowBg} rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className={`absolute top-1/2 w-4 h-4 -mt-2 bg-gradient-to-br ${thumbBg} rounded-full shadow-lg border-2 border-slate-200 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110`}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />

        {/* Hidden input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Slider;
