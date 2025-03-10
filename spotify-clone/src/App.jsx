import { useState } from "react";
import React from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";

const App = () => {
  return (
    <div className="h-screen bg-amber-200">
      <div className="h-[90%] flex">
        <Sidebar />
      </div>
      <Player />
    </div>
  );
};

export default App;
