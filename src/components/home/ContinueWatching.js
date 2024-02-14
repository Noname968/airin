"use client"
import React, { useEffect, useState, useRef } from 'react'
import styles from '../../styles/ContinueWatching.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { useDraggable } from 'react-use-draggable-scroll';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useRouter } from 'next-nprogress-bar';
import { toast } from 'sonner'

function ContinueWatching({session}) {
    const containerRef = useRef();
    const { events } = useDraggable(containerRef);
    const [storedData, setStoredData] = useState([]);
    const router = useRouter();

    function filterHistory(history) {
        const sortedData = history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredHistory = sortedData.reduce((acc, curr) => {
            if (curr.aniId !== null && !acc.find(item => item.aniId === curr.aniId)) {
                acc.push(curr);
            }
            return acc;
        }, []);
        return filteredHistory;
    }  
    
    function removeFromLocalStorage(id) {
        const history = JSON.parse(localStorage.getItem('vidstack_settings')) || {};
        if (history[id]) {
          delete history[id];
          localStorage.setItem('vidstack_settings', JSON.stringify(history));
        }
      }


    useEffect(() => {
        const fetchData = async () => {
          if (typeof window !== 'undefined') {
            if(session?.user?.name){
                const response = await fetch(`/api/watchhistory`, {
                    method: "GET",
                  });
                  const history = await response.json();
                  console.log(history);
                if (history?.length > 0) {
                  const data = filterHistory(history);
                  setStoredData(data);
                } 
            }
            else {
              const data = JSON.parse(localStorage.getItem('vidstack_settings'));
              if (data) {
                const mappedValues = Object.keys(data).map((key) => data[key]);
                const sortedData = mappedValues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setStoredData(sortedData);
              }
            }
          }
        };
      
        fetchData();
      }, [setStoredData]);
      

      async function RemovefromHistory(id, aniTitle){
        try {
            if (session?.user?.name) {
                const response = await fetch(`/api/watchhistory`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: session?.user?.name,
                        aniId: id,
                    }),
                });
                if (response.status === 200) {
                    const { remainingData, deletedData } = await response.json();
                    toast.success(`${aniTitle}`, {
                        description: `Successfully removed ${deletedData?.deletedCount || 0} episode(s).`,
                    });
                    if (remainingData?.length > 0) {
                        const data = filterHistory(remainingData);
                        setStoredData(data);
                    } else {
                        setStoredData([]);
                    }
                    removeFromLocalStorage(id);
                } else {
                    toast.error('Failed to remove anime from history. Please try again later.');
                }
            }
            else {
                removeFromLocalStorage(id);
                toast.success(`${aniTitle}`, {
                    description: `Removed anime from watch history.`,
                });
                setStoredData((prevData) => prevData.filter(item => item.aniId !== id));
            }
        } catch (error) {
            toast.error('Failed to remove anime from history');
        }
    };
    

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
                    <div key={anime?.aniId || anime?.id} className={`${styles.animeitem} group`}>
                        <Popover placement="bottom-end" offset={10} radius={"sm"}>
                            <PopoverTrigger>
                                <button className='absolute z-[8] py-[4px] bg-white rounded-[6px] px-[1px] top-2 right-2 shadow-md shadow-black/50 transition-all duration-200 ease-out opacity-0 xl:group-hover:opacity-100 scale-90 group-hover:scale-100 outline-none border-none'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="black" className="w-[17px] h-[17px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                    </svg>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="px-2 py-2 w-[170px]">
                                {(titleProps) => (
                                    <div className="flex flex-col w-full">
                                        <span className='w-full hover:bg-[#403c44] rounded-md text-sm'>
                                        <button className='py-2 px-2 w-full text-left outline-none border-none' onClick={()=>RemovefromHistory(anime.aniId || anime.id, anime.aniTitle)}>Remove Tracking</button>
                                        </span>
                                        {anime?.nextepId && 
                                        <span className='hover:bg-[#403c44] rounded-md text-sm'>
                                        <button className='px-2 py-2 w-full text-left border-none outline-none'
                                        onClick={()=> router.push(`/anime/watch?id=${anime?.aniId || anime?.id}&host=${anime?.provider}&epid=${anime?.nextepId || anime?.epid}&ep=${anime?.nextepNum || anime?.epnum}&type=${anime.subtype}`)}
                                        >Play Next Episode</button>
                                        </span>
                                        }
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                        <Link href={`/anime/watch?id=${anime?.aniId || anime?.id}&host=${anime?.provider}&epid=${anime?.epId || anime?.epid}&ep=${anime?.epNum || anime?.epnum}&type=${anime.subtype}`}>
                            <div className={styles.animeimg}>
                                <Image src={anime?.image} alt={anime?.aniTitle} width={155} height={230} placeholder="blur" blurDataURL={anime?.image} className={`${styles.imgcover} `} />
                            </div>
                            <div className={styles.overlay}></div>
                            <div className={styles.textcontainer}>
                                <div className={styles.title}>
                                    <span className={styles.animetitle}>{anime?.aniTitle}</span>
                                    <span className={styles.animesubtitle}>
                                        {formatTime(anime?.timeWatched)} /{' '}
                                        {formatTime(anime?.duration)} - Episode {anime?.epNum || anime?.epnum}
                                    </span>
                                </div>
                            </div>
                            <span className={`absolute bottom-0 left-2 right-2 h-[2px] rounded-lg bg-red-600 z-[9]`}
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