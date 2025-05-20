//ThemeContext.jsx;
import { createContext } from "react";

export const ThemeContext = createContext({
  theme: ["cozy", "rock-metal"],
  setTheme: () => {},
});
