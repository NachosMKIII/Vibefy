import { useState } from "react";
import React from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import PlayerTest from "./components/PlayerTest";
import ArtistPlayer from "./backend/ArtistData";
import AlbumData from "./backend/AlbumData";

const App = () => {
  return (
    <div className="bg-amber-200 h-screen">
      <div className="h-[90%] flex">
        <Sidebar />
        <AlbumData />
      </div>

      <ArtistPlayer />
    </div>
  );
};

export default App;
