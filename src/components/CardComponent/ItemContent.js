"use client"
import React, { useState } from 'react';
import Image from 'next/image'
import styles from '../../styles/Animecard.module.css'
import { useTitle } from '@/lib/store';
import { useStore } from 'zustand';

function ItemContent({ anime, cardid }) {
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const [imageLoaded, setImageLoaded] = useState(false);

    function containsEngChar(text) {
        const englishRegex = /[a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-] /;
        return englishRegex.test(text);
    }

    return (
        <div className={styles.carditem}>
            {cardid === 'Recent Episodes' && (
                <div className="flex-shrink-0 absolute top-0 right-0 flex items-center justify-center gap-[.4rem] bg-black/60 backdrop-blur font-light xl:font-normal text-white !text-xs  line-clamp-1 px-2 p-1 rounded-bl-lg tracking-wider">
                    <span className='hidden md:flex'>Episode</span><span className='md:hidden'>Ep</span> <span className='font-medium'>{anime?.currentEpisode || '?'}</span></div>
            )}
             {cardid === 'Related Anime' && (
                <div className="flex-shrink-0 absolute top-0 right-0 flex items-center justify-center gap-[.4rem] bg-black/60 backdrop-blur font-light xl:font-normal text-white !text-xs  line-clamp-1 px-2 p-1 rounded-bl-lg tracking-wider">
                    <span className=''>{anime?.relationType}</span></div>
            )}
            <div className={`${styles.cardimgcontainer}`}>
                <Image
                    src={anime?.coverImage || anime?.image}
                    alt={anime?.title[animetitle] || anime?.title?.romaji}
                    width={155}
                    height={230}
                    placeholder="blur"
                    loading='eager'
                    blurDataURL={'https://wallpapercave.com/wp/wp11913677.jpg' || anime.coverImage || anime.image}
                    className={`${styles.cardimage} opacity-0 transition-all duration-500`}
                    onLoad={(e) => e.target.classList.remove('opacity-0')}
                    // onLoad={() => setImageLoaded(true)}
                />
            </div>
            <div className="hidden xl:flex h-[85%] w-[100%] rounded absolute hover:bg-gradient-to-t from-black/90 to-transparent z-7 opacity-0 hover:opacity-100 transition-all duration-300 ease  justify-center">
                <div className="bottom-4 absolute text-xs font-light flex flex-wrap items-center justify-center gap-[.3rem] z-10">
                    <span className="uppercase">{anime.format || "?"}</span> <span className='text-[10px]'>&#8226;</span>
                    <span className={anime.status === 'RELEASING' ? 'text-green-400 font-normal' : anime.status === 'NOT_YET_RELEASED' ? 'text-red-600 font-normal' : 'text-white font-normal'}>
                        {anime.status}
                    </span>
                    <span className='text-[10px]'>&#8226;</span>
                    {cardid === 'Recent Episodes' ? (
                        <span>Ep {anime?.totalEpisodes || anime?.currentEpisode || '?'}</span>
                    ) : (
                        <span>Ep {anime?.episodes || anime?.nextAiringEpisode?.episode - 1 || '?'}</span>
                    )}
                </div>
            </div>
            <span className={styles.cardtitle}>
                <span className={`aspect-square w-2 h-2 inline-block mr-1 rounded-full ${anime.status === "NOT_YET_RELEASED" ? 'bg-red-500' : anime.status === 'RELEASING' ? 'bg-green-500' : 'hidden'} xl:hidden`}>
                </span>
                {containsEngChar(anime.title[animetitle]) ? anime.title[animetitle] : anime.title.romaji}
            </span>
        </div>
    )
}

export default ItemContent
