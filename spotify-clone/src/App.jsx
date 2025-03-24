import { useState } from "react";
import React from "react";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import PlayerTest from "./components/PlayerTest";
import ArtistPlayer from "./backend/ArtistData";
import AlbumData from "./backend/AlbumData";
import ArtistData from "./backend/ArtistData";
import LoginButton from "./components/LoginButton";

const App = () => {
  return (
    <div className=" h-screen bg-gradient-to-r from-amber-200 to-pink-400 w-screen">
      <div className="h-[90%] flex">
        <Sidebar />
        <AlbumData />
      </div>
      <LoginButton />
      <ArtistData />
    </div>
  );
};

export default App;
