import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import Next from '../assets/next.png';
import Back from '../assets/prev.png';
import { IoSettingsOutline } from "react-icons/io5";
import Sound from '../assets/sound.png';
import { MdPauseCircle, MdPlayCircle } from "react-icons/md";
import Options from '../assets/options.png'

const Mp3 = ({ selectedSong, setDuration }) => { // Receive setDuration as a prop
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Current time of the song in seconds
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const slider = document.querySelector('.custom-slider');
    if (slider) {
      slider.style.setProperty('--value', `${sliderValue}%`);
    }
  }, [sliderValue]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (selectedSong && audioRef.current) {
      audioRef.current.src = selectedSong.url;
      audioRef.current.play();
      setIsPlaying(true);
      setDuration(audioRef.current.duration); // Set the duration of the song
    }
  }, [selectedSong, setDuration]);

  useEffect(() => {
    const updateSlider = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setSliderValue((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
      animationRef.current = requestAnimationFrame(updateSlider);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateSlider);
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  const handleSliderChange = (e) => {
    const newValue = e.target.value;
    setSliderValue(newValue);
    if (audioRef.current) {
      audioRef.current.currentTime = (newValue / 100) * audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className='text-white ml-[200px] mt-[101px] flex-col font-inter'>
      <div className='flex flex-col'>
        <h1 className='text-[32px] font-[700]'>
          {selectedSong ? selectedSong.name : 'Select a song'}
        </h1>
        <h2 className='text-[16px] opacity-[60%] font-[400]'>
          {selectedSong ? selectedSong.artist : ''}
        </h2>
      </div>
      <div className='w-[480px] h-[480px] mt-[32px]'>
        {selectedSong && (
          <img
            src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
            alt={`${selectedSong.name} cover`}
            className='w-full h-full object-cover'
          />
        )}
      </div>
      <div className='flex flex-col items-center justify-center mt-[15px] w-[480px]'>
        <div className='slider w-full h-[6px]'>
          <input
            type='range'
            min='0'
            max='100'
            value={sliderValue}
            onChange={handleSliderChange}
            className='custom-slider w-full'
          />
        </div>
        <div className='time flex justify-between w-full text-sm mt-5'>
          <span>{formatTime(currentTime)}</span>
          <span className='song-duration'>{formatTime(audioRef.current?.duration || 0)}</span> {/* Updated */}
        </div>
        <div className='mt-4 flex justify-between w-full items-center'>
        <div>
          <img src={Options} alt="" />
        </div>
          <div className='flex flex-row items-center'>
            <img src={Back} alt="" className='mx-4 cursor-pointer hover:scale-110 hover:duration-300'/>
            <div className='mx-4 cursor-pointer hover:scale-110 hover:duration-300' onClick={handlePlayPause}>
              {isPlaying ? (
                <MdPauseCircle className='w-12 h-12 text-white'/>
              ) : (
                <MdPlayCircle alt="" className='w-12 h-12'/>
              )}
            </div>
            <img src={Next} alt="" className='mx-4 cursor-pointer hover:scale-110 hover:duration-300'/>
          </div>
          <div className=''>
            <img src={Sound} alt="" className='cursor-pointer hover:scale-110 hover:duration-300'/>
          </div>
        </div>
      </div>
      {selectedSong && (
        <audio ref={audioRef} src={selectedSong.url} onLoadedMetadata={() => setDuration(audioRef.current.duration)} />
      )}
    </div>
  );
}

export default Mp3;
