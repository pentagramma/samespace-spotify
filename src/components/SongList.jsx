import React, { useEffect, useState } from 'react';

const SongList = ({ onSelectSong, showTopTracks, searchQuery }) => {
  const [songs, setSongs] = useState([]);
  const [durations, setDurations] = useState({}); // State to hold the durations

  useEffect(() => {
    fetch('https://cms.samespace.com/items/songs')
      .then(response => response.json())
      .then(async data => {
        setSongs(data.data);
        // Fetch durations for each song
        const durationsMap = {};
        for (let song of data.data) {
          const durationInSeconds = await fetchDuration(song.url);
          durationsMap[song.id] = durationInSeconds;
        }
        setDurations(durationsMap);
      })
      .catch(error => console.error('Error fetching songs:', error));
  }, []);

  const fetchDuration = async (url) => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', () => {
        resolve(0);
      });
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredSongs = songs
    .filter(song => showTopTracks ? song.top_track : true)
    .filter(song => song.name.toLowerCase().includes(searchQuery.toLowerCase()) || song.artist.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className='font-inter'>
      {filteredSongs.map(song => (
        <div
          key={song.id}
          className='w-[432px] h-[70px] mb-[10px] bg-transparent flex flex-row justify-between items-center cursor-pointer hover:bg-black px-2 rounded-md hover:duration-300'
          onClick={() => onSelectSong(song)}
        >
          <div className='flex flex-row items-center'>
            <div className='mr-3'>
              <img src={`https://cms.samespace.com/assets/${song.cover}`} alt={`${song.name} cover`} className='w-[48px] h-[48px] rounded-full'/>
            </div>
            <div className='flex flex-col'>
              <h1 className='text-white text-lg name'>{song.name}</h1>
              <h1 className='text-gray-400 text-sm artist'>{song.artist}</h1>
            </div>
          </div>
          <div className='text-gray-400 duration'>
            {durations[song.id] ? formatDuration(durations[song.id]) : 'Loading...'} {/* Show loading until the duration is fetched */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SongList;
