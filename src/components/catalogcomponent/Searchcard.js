"use client";
import Link from 'next/link';
import Image from 'next/image';
import { AdvancedSearch } from '@/lib/Anilistfunctions';
import React, { useEffect, useState } from 'react';
import { Pagination } from "@nextui-org/react";
import styles from '../../styles/Catalog.module.css'
import UseDebounce from '@/utils/UseDebounce';

function Searchcard({ searchvalue, selectedYear, seasonvalue, formatvalue, genrevalue, sortbyvalue, airingvalue }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchdata, setsearchdata] = useState(null);
    const [lastpage, setlastpage] = useState();
    const [loading, setLoading] = useState(true);
    const debouncedSearch = UseDebounce(searchvalue, 500)

    useEffect(() => {
        const fetchsearch = async () => {
            setLoading(true);
            try {
                const response = await AdvancedSearch(debouncedSearch, selectedYear, seasonvalue, formatvalue, genrevalue, sortbyvalue, currentPage);
                setsearchdata(response.media);
                console.log(response);
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
                        <div key={item.id} className={styles.carditem}>
                            <div className={styles.cardimgcontainer}>
                                <Link href={`/anime/info/${item.id}`}>
                                    <Image
                                        src={item.coverImage?.extraLarge ?? item.image}
                                        alt={item.title.english ?? item.title.romaji}
                                        width={155}
                                        height={230}
                                        placeholder="blur"
                                        blurDataURL={item.coverImage?.extraLarge ?? item.image}
                                        className={styles.cardimage}
                                    />
                                </Link>
                            </div>
                            <Link href={`/anime/info/${item.id}`}>
                                <span className={styles.cardtitle}>
                                    {item.title.english ? item.title.english : item.title.romaji}
                                </span>
                            </Link>
                        </div>
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
