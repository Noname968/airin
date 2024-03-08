"use client"
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useDraggable } from 'react-use-draggable-scroll';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useRouter } from 'next-nprogress-bar';
import { toast } from 'sonner'
import Skeleton from "react-loading-skeleton";
import { deleteEpisodes, getWatchHistory } from '@/lib/EpHistoryfunctions';

function ContinueWatching({ session }) {
    const containerRef = useRef();
    const { events } = useDraggable(containerRef);
    const [storedData, setStoredData] = useState([]);
    const [loading, setloading] = useState(true);
    const router = useRouter();

    function filterHistory(history) {
        const sortedData = history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const filteredHistory = sortedData.reduce((acc, curr) => {
            if (curr.epId !== null && !acc.find(item => item.aniId === curr.aniId)) {
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
                if (session?.user?.name) {
                    // const response = await fetch(`/api/watchhistory`, {
                    //     method: "GET",
                    // });
                    const history = await getWatchHistory();

                    if (history?.length > 0) {
                        const data = filterHistory(history);
                        setStoredData(data);
                    }
                    setloading(false);
                }
                else {
                    const data = JSON.parse(localStorage.getItem('vidstack_settings'));
                    if (data) {
                        const mappedValues = Object.keys(data).map((key) => data[key]);
                        const sortedData = mappedValues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        setStoredData(sortedData);
                    }
                    setloading(false)
                }
            }
        };

        fetchData();
    }, [setStoredData]);


    async function RemovefromHistory(id, aniTitle) {
        try {
            const data = {};
            if (id) {
                data.aniId = id;
            }
            if (session?.user?.name) {
                const response = await deleteEpisodes(data);
                if (response) {
                    const { remainingData, deletedData } = response;
                    toast.success(`${aniTitle}`, {
                        description: `Successfully removed ${deletedData?.deletedCount || 0} episode${deletedData?.deletedCount > 1 ? 's' : ''}`,
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

    if (!loading && storedData.length === 0) {
        return <div {...events} ref={containerRef}></div>;
    }

    return (
        <div className='flex flex-col mb-6 md:mb-5'>
            <div className="flex items-center gap-2 px-3 xl:px-0">
                <span className="w-[0.35rem] h-6 md:w-[0.3rem] md:h-8 rounded-md bg-white"></span>
                <h1 className="text-[19px] sm:text-[21px] my-4 font-medium xl:text-2xl">Continue Watching</h1>
            </div>
            <div className="flex items-center flex-nowrap scrollbar-hide overflow-x-auto gap-4 pl-3 xl:pl-0" {...events} ref={containerRef}>
                {!loading && storedData?.map((anime) => (
                    <div key={anime?.aniId || anime?.id} className="flex flex-col gap-2 shrink-0 cursor-pointer relative group/item">
                        <Popover placement="bottom-end" offset={10} radius={"sm"}>
                            <PopoverTrigger>
                                <button className="absolute bg-white py-1 rounded-md flex flex-col gap-1 z-20 top-2 right-2 transition-all duration-200 ease-out md:opacity-0 group-hover/item:opacity-100 scale-90 group-hover/item:scale-100 group-hover/item:visible visible opacity-100 md:invisible shadow-md shadow-black/50 outline-none border-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="black" className="w-[17px] h-[17px]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                    </svg>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="px-2 py-2 w-[170px]">
                                {(titleProps) => (
                                    <div className="flex flex-col w-full">
                                        <span className='w-full hover:bg-[#403c44] rounded-md text-sm'>
                                            <button className='py-2 px-2 w-full text-left outline-none border-none' onClick={() => RemovefromHistory(anime.aniId || anime.id, anime.aniTitle)}>Remove Tracking</button>
                                        </span>
                                        {anime?.nextepId &&
                                            <span className='hover:bg-[#403c44] rounded-md text-sm'>
                                                <button className='px-2 py-2 w-full text-left border-none outline-none'
                                                    onClick={() => router.push(`/anime/watch?id=${anime?.aniId || anime?.id}&host=${anime?.provider}&epid=${anime?.nextepId || anime?.epid}&ep=${anime?.nextepNum || anime?.epnum}&type=${anime.subtype}`)}
                                                >Play Next Episode</button>
                                            </span>
                                        }
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                        <Link className="relative w-60 sm:w-64 md:w-80 aspect-video group"
                            href={`/anime/watch?id=${anime?.aniId || anime?.id}&host=${anime?.provider}&epid=${anime?.epId || anime?.epid}&ep=${anime?.epNum || anime?.epnum}&type=${anime.subtype}`}>
                            <div className="overflow-hidden w-full aspect-video rounded-lg">
                                <Image src={anime?.image || ''} alt={anime?.aniTitle} width={155} height={230} className="w-full aspect-video object-cover rounded-lg group-hover/item:scale-[1.03] duration-300 ease-out" />
                            </div>
                            <div className="top-0 w-full h-full bg-gradient-to-t from-black/80 from-25% to-transparent to-60% transition-all duration-300 ease-out absolute z-5" />
                            <div className="absolute bottom-0 left-0 px-3 py-2 text-white flex gap-2 items-center z-10">
                                <div className="flex flex-col">
                                    <span className="text-[0.8rem] sm:text-[0.9rem] font-medium line-clamp-1">{anime?.aniTitle}</span>
                                    <span className="text-[0.7rem] text-[#D1D7E0]">
                                        {formatTime(anime?.timeWatched)} /{' '}
                                        {formatTime(anime?.duration)} - Episode {anime?.epNum || anime?.epnum}
                                    </span>
                                </div>
                            </div>
                            <span
                                className={`absolute bottom-0 left-2 right-2 h-[1px] rounded-xl bg-red-600 z-10 `}
                                style={{
                                    width: `${(anime.timeWatched / anime.duration) * 95}%`,
                                }}
                            />
                        </Link>
                    </div>
                ))}
                {loading && (
                    [1, 2].map((item) => (
                        <div
                            key={item}
                            className="relative w-60 sm:w-64 md:w-80 aspect-video transition-opacity duration-300 ease-in-out"
                        >
                            <div className="w-full">
                                <Skeleton className="w-fit aspect-video" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ContinueWatching