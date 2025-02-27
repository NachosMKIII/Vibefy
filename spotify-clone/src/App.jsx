import { useState } from "react";
import React from "react";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div className="h-screen bg-amber-100">
      <div className="h-[90] flex">
        <Sidebar />
      </div>
    </div>
  );
};

export default App;
