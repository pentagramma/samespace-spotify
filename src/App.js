import React, { useState, useEffect } from "react";
import "./App.css";
import Logo from "../src/assets/Logo.svg";
import SongNav from "./components/SongNav";
import SongList from "./components/SongList";
import Mp3 from "./components/Mp3";

function App() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentPlayingSongId, setCurrentPlayingSongId] = useState(null); // State to track currently playing song ID

  const backgroundStyle = selectedSong
    ? { background: `linear-gradient(to right, ${selectedSong.accent}, black)` }
    : { background: "linear-gradient(to right, #33425E, black)" };

  useEffect(() => {
    fetch("https://cms.samespace.com/items/songs")
      .then((response) => response.json())
      .then((data) => {
        setSongs(data.data);
        setSelectedSong(data.data[0]);
      })
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  const handleSelectSong = (song) => {
    const index = songs.findIndex((s) => s.id === song.id);
    setCurrentSongIndex(index);
    setSelectedSong(song);
    setCurrentPlayingSongId(song.id); // Update currently playing song ID
  };

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setSelectedSong(songs[nextIndex]);
    setCurrentPlayingSongId(songs[nextIndex].id); // Update currently playing song ID
  };

  const handlePreviousSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setSelectedSong(songs[prevIndex]);
    setCurrentPlayingSongId(songs[prevIndex].id); // Update currently playing song ID
  };

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
                songs={songs}
                onSelectSong={handleSelectSong}
                showTopTracks={showTopTracks}
                searchQuery={searchQuery}
                currentPlayingSongId={currentPlayingSongId} // Pass currently playing song ID
              />
            </div>
          </div>
          <div>
            <Mp3
              selectedSong={selectedSong}
              setDuration={setDuration}
              onNext={handleNextSong}
              onPrev={handlePreviousSong}
              setCurrentPlayingSongId={setCurrentPlayingSongId} // Pass function to update currently playing song ID
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
