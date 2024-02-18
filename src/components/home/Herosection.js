"use client"

import React, { useEffect, useState } from 'react';
import styles from '../../styles/Herosection.module.css';
import { ContextSearch } from '@/context/DataContext';
import Link from 'next/link'
import Image from 'next/image'

function Herosection({ data }) {
  const [trailer, setTrailer] = useState(null);
  const [populardata, setpopulardata] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [settings, setSettings] = useState({});
  const { animetitle } = ContextSearch();

  useEffect(() => {
    const localStorageValue = localStorage.getItem('settings');
    if (localStorageValue) {
      setSettings(JSON.parse(localStorageValue));
    }
  }, [])

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
          <span><i className="fas fa-play-circle mr-1" aria-hidden></i>{populardata?.format}</span>
          <span className={`${populardata?.status === 'RELEASING' ? styles.activestatus : styles.notactive}`}>{populardata?.status}</span>
          <span><i className="fas fa-calendar mr-1" aria-hidden></i>{Month[populardata?.startDate?.month]} {populardata?.startDate?.day}, {populardata?.startDate?.year}</span>
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
