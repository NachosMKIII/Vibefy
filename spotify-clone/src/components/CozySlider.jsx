//CozySlider.jsx
"use client";

const CozySlider = ({
  min,
  max,
  value,
  onChange,
  className = "",
  type = "progress",
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative w-full h-2 group">
        {/* Track background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/40 to-amber-800/40 rounded-full shadow-inner border border-amber-900/20" />

        {/* Progress fill */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-600 via-amber-500 to-green-600 rounded-full shadow-lg transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />

        {/* Glow effect */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400/50 to-green-400/50 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 w-4 h-4 -mt-2 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full shadow-lg border-2 border-amber-200 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />

        {/* Hidden input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default CozySlider;
