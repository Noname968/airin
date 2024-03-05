"use client";
import Link from 'next/link';
import Image from 'next/image';
import { AdvancedSearch } from '@/lib/Anilistfunctions';
import React, { useEffect, useState } from 'react';
import { Pagination } from "@nextui-org/react";
import styles from '../../styles/Catalog.module.css'
import UseDebounce from '@/utils/UseDebounce';
import { useTitle } from '@/lib/store';
import { useStore } from 'zustand';

function Searchcard({ searchvalue, selectedYear, seasonvalue, formatvalue, genrevalue, sortbyvalue, airingvalue }) {
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchdata, setsearchdata] = useState(null);
    const [lastpage, setlastpage] = useState();
    const [loading, setLoading] = useState(true);
    const debouncedSearch = UseDebounce(searchvalue, 500)

    useEffect(() => {
        const fetchsearch = async () => {
            setLoading(true);
            try {
                const response = await AdvancedSearch(debouncedSearch, selectedYear, seasonvalue, formatvalue, genrevalue, sortbyvalue,currentPage);
                setsearchdata(response.media);
                setlastpage(response.pageInfo.lastPage);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setLoading(false);
            }
        };
        fetchsearch();
    }, [debouncedSearch, selectedYear, seasonvalue, formatvalue, genrevalue, sortbyvalue, currentPage, airingvalue]);

    return (
        <div className={styles.searchcard}>
            {!loading && searchdata && searchdata.length === 0 && (
                <div className="text-center w-[100%] h-[100%] text-semibold text-2xl">
                    <p>
                        Oops!
                    </p>
                    No results for <span className='text-3xl text-[#864abb]'>
                        "{searchvalue}"
                    </span>
                </div>
            )}
            <div className={styles.cardtop}>
                {loading && (
                    Array.from({ length: 20 }, (_, index) => (
                        <div key={index} className={`${styles.carditem} ${styles.loading}`}>
                            <div
                                className={`${styles.cardimgcontainer} ${styles.pulse}`}
                                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                            ></div>
                        </div>
                    ))
                )}
                {!loading && (
                    searchdata?.map((item) => (
                        <Link href={`/anime/info/${item.id}`} key={item.id}>
                            <div key={item.id} className={styles.carditem}>
                                <div className={styles.cardimgcontainer}>
                                    <Image
                                        src={item.coverImage?.extraLarge ?? item.image}
                                        alt={item.title.english ?? item.title.romaji}
                                        width={155}
                                        height={230}
                                        placeholder="blur"
                                        blurDataURL={item.coverImage?.extraLarge ?? item.image}
                                        className={styles.cardimage}
                                    />
                                </div>
                                <div className="hidden xl:flex h-[85%] w-[100%] rounded absolute hover:bg-gradient-to-t from-black/90 to-transparent z-7 opacity-0 hover:opacity-100 transition-all duration-300 ease  justify-center">
                                    <div className="bottom-4 absolute text-xs font-light flex flex-wrap items-center justify-center gap-[.3rem] z-10">
                                        <span className="uppercase">{item.format || "?"}</span> <span className='text-[10px]'>&#8226;</span>
                                        <span className={item.status === 'RELEASING' ? 'text-green-400 font-normal' : item.status === 'NOT_YET_RELEASED' ? 'text-red-600 font-normal' : 'text-white font-normal'}>
                                            {item.status}
                                        </span>
                                        <span className='text-[10px]'>&#8226;</span>
                                        <span>Ep {item.episodes || item?.nextAiringEpisode?.episode-1 || '?'}</span>
                                    </div>
                                </div>
                                <span className={styles.cardtitle}> <span className={`aspect-square w-2 h-2 inline-block mr-1 rounded-full ${item.status === "NOT_YET_RELEASED" ? 'bg-red-500' : item.status === 'RELEASING' ? 'bg-green-500' : 'hidden'} xl:hidden`}></span>{item.title[animetitle] || item.title.romaji}</span>
                                {/* <span className={styles.cardtitle}>
                                    {item.title.english ? item.title.english : item.title.romaji}
                                </span> */}
                            </div>
                        </Link>
                    ))
                )}

            </div>
            {lastpage > 2 && (
                <div className={styles.cardbottom}>
                    <Pagination
                        total={lastpage}
                        color="secondary"
                        page={currentPage}
                        onChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}

export default Searchcard;
