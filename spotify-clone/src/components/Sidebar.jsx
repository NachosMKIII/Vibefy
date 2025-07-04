//Sidebar.jsx
import React from "react";
import { assets } from "../assets/assets/assets";
//lucide-react icons
import { BookHeadphones } from "lucide-react";
import { Search } from "lucide-react";
import { House } from "lucide-react";
//end of lucide-react icons
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { SpotifyContext } from "../context/SpotifyContext";
import { useSpotifyApi } from "../backend/Auth";
import "./experimental-theme/sidebar.css";
import "./cozy-theme/sidebar.css";
import "./metal-rock-theme/sidebar.css";

const Sidebar = ({ playbackState }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const makeApiCall = useSpotifyApi();
  const { deviceId } = useContext(SpotifyContext);
  const themeAlbums = {
    cozy: [
      "7DxmOS2dKJgTfLLRNOP4ch",
      "1K6TvnkvmnLKPhifmPb6N7",
      "6EtrZFZ6FMR6fbB82oHUWi",
      "38NEzyo2N5T68j7aFetd4x",
      "0AL7olZ75pi55q9p1eHaD8",
      "1aFyAtSRxLNzSTGwHMRvWj",
      "0vhRTvVCv9O5orRMgFjxT1",
      "02UhY4AQiAry5S2ZpgEKIt",
      "2kz6FGzMkZUyGZPywlkcOu",
      "60EzsIzS77S9MWHT0Tm37s",
    ],
    "rock-metal": [
      "2kcJ3TxBhSwmki0QWFXUz8",
      "08pnia1NUFsyIWfhE9sZz1",
      "1QJmLRcuIMMjZ49elafR3K",
      "1XkGORuUX2QGOEIL4EbJKm",
      "1gsoIHeBan6QywhysNgApK",
      "5sMSJ6uAozdrqFELMwl3NU",
      "1j57Q5ntVi7crpibb0h4sv",
      "6a5n1Frj3nxGcyTqT1xfrg",
      "5XgUtV3205kTcgoSLNf8ix",
      "6DJwvB2iCquvxxrXRW0cFz",
      "3HFbH1loOUbqCyPsLuHLLh",
      "7izZDSBxj6nB2PieJo6U0u",
      "7rSZXXHHvIhF4yUFdaOCy9",
    ],
    experimental: [
      "4LileDrFwEUFB5UPA3AEia",
      "2yAO7HQOfO4t146QLyK26a",
      "7izZDSBxj6nB2PieJo6U0u",
      "4T95uimM0PQNgAkcyLTym0",
      "63TYyeXlBYoYKNvE6rT3hI",
      "1vWOYk3hF5bgVUUUaPvYLh",
      "2TN3NIEBmAOGWmvP96DFs5",
      "6wRDKCpKw3ap6dhkpdXNIN",
      "0VDB8LxXpOS8qQeiab3LqG",
      "7GjVWG39IOj4viyWplJV4H",
      "3ddMQ2PZjiD8Zxm0lu92rb",
      "1WwiyWxa40PKucRxIKlEVM",
    ],
    null: [
      "7DxmOS2dKJgTfLLRNOP4ch",
      "1K6TvnkvmnLKPhifmPb6N7",
      "6EtrZFZ6FMR6fbB82oHUWi",
      "38NEzyo2N5T68j7aFetd4x",
      "0AL7olZ75pi55q9p1eHaD8",
      "1aFyAtSRxLNzSTGwHMRvWj",
      "0vhRTvVCv9O5orRMgFjxT1",
      "02UhY4AQiAry5S2ZpgEKIt",
      "2kz6FGzMkZUyGZPywlkcOu",
      "60EzsIzS77S9MWHT0Tm37s",
    ],
  };

  const handleRandomSong = async () => {
    const albums = themeAlbums[theme];
    if (!albums || albums.length === 0) {
      console.error("No albums for the selected theme");
      return;
    }
    const randomAlbumId = albums[Math.floor(Math.random() * albums.length)];
    try {
      const tracksResponse = await makeApiCall(
        `https://api.spotify.com/v1/albums/${randomAlbumId}/tracks`
      );
      const tracks = tracksResponse.items;
      if (!tracks || tracks.length === 0) {
        console.error("No tracks found for the album");
        return;
      }
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      const trackUri = randomTrack.uri;
      if (!deviceId) {
        console.error("No device ID available");
        return;
      }
      await makeApiCall(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [trackUri] }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error playing random song:", error);
    }
  };

  return (
    <div
      className={`main-sidebar sidebar w-[20%] h-[130%] mr-5 p-2 flex-col gap-2 hidden lg:flex    
        ${theme}`}
    >
      <div className="sidebar1 h-[15%] rounded flex flex-col justify-around">
        <div className="flex items-center gap-3 ml-4 cursor-pointer">
          <House className="w-8 h-8 cursor-pointer" />
          <p className="font-bold">Home</p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <Search className="w-8 h-8 cursor-pointer" />
          <p className="font-bold cursor-pointer">Search</p>
        </div>
      </div>
      <div className="sidebar1 h-[70%] rounded ">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookHeadphones className="w-12 h-12 -ml-1 -mb-4 cursor-pointer" />
          </div>
        </div>

        <div
          className="p-4 sidebar2a m-2 rounded font-semibold flex flex-col items-start h-[160px] justify-start gap-1 pl-4 mt-4
        "
        >
          <h1>Get a random song from the {theme} vibe</h1>
          <button
            onClick={handleRandomSong}
            className="button1 px-4 py-1.5 text-[15px] rounded-full mt-4 cursor-pointer 
          "
          >
            Random song
          </button>
        </div>
        <div
          className="p-4 sidebar2a m-2 rounded font-semibold h-[160px]  flex flex-col items-start justify-start gap-1 pl-4 mt-4
        "
        >
          <h1>Create a playlist with your desired songs</h1>
          <button
            className="button1 px-4 py-1.5 text-[15px] rounded-full mt-4 cursor-pointer 
          "
          >
            Button
          </button>
        </div>
        <div
          className="p-4 sidebar2b m-2 rounded h-[160px]  font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4
        "
        >
          <h1>Change the vibe</h1>
          <div>
            <button
              onClick={() => setTheme("cozy")}
              className="button2 px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer mr-2 hover:scale-105 shadow-md
              "
            >
              Cozy
            </button>
            <button
              onClick={() => setTheme("rock-metal")}
              className="button2 px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer mr-2 hover:scale-105 shadow-md
              "
            >
              Rock-Metal
            </button>
            <button
              onClick={() => setTheme("experimental")}
              className="button2 px-4 py-1.5 text-[15px] rounded-full mt-2 cursor-pointer hover:scale-105 shadow-md
              "
            >
              Experimental
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
