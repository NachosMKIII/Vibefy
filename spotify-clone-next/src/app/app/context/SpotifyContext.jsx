// SpotifyContext.jsx
import { createContext } from "react";

export const SpotifyContext = createContext({
  deviceId: null,
  player: null,
  isPlayerReady: false,
});
