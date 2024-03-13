"use client"
import React, { useState, useEffect } from 'react';
import styles from '../../styles/VerticalList.module.css';
import Link from 'next/link';
// import Image from 'next/image';
import { useTitle } from '@/lib/store';
import { useStore } from 'zustand';

const VerticalList = ({ data, id, mobiledata }) => {
  const animetitle = useStore(useTitle, (state) => state.animetitle);
  const [maxWidth, setMaxWidth] = useState(0);
  const [isSeasonal, setIsSeasonal] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setMaxWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const convertMinutesToHoursAndMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour, ${remainingMinutes} mins`;
  };

  const getColorStyle = (coverColor) => {
    return maxWidth <= 900
      ? { backgroundColor: coverColor, color: 'black' }
      : { backgroundColor: 'transparent', color: coverColor };
  };

  const handleButtonClick = () => {
    setIsSeasonal((prevIsSeasonal) => !prevIsSeasonal);
  };

  const currentData = isSeasonal ? data : mobiledata;

  return (
    <div className={styles.verticalcard} style={{ display: id === "Seasonal Anime" && maxWidth < 1024 ? 'none' : 'flex' }}>
      <div className={styles.tophead}>
        <span className={styles.bar}></span><h1 className={styles.headtitle}>{id}</h1>

      </div>
      <div className={styles.mobiletop}>
        <div className='flex flex-row gap-[8px] items-center'>
          <span className={styles.bar}></span>
          <h1 className={styles.mobiletitle}>Top Anime</h1>
        </div>
        <button onClick={handleButtonClick} className={styles.mobilebtn}>
          {isSeasonal ? 'All Time' : 'Seasonal'}
        </button>
      </div>
      {currentData?.map((anime, index) => (
        <div className={`${styles.vcarditem} group`} key={anime.id}>
          {/* <div className="absolute -top-10 -left-[90px] opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 z-9">
            <Image alt="20" loading="lazy" width={1000} height={1000} decoding="async" className="object-cover h-[170px] w-[120px] shrink-0 rounded-md" src={anime.coverImage.large}/>
            </div>       */}
          <div
            className={styles.vcardindex}
            style={index < 3 ? getColorStyle(anime.coverImage.color) : {}}
          >
            #{index + 1}
          </div>
          <div className={styles.vcardcontent}>
            <div className={styles.vcardleft}>
              <img
                src={anime?.coverImage?.large}
                alt=""
                className={styles.vcardimg}
              />
              <div className={styles.vcardinfo}>
                <div className={styles.linktitle}>
                  <Link
                    href={`/anime/info/${anime.id}`}
                    onMouseOver={(e) =>
                      (e.target.style.color = `${anime.coverImage.color}`)
                    }
                    onMouseOut={(e) => (e.target.style.color = 'white')}
                  >
                    {anime.title[animetitle] || anime.title.romaji}
                  </Link>
                </div>
                <div className={styles.vcardleftb}>
                  <span className={styles.score}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[14px] h-[14px] mt-[1px] mr-[2px]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    {anime.averageScore ? `${anime.averageScore / 10}` : 'NA'}
                  </span>
                  <span className={styles.dot}>.</span>
                  <span className={styles.season}>
                    {anime.season}
                  </span>
                  <span className={styles.dot}>.</span>
                  <span
                    className={
                      anime.status === 'RELEASING'
                        ? styles.vstatusc
                        : styles.vstatus
                    }
                  >
                    {anime.status}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.vcardright}>
              <div className={styles.vpopular}>
                <span className={styles.format}>
                  {anime.format === 'TV'
                    ? anime.format + ' Show'
                    : anime.format}
                </span>
                <div className={styles.vcardformat}>
                  {anime.episodes === 1 ? (
                    <span className={styles.bpopular}>
                      {convertMinutesToHoursAndMinutes(anime.duration) || 'NA'}
                    </span>
                  ) : (
                    <span className={styles.bpopular}>
                      {anime.episodes
                        ? `${anime.episodes} episodes`
                        : 'Unknown'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerticalList;
