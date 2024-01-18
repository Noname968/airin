"use client"
import React, { useRef, useState } from 'react';
import styles from '../styles/Animecard.module.css';
import Image from 'next/image';
import { useDraggable } from 'react-use-draggable-scroll';
import Link from 'next/link';

function Animecard({ data, cardid }) {
  const containerRef = useRef();
  const { events } = useDraggable(containerRef);
  const [imageLoaded, setImageLoaded] = useState(false);
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

    if (cont) {
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

  function containsEngChar(text) {
    const englishRegex = /[a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-] /;
    return englishRegex.test(text);
  }

  return (
    <div className={styles.animecard}>
      <div className={styles.cardhead}>
        <span className={styles.bar}></span>
        <h1 className={styles.headtitle}>{cardid}</h1>
      </div>
      <div className={styles.animeitems}>
        <span className={`${styles.leftarrow} ${isLeftArrowActive ? styles.active : styles.notactive}`}>
          <svg onClick={scrollLeft} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="m15 18-6-6 6-6"></path></svg>
        </span>
        <span className={`${styles.rightarrow} ${isRightArrowActive ? styles.active : styles.notactive}`}>
          <svg onClick={scrollRight} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="m9 18 6-6-6-6"></path></svg>
        </span>
        <div className={styles.cardcontainer} id={cardid} {...events} ref={containerRef} onScroll={handleScroll}>
          {data?.map((item) => (
            <Link href={`/anime/info/${item.id}`} key={item.id}>
              <div className={styles.carditem}>
                <div className={`${styles.cardimgcontainer}`}>
                  <Image
                    src={item.coverImage?.extraLarge || item.image}
                    alt={item.title.english || item.title.romaji}
                    width={155}
                    height={230}
                    placeholder="blur"
                    blurDataURL={item.coverImage?.extraLarge || item.image}
                    className={`${styles.cardimage}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
                <div className="hidden xl:flex h-[82%] w-[100%] rounded absolute hover:bg-gradient-to-t from-black/90 to-transparent z-7 opacity-0 hover:opacity-100 transition-all duration-300 ease  justify-center">
                  <div className="bottom-4 absolute text-xs font-light flex flex-wrap items-center justify-center gap-[.3rem] z-10">
                    <span className="uppercase">{item.format || "?"}</span> <span className='text-[10px]'>&#8226;</span>
                    <span className={item.status === 'RELEASING' ? 'text-green-400 font-normal' : item.status === 'NOT_YET_RELEASED' ? 'text-red-600 font-normal' : 'text-white font-normal'}>
                      {item.status}
                    </span>
                    <span className='text-[10px]'>&#8226;</span>
                    <span>Ep {item.episodes || item.nextAiringEpisode?.episode - 1 || '?'}</span>
                  </div>
                </div>
                <span className={styles.cardtitle}>{containsEngChar(item.title.english) ? item.title.english : item.title.romaji}</span>
              </div>
            </Link>
          ))}
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

export default Animecard;
