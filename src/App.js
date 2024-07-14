import React, { useState, useEffect } from "react";
import "./App.css";
import Logo from "../src/assets/Logo.svg";
import SongNav from "./components/SongNav";
import SongList from "./components/SongList";
import Mp3 from "./components/Mp3";
import { FaBars } from "react-icons/fa";

function App() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showTopTracks, setShowTopTracks] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentPlayingSongId, setCurrentPlayingSongId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setCurrentPlayingSongId(song.id);
  };

  const handleNextSong = () => {
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    setSelectedSong(songs[nextIndex]);
    setCurrentPlayingSongId(songs[nextIndex].id);
  };

  const handlePreviousSong = () => {
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    setSelectedSong(songs[prevIndex]);
    setCurrentPlayingSongId(songs[prevIndex].id);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300 flex-col md:flex-row">
      <div
        className="dynamic-bg w-full min-h-screen flex flex-col md:flex-row"
        style={backgroundStyle}
      >
        <div className="p-4">
          <img src={Logo} alt="" className="w-32 h-10" />
        </div>
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex flex-col w-full md:w-1/3 items-center p-4">
            <div className="block md:hidden">
              <FaBars
                className="text-white text-2xl cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
            <div
              className={`w-full  mt-[40px] ${
                isMobileMenuOpen ? "block" : "hidden"
              } md:block`}
            >
              <SongNav
                setShowTopTracks={setShowTopTracks}
                showTopTracks={showTopTracks}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <SongList
                songs={songs}
                onSelectSong={handleSelectSong}
                showTopTracks={showTopTracks}
                searchQuery={searchQuery}
                currentPlayingSongId={currentPlayingSongId}
              />
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center p-4 ">
            <Mp3
              selectedSong={selectedSong}
              setDuration={setDuration}
              onNext={handleNextSong}
              onPrev={handlePreviousSong}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
