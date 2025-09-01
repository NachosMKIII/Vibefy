// src//app/context/PlaylistContext.jsx
import { createContext } from "react";

export const PlaylistContext = createContext({
  playlist: [],
  addTrack: () => {},
  removeTrack: () => {},
});
