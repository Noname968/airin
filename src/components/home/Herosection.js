"use client"
import React, { useEffect, useState } from 'react';
import styles from '../../styles/Herosection.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings, useTitle } from '@/lib/store';
import { useStore } from 'zustand';

function Herosection({ data }) {
  const settings = useStore(useSettings, (state) => state.settings);
  const [trailer, setTrailer] = useState(null);
  const [populardata, setpopulardata] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const animetitle = useStore(useTitle, (state) => state.animetitle)

  useEffect(() => {
    const getPopular = () => {
      if (data && Array.isArray(data) && data.length > 0) {
        const filteredData = data.filter(item => item.trailer && item.trailer.id && item.id !== 21 && item.bannerImage !== null && item.status !== 'NOT_YET_RELEASED');
        const randomIndex = Math.floor(Math.random() * filteredData.length);
        setpopulardata(filteredData[randomIndex]);
      }
    };
    getPopular();
  }, [data]);

  useEffect(() => {
    async function fetchTrailer(trailerId) {
      try {
        if (trailerId) {
          const response = await fetch(
            `https://pipedapi.kavin.rocks/streams/${trailerId}`
          );
          const res = await response.json();
          const item = res.videoStreams.find(
            (i) => i.quality === '1080p' && i.format === 'WEBM'
          );
          setTrailer(item.url);
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    }
    if (populardata && populardata.trailer && settings.herotrailer !== false) {
      fetchTrailer(populardata.trailer.id);
    }
  }, [populardata, settings]);

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  const handleVideoError = () => {
    setVideoEnded(true);
  };

  const Month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className={`${styles.herosection}`}>
      <div className={styles.herogradient}></div>
      {trailer && !videoEnded ? (
        <span className={styles.heroimgcon}>
          <video
            src={trailer}
            preload="auto"
            autoPlay
            muted
            className={styles.herovideo}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
          ></video>
          {/* <video src="/youtube/Z11Ozjk0ufY" preload="auto" autoplay="" className={styles.herovideo}></video> */}
        </span>
      ) : (
        <span className={styles.heroimgcon}>
          {populardata &&
            <Image src={populardata?.bannerImage} alt={populardata?.title?.[animetitle] || populardata?.title?.romaji} loading='eager' priority={true} width={200} height={200} className={styles.heroimg} />
          }
        </span>
      )}
      <div className={styles.heroinfo}>
        <h3 className={styles.spotlight}>#{data?.indexOf(populardata) + 1} Trending</h3>
        <h1 className={styles.herotitle}>{populardata?.title?.[animetitle] || populardata?.title?.romaji}</h1>
        <div className={styles.herocontent}>
          <span className='flex'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 mr-1' viewBox="0 0 48 48"><defs><mask id="ipSPlay0"><g fill="none" strokeLinejoin="round" strokeWidth="4"><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path fill="#000" stroke="#000" d="M20 24v-6.928l6 3.464L32 24l-6 3.464l-6 3.464z"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSPlay0)"/></svg>                   
          {populardata?.format}
          </span>
          <span className={`${populardata?.status === 'RELEASING' ? styles.activestatus : styles.notactive}`}>{populardata?.status}</span>
          <span className='flex '>
            <svg className="w-5 h-5 mr-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v12c0 .6.4 1 1 1Z" />
          </svg>
          {Month[populardata?.startDate?.month]} {populardata?.startDate?.day}, {populardata?.startDate?.year}
          </span>
          <span className="flex items-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5 mb-1 mr-1" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z" fill="currentColor"></path></svg>
            {populardata?.nextAiringEpisode?.episode - 1 || populardata?.episodes}</span>
        </div>
        <p className={styles.herodescription}>{populardata?.description.replace(/<.*?>/g, '')}</p>
        <div className={styles.herobuttons}>
          <Link href={`/anime/info/${populardata?.id}`}>
            <button className={styles.watchnowbutton}>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5 mr-1' viewBox="0 0 48 48"><defs><mask id="ipSPlay0"><g fill="none" strokeLinejoin="round" strokeWidth="4"><path fill="#fff" stroke="#fff" d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path fill="#000" stroke="#000" d="M20 24v-6.928l6 3.464L32 24l-6 3.464l-6 3.464z"/></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSPlay0)"/></svg>
              Play Now
              </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Herosection;
