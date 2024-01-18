"use client"
import React, { useEffect, useState, useRef } from 'react'
import styles from '../../styles/ContinueWatching.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { useDraggable } from 'react-use-draggable-scroll';

function ContinueWatching() {
    const containerRef = useRef();
    const { events } = useDraggable(containerRef);
    const [storedData, setStoredData] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = JSON.parse(localStorage.getItem('vidstack_settings'));
            if (data) {
                const mappedvalues = Object.keys(data).map((key) => data[key]);
                const sorteddata = mappedvalues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setStoredData(sorteddata);
            }
        }
    }, [])


    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

        const formattedTime = `${formattedMinutes}:${formattedSeconds}`;
        return formattedTime;
    }

    if (storedData.length === 0) {
        return <div {...events} ref={containerRef}></div>; 
    }

    return (
        <div className={styles.ContinueWatching}>
            <div className={styles.topsection}>
                <span className={styles.bar}></span>
                <h1 className={styles.headtitle}>Continue Watching</h1>
            </div>
            <div className={styles.bottomsection} {...events} ref={containerRef}>
                {storedData?.map((anime) => (
                    <div key={anime?.id} className={styles.animeitem}>
                        <Link href={`/anime/watch/${anime.id}/${anime.provider}/${anime.epnum}?epid=${anime.epid}&type=${anime.subtype}`}>
                        <div className={styles.animeimg}>
                            <Image src={anime?.image} alt={anime?.aniTitle} width={155} height={230} placeholder="blur" blurDataURL={anime?.image} className={`${styles.imgcover} `} />
                        </div>
                        <div className={styles.overlay}></div>
                        <div className={styles.textcontainer}>
                            <div className={styles.title}>
                                <span className={styles.animetitle}>{anime.aniTitle}</span>
                                <span className={styles.animesubtitle}>
                                    {formatTime(anime.timeWatched)} /{' '}
                                    {formatTime(anime.duration)} - Episode {anime.epnum}
                                </span>
                            </div>
                        </div>
                        <span className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-lg bg-red-600 z-30`}
                            style={{ width: `${(anime.timeWatched / anime.duration) * 100}%` }}
                        />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContinueWatching