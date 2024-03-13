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
  const episodesIcon = <svg viewBox="0 0 32 32" className="w-[18px] h-[18px] mr-1" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z" fill="currentColor"></path></svg>;

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