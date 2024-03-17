"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/Animecard.module.css';
import { useDraggable } from 'react-use-draggable-scroll';
import Link from 'next/link';
import ItemContent from '../CardComponent/ItemContent';
import { getRecentEpisodes } from '@/lib/getData';

function RecentEpisodes({ cardid }) {
    const containerRef = useRef();
    const { events } = useDraggable(containerRef);
    const [isLeftArrowActive, setIsLeftArrowActive] = useState(false);
    const [isRightArrowActive, setIsRightArrowActive] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const getRecent = async () => {
            const response = await getRecentEpisodes();
            setData(response);
        };
        getRecent();
    }, []);

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
        smoothScroll(500);
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
                    {data && data?.map((item) => {
                        const anime = {
                            id: item.id || '',
                            coverImage: item?.coverImage || '',
                            title: item.title || '',
                            status: item.status || '',
                            format: item.format || '',
                            latestEpisode: item?.latestEpisode || '',
                            totalEpisodes: item?.totalEpisodes || '',
                            currentEpisode: item?.currentEpisode || ''
                        };
                        const latestEpisode = item?.latestEpisode || '';
                        return (
                            latestEpisode!=='' ? (
                                <Link href={`/anime/watch?id=${anime.id}&host=gogoanime&epid=${encodeURIComponent(latestEpisode)}&ep=${item?.currentEpisode}&type=sub`} key={anime.id}>
                                    <ItemContent anime={anime} cardid={cardid} />
                                </Link>
                            ) : (
                                <Link href={`/anime/info/${anime.id}`} key={anime.id}>
                                    <ItemContent anime={anime} cardid={cardid} />
                                </Link>
                            )
                        );
                    })}
                    {!data?.length && (
                        Array.from({ length: 15 }, (_, index) => (
                            <div key={index} className={`${styles.carditem} ${styles.loading}`}>
                                <div
                                    className={`${styles.cardimgcontainer} ${styles.pulse} h-full`}
                                    style={{ animationDelay: `${(index + 2) * 0.3}s` }}
                                ></div>
                                <div className={`${styles.pulse} bg-[#1e1e24] mt-2 rounded-md h-5 lg:h-7 w-[98%] mx-auto`}
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

export default RecentEpisodes;
