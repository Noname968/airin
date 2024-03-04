"use client"
"use strict"; // Add strict mode

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../../styles/PlayAnimeCard.module.css';
import Link from 'next/link';
import { useTitle } from '../../lib/store';
import { useStore } from "zustand";

function PlayerAnimeCard({ data, id }) {
  const animetitle = useStore(useTitle, (state) => state.animetitle);
  const [visibleItems, setVisibleItems] = useState(4);
  const episodesIcon = <i className="fas fa-closed-captioning mr-1" aria-hidden="true"></i>;

  useEffect(() => {
    if (id === 'Recommendations') {
      setVisibleItems(15)
    }
  }, [data])

  const handleShowMore = () => {
    setVisibleItems(data.length);
  };

  const handleShowLess = () => {
    setVisibleItems(4);
  };

  return (
    <>
    <div className='px-[10px] mb-[8px] mx-0 mt-0 leading-tight lg:px-[2px] lg:mx-2 flex items-center gap-2'>
    <span className="h-6 md:h-8 rounded-md w-[.35rem] md:w-[.3rem] bg-white "></span>
      <h2 className=" lg:text-[22px] text-[21px]">{id}</h2>
    </div>
    <div className={styles.playanimecard}>
      {data && data?.slice(0, visibleItems).map((item) => (
        <div className={styles.playcarditem} key={item?.node?.id || item?.mediaRecommendation?.id}>
          <div className={styles.playcardimgcon}>

            {item?.node?.format?.toLowerCase() === 'manga' || item?.node?.format?.toLowerCase() === 'novel' ? (
              <Image
                src={item?.node?.coverImage?.large || item?.mediaRecommendation?.coverImage?.extraLarge}
                width={70}
                height={90}
                alt='image'
                className={styles.playcardimg}
              />
            ) : (
              <Link href={`/anime/info/${item?.node?.id || item?.mediaRecommendation?.id}`}>
                <Image
                  src={item?.node?.coverImage?.large || item?.mediaRecommendation?.coverImage?.extraLarge}
                  width={70}
                  height={90}
                  alt='image'
                  className={styles.playcardimg}
                />              
              </Link>
            )}

          </div>
          <div className={styles.playcardinfo}>
            <p className={styles.playcardrelation}>{item?.relationType}</p>
            {item?.node?.format?.toLowerCase() === 'manga' || item?.node?.format?.toLowerCase() === 'novel' ? (
              <span className={styles.playcardtitle}>{item?.node?.title?.[animetitle] || item?.mediaRecommendation?.title?.[animetitle] || item?.node?.title?.romaji || item?.mediaRecommendation?.title?.romaji}</span>
            ) : (
              <Link href={`/anime/info/${item?.node?.id || item?.mediaRecommendation?.id}`}>
                <p className={styles.playcardtitle}>{item?.node?.title?.[animetitle] || item?.mediaRecommendation?.title?.[animetitle] || item?.node?.title?.romaji || item?.mediaRecommendation?.title?.romaji}</p>
              </Link>
            )}
            <p className={styles.playepnum}>
              {item?.node?.format || item?.mediaRecommendation?.format} <span>.</span>
              {item?.node ? (
                item?.node?.episodes && (
                  <>
                    {episodesIcon}
                    {item?.node?.episodes}
                  </>
                ) ||
                (item?.node?.chapters && `${item?.node?.chapters} CH`) ||
                '?'
              ) : (
                item?.mediaRecommendation?.episodes !== undefined && (
                  <>
                    {episodesIcon}
                    {item?.mediaRecommendation?.episodes}
                  </>
                )
              )}
              <span>.</span> {item?.node?.status || item?.mediaRecommendation?.status || ''}
            </p>
          </div>
        </div>
      ))}

      {id !== 'Recommendations' && data.length > visibleItems && (
        <div className={styles.showButton} onClick={handleShowMore}>
          Show More
        </div>
      )}

      {id !== 'Recommendations' && visibleItems > 5 && (
        <div className={styles.showButton} onClick={handleShowLess}>
          Show Less
        </div>
      )}
    </div>
    </>
  );
}

export default PlayerAnimeCard;