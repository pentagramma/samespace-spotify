import React, { useEffect, useState } from 'react';

const SongList = ({ songs, onSelectSong, showTopTracks, searchQuery, currentPlayingSongId }) => {
  const [durations, setDurations] = useState({});

  useEffect(() => {
    const fetchDurations = async () => {
      const durationsMap = {};
      for (let song of songs) {
        const durationInSeconds = await fetchDuration(song.url);
        durationsMap[song.id] = durationInSeconds;
      }
      setDurations(durationsMap);
    };

    fetchDurations();
  }, [songs]);

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
    <div className='font-inter mt-4'>
      {filteredSongs.map(song => (
        <div
          key={song.id}
          className={`w-[432px] h-[70px] mb-[8px] bg-transparent flex flex-row justify-between items-center cursor-pointer px-2 rounded-md hover:duration-300 hover:bg-white hover:bg-opacity-[4%] ${currentPlayingSongId === song.id ? 'bg-white bg-opacity-[8%]' : ''}`}
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
            {durations[song.id] ? formatDuration(durations[song.id]) : 'Loading...'}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SongList;
