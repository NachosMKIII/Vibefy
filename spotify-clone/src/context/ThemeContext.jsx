//ThemeContext.jsx;
import { createContext } from "react";

export const ThemeContext = createContext({
  theme: "cozy, metal",
  setTheme: () => {},
});
