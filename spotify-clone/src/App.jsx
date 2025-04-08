//App.jsx
import React from "react";
import Sidebar from "./components/Sidebar";
import AlbumData from "./backend/AlbumData";
import LoginButton from "./components/LoginButton";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Callback from "./backend/Callback";
import Player from "./components/Player";

const App = () => {
  const accessToken = localStorage.getItem("access_token");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-screen bg-gradient-to-r from-amber-200 to-pink-400 w-screen overflow-hidden">
              <div className="h-[90%] flex">
                <Sidebar />
                {accessToken ? (
                  <div className="flex-1 overflow-x-auto">
                    <AlbumData />
                    <AlbumData />
                  </div>
                ) : (
                  <div>Please log in to see albums.</div>
                )}
              </div>
              <LoginButton />
              {accessToken && <Player />}
            </div>
          }
        />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
};

export default App;
