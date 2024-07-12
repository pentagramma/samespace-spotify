import React from 'react';
import { CiSearch } from "react-icons/ci";

const SongNav = ({ setShowTopTracks, showTopTracks, searchQuery, setSearchQuery }) => {
  return (
    <div className='font-inter'>
      <div className='flex flex-row font-inter font-[700]'>
        <h1 
          className={`text-[24px] cursor-pointer ${!showTopTracks ? 'text-white' : 'text-white opacity-[50%]'}`} 
          onClick={() => setShowTopTracks(false)}
        >
          For You
        </h1>
        <h1 
          className={`ml-[50px] text-[24px] cursor-pointer ${showTopTracks ? 'text-white' : 'text-white opacity-[50%]'}`} 
          onClick={() => setShowTopTracks(true)}
        >
          Top Tracks
        </h1>
      </div>
      <div className='flex justify-start items-center mt-[40px]'>
        <div className='relative w-[400px]'>
          <input 
            type="text" 
            placeholder='Search Song, Artist' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-[400px] h-[48px] bg-[#FFFFFF] bg-opacity-[8%] px-3 py-2 rounded-md pr-10 flex items-center text-[18px] text-white'
            style={{display: 'flex', alignItems: 'center'}}
          />
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:scale-110 duration-300'>
            <CiSearch className='text-white text-xl size-[28px]'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongNav;
