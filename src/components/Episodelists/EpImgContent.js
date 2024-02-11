"use client"
import React, { useEffect, useRef } from 'react';
import Image from 'next/image'
import styles from '../../styles/Epimglist.module.css'
import Link from 'next/link'

function EpImgContent({ data, epdata, defaultProvider, subtype, epnum }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current && epnum && epdata) {
      const episodeElement = document.getElementById(`episode-${epnum}`);
      if (episodeElement) {
        const scrollTop = episodeElement.offsetTop - scrollContainerRef.current.offsetTop;
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    }
  }, [epnum, epdata, scrollContainerRef]);
  console.log(epdata)

  return (
    <div className={styles.epimgcondiv} ref={scrollContainerRef}>
    {epdata?.map((episode) => (
      <Link 
        href={`/anime/watch?id=${data?.id}&host=${defaultProvider}&epid=${encodeURIComponent(
          episode?.id
        )}&ep=${episode?.number}&type=${subtype}`}
        key={episode?.id}
        className={`flex flex-row items-center transition-all duration-300 ease-out hover:scale-[0.99] hover:bg-[#27272c] rounded-lg my-[5px] bg-[#18181b] ${parseInt(epnum) === episode.number ? 'scale-[0.99] ring-1 opacity-60 hover:bg-[#18181b] pointer-events-none hover:shadow-lg ring-white' : ''}`}
      >        
          <div className={styles.epcondiv}>
            <Image src={episode?.img || data?.bannerImage || data?.coverImage.extraLarge} alt={episode?.title} width={200} height={200} className={styles.epimgcon} quality={100} />
            {parseInt(epnum) === episode.number && (
                <div className={styles.epimgplayico}>
                  <i className={`fa-solid fa-play fa-xl play-buttonicon ${styles.play}`} style={{ color: "#ffffff" }}></i>
                </div>
              )}
          <span className={styles.epimgnumber}>{"EP " + episode?.number}</span>
          </div>
          <div className={styles.epimgright}>
            <div className={styles.epimgtitle}>{episode?.title}</div>
            <div className={styles.epimgdescription}>{episode?.description}</div>
        </div>
       </Link>
    ))}
  </div>
  )
}

export default EpImgContent
