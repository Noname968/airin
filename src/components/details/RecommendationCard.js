"use client"
import React, { useRef } from 'react'
import styles from '../../styles/Animecard.module.css'
import Image from 'next/image'
import { useDraggable } from "react-use-draggable-scroll";
import Link from 'next/link';

function RecommendationCard({ data, title }) {
  // console.log(data)
  const containerRef = useRef();
  const { events } = useDraggable(containerRef);

  return (
    <div className={styles.animecard}>
        <h2 className={styles.headtitle}>{title || ""}</h2>
      <div className={styles.cardcontainer} {...events} ref={containerRef}>
        {data.map((item) => {
          return (
            <div key={item?.mediaRecommendation?.id} className={styles.carditem}>
              <div className={styles.cardimgcontainer}>
                <Link href={`/anime/info/${item?.mediaRecommendation?.id}`}>
                <Image src={item?.mediaRecommendation?.coverImage?.extraLarge} width={250} height={400} className={`${styles.cardimage}`} />
                </Link>
              </div>
              <Link href={`/anime/info/${item?.mediaRecommendation.id}`}>
                <span className={styles.cardtitle}>{item.mediaRecommendation.title.english || item.mediaRecommendation.title.romaji}</span>
                </Link>
              {/* <div className={styles.cardinfo}>

              </div> */}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecommendationCard
