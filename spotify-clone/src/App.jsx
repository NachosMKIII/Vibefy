import React from "react";
import Sidebar from "./components/Sidebar";
import AlbumData from "./backend/AlbumData";
import ArtistData from "./backend/ArtistData";
import LoginButton from "./components/LoginButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./backend/Callback";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main Route */}
        <Route
          path="/"
          element={
            <div className="h-screen bg-gradient-to-r from-amber-200 to-pink-400 w-screen">
              <div className="h-[90%] flex">
                <Sidebar />
                <AlbumData />
              </div>
              <LoginButton />
              <ArtistData />
            </div>
          }
        />
        {/* Callback Route for Spotify Login */}
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
};

export default App;
