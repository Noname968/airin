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
          <span><i className="fas fa-play-circle mr-1" aria-hidden="true"></i>{populardata?.format}</span>
          <span className={`${populardata?.status === 'RELEASING' ? styles.activestatus : styles.notactive}`}>{populardata?.status}</span>
          <span className='flex '><svg className="w-5 h-5 mr-1 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16M8 14h8m-4-7V4M7 7V4m10 3V4M5 20h14c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1H5a1 1 0 0 0-1 1v12c0 .6.4 1 1 1Z" />
          </svg>{Month[populardata?.startDate?.month]} {populardata?.startDate?.day}, {populardata?.startDate?.year}</span>
          <span className={styles.herosub}><i className="fas fa-closed-captioning mr-1" aria-hidden></i>{populardata?.nextAiringEpisode?.episode - 1 || populardata?.episodes}</span>
        </div>
        <p className={styles.herodescription}>{populardata?.description.replace(/<.*?>/g, '')}</p>
        <div className={styles.herobuttons}>
          <Link href={`/anime/info/${populardata?.id}`}>
            <button className={styles.watchnowbutton}><i className="fas fa-play-circle mr-2" aria-hidden></i>Play Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Herosection;
