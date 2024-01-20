"use client"
import React, { useRef, useState } from 'react';
import styles from '../../styles/Animecard.module.css';
import { useDraggable } from 'react-use-draggable-scroll';
import Link from 'next/link';
import ItemContent from './ItemContent';

function Animecards({ data, cardid, show=true }) {
  const containerRef = useRef();
  const { events } = useDraggable(containerRef);
  const [isLeftArrowActive, setIsLeftArrowActive] = useState(false);
  const [isRightArrowActive, setIsRightArrowActive] = useState(false);

  function handleScroll() {
    const container = containerRef.current;
    const scrollPosition = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setIsLeftArrowActive(scrollPosition > 30);
    setIsRightArrowActive(scrollPosition < maxScroll - 30);
  }

  const smoothScroll = (amount) => {
    const container = containerRef.current;
    const cont = document.getElementById(cardid);

    if (cont && container) {
      cont.classList.add('scroll-smooth');
      container.scrollLeft += amount;

      setTimeout(() => {
        cont.classList.remove('scroll-smooth');
      }, 300);
    }
  };


  function scrollLeft() {
    smoothScroll(-500);
  }

  function scrollRight() {
    smoothScroll(+500);
  }

  return (
    <div className={styles.animecard}>
    {show && (
        <div className={styles.cardhead}>
        <span className={styles.bar}></span>
        <h1 className={styles.headtitle}>{cardid}</h1>
      </div>
    )}
      <div className={styles.animeitems}>
        <span className={`${styles.leftarrow} ${isLeftArrowActive ? styles.active : styles.notactive}`}>
          <svg onClick={scrollLeft} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="m15 18-6-6 6-6"></path></svg>
        </span>
        <span className={`${styles.rightarrow} ${isRightArrowActive ? styles.active : styles.notactive}`}>
          <svg onClick={scrollRight} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="m9 18 6-6-6-6"></path></svg>
        </span>
        <div className={styles.cardcontainer} id={cardid} {...events} ref={containerRef} onScroll={handleScroll}>
          {cardid === 'Recent Episodes' ? (
            data?.map((item) => {
              const anime = {
                id: item.id || '',
                coverImage: item?.coverImage || '',
                title: item.title || '',
                status: item.status || '',
                format: item.format || '',
                episodes: item?.episodes || '',
                totalEpisodes: item?.totalEpisodes || '',
                currentEpisode: item?.currentEpisode || ''
              };
              const gogoEpisodes = item?.episodes?.data?.find(
                (x) => x.providerId === "gogoanime"
              );
              const currentEpisode = gogoEpisodes?.episodes?.find(
                (x) => x.number === item.currentEpisode
              );
              return (
                <Link href={`/anime/watch/${anime.id}/gogoanime/${item?.currentEpisode}?epid=${encodeURIComponent(currentEpisode?.id)}&type=sub`} key={anime.id}>
                  <ItemContent anime={anime} cardid={cardid} />
                </Link>
              );
            })
          ) : (
            cardid === 'Recommendations' ? (
              data?.map((item) => {
                const anime = {
                  id: item?.mediaRecommendation?.id || '',
                  coverImage: item?.mediaRecommendation?.coverImage?.extraLarge || '',
                  title: item?.mediaRecommendation?.title || '',
                  status: item?.mediaRecommendation?.status || '',
                  format: item?.mediaRecommendation?.format || '',
                  episodes: item?.mediaRecommendation?.episodes || '',
                  nextAiringEpisode: item?.mediaRecommendation?.nextAiringEpisode || ''
                };
                return (
                  <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                    <ItemContent anime={anime} cardid={cardid} />
                  </Link>
                );
              })
            ) : (
            cardid === 'Related Anime' ? (
              data?.map((item) => {
                const anime = {
                  id: item?.node?.id || '',
                  coverImage: item?.node?.coverImage?.extraLarge || '',
                  title: item?.node?.title || '',
                  status: item?.node?.status || '',
                  format: item?.node?.format || '',
                  episodes: item?.node?.episodes || '',
                  nextAiringEpisode: item?.node?.nextAiringEpisode || '',
                  relationType : item?.relationType || ''
                };
                return (
                  <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                    <ItemContent anime={anime} cardid={cardid} />
                  </Link>
                );
              })
            ) : (
              data?.map((item) => {
                const anime = {
                  id: item.id || '',
                  coverImage: item?.coverImage?.extraLarge || item?.coverImage?.large || '',
                  title: item.title || '',
                  status: item.status || '',
                  format: item.format || '',
                  episodes: item?.episodes || '',
                  nextAiringEpisode: item?.nextAiringEpisode || '',
                };
                return (
                  <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                    <ItemContent anime={anime} cardid={cardid} />
                  </Link>
                );
              })
            )
            )
          )}
          {!data?.length && (
            Array.from({ length: 15 }, (_, index) => (
              <div key={index} className={`${styles.carditem} ${styles.loading}`}>
                <div
                  className={`${styles.cardimgcontainer} ${styles.pulse}`}
                  style={{ animationDelay: `${(index + 2) * 0.3}s` }}
                ></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Animecards;
