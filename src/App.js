import React, { useState } from "react";
import "./App.css";
import Logo from "../src/assets/Logo.svg";
import SongNav from "./components/SongNav";
import SongList from "./components/SongList";
import Mp3 from "./components/Mp3";

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [duration, setDuration] = useState(0); // Added duration state

  const backgroundStyle = selectedSong
    ? { background: `linear-gradient(to right, ${selectedSong.accent}, black)` }
    : { background: "linear-gradient(to right, #33425E, black)" };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300 flex-row">
      <div
        className="dynamic-bg w-[1512px] h-[895px] flex flex-row"
        style={backgroundStyle}
      >
        <div className="mr-[130px] mt-[32px] ml-[32px]">
          <img src={Logo} alt="" className="w-[133.41px] h-[40px]" />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col w-[432px] h-full items-center">
            <div className="mt-[32px]">
              <SongNav
                setShowTopTracks={setShowTopTracks}
                showTopTracks={showTopTracks}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <div className="flex justify-start mt-[32px]">
              <SongList
                onSelectSong={setSelectedSong}
                showTopTracks={showTopTracks}
                searchQuery={searchQuery}
              />
            </div>
          </div>
          <div>
            <Mp3 selectedSong={selectedSong} setDuration={setDuration} />{" "}
            {/* Pass setDuration to Mp3 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
