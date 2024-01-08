"use client"
import React, { useRef, useState } from 'react';
import styles from '../styles/Animecard.module.css';
import Image from 'next/image';
import { useDraggable } from 'react-use-draggable-scroll';
import Link from 'next/link';

function Animecard({ data,cardid }) {
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
  

  function scrollLeft(){
    smoothScroll(-500);
  }

  function scrollRight(){
    smoothScroll(+500);
  }

  function containsEngChar(text) {
    const englishRegex = /[a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-] /;
    return englishRegex.test(text);
  }

  return (
    <div className={styles.animecard}>
      <div className={styles.cardhead}>
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
          <div key={item.id} className={styles.carditem}>
            <div className={`${styles.cardimgcontainer}`}>
              <Link href={`/anime/info/${item.id}`}>
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
              </Link>
            </div>
            <Link href={`/anime/info/${item.id}`}>
              <span className={styles.cardtitle}>{containsEngChar(item.title.english) ? item.title.english : item.title.romaji}</span>
            </Link>
            {/* <div className={styles.cardinfo}>
              <p>{item.season}</p>
            </div> */}
          </div>
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
