//Main.jsx
"use client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./page.jsx";
import React from "react";

const Main = () => {
  return createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

export default Main;
