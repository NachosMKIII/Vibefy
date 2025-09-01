// src//app/context/ThemeContext.jsx;
import { createContext } from "react";

export const ThemeContext = createContext({
  theme: ["cozy", "rock-metal", "experimental"],
  setTheme: () => {},
});
