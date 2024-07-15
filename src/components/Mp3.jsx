import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import Next from '../assets/next.png';
import Back from '../assets/prev.png';
import { FaCirclePlay } from "react-icons/fa6";
import Sound from '../assets/sound.png';
import { MdPauseCircle } from "react-icons/md";
import Options from '../assets/options.png';

const Mp3 = ({ selectedSong, setDuration, onNext, onPrev }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSoundbarOpen, setIsSoundbarOpen] = useState(false);
  const [volume, setVolume] = useState(50); // Initial volume set to 50%
  const [hasInteracted, setHasInteracted] = useState(false);
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
      if (isPlaying) {
        if (!hasInteracted) {
          // Add user interaction check
          const handleUserInteraction = () => {
            audioRef.current.play();
            setHasInteracted(true);
            document.removeEventListener('click', handleUserInteraction);
          };
          document.addEventListener('click', handleUserInteraction);
        } else {
          audioRef.current.play();
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, hasInteracted]);

  useEffect(() => {
    if (selectedSong && audioRef.current) {
      audioRef.current.src = selectedSong.url;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setDuration(audioRef.current.duration);
        setHasInteracted(true); // Consider it interacted if play is successful
      }).catch(error => {
        console.error("Error attempting to play:", error);
        setIsPlaying(false); // Reset play state if play fails
      });
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

  const toggleSoundbar = () => {
    setIsSoundbarOpen(!isSoundbarOpen);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className='text-white lg:ml-[200px] md:ml-[200px] mt-[70px] flex-col font-inter'>
      <div className='flex flex-col'>
        <h1 className='text-[32px] font-[700]'>
          {selectedSong ? selectedSong.name : 'Select a song'}
        </h1>
        <h2 className='text-[16px] opacity-[60%] font-[400]'>
          {selectedSong ? selectedSong.artist : ''}
        </h2>
      </div>
      <div className='w-[300px] h-[300px] md:w-[480px] md:h-[480px] mt-[32px]'>
        {selectedSong && (
          <img
            src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
            alt={`${selectedSong.name} cover`}
            className='w-full h-full object-cover rounded-md'
          />
        )}
      </div>
      <div className='flex flex-col items-center justify-center mt-[15px] w-[300px] md:w-[480px]'>
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
          <span className='song-duration'>{formatTime(audioRef.current?.duration || 0)}</span>
        </div>
        <div className='mt-7 flex justify-between w-full items-center'>
          <div>
            <img src={Options} alt="" className='cursor-pointer hover:scale-110 hover:duration-300'/>
          </div>
          <div className='flex flex-row items-center'>
            <img
              src={Back}
              alt=""
              className='mx-4 cursor-pointer hover:scale-110 hover:duration-300'
              onClick={onPrev}
            />
            <div
              className='mx-4 cursor-pointer hover:scale-110 hover:duration-300'
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <MdPauseCircle className='w-12 h-12 size-[48px]'/>
              ) : (
                <FaCirclePlay alt="" className='w-12 h-12 size-[48px]'/>
              )}
            </div>
            <img
              src={Next}
              alt=""
              className='mx-4 cursor-pointer hover:scale-110 hover:duration-300'
              onClick={onNext}
            />
          </div>
          <div className='relative'>
            <img
              src={Sound}
              alt=""
              className='cursor-pointer hover:scale-110 hover:duration-300'
              onClick={toggleSoundbar}
            />
            {isSoundbarOpen && (
              <div className='absolute bottom-8 right-0 w-[100px] mb-2'>
                <input
                  type='range'
                  min='0'
                  max='100'
                  value={volume}
                  onChange={handleVolumeChange}
                  className='custom-slider w-full'
                />
                <div className='text-white text-xs mt-1'>{volume}%</div>
              </div>
            )}
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
