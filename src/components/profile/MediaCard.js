"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTitle } from '@/lib/store';
import { useStore } from 'zustand';
import Link from 'next/link';
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import Addtolist from '../details/Addtolist';

function MediaCard({ anime, session }) {
    const animetitle = useStore(useTitle, (state) => state.animetitle);
    const [openlist, setOpenlist] = useState(false);
    const [list, setList] = useState(null);

    useEffect(() => {
        setList(anime);
    }, [])

    function Handlelist() {
        setOpenlist(!openlist);
    }
    // console.log(anime)

    return (
        <div className='flex flex-col'>
            <div className="relative overflow-hidden rounded-lg shadow-lg group p-1 flex-shrink-0 group cursor-pointer">
                <Link href={`/anime/info/${anime?.mediaId}`}>
                    <div className='aspect-[1/1.45] overflow-hidden rounded-lg'>
                        <Image
                            src={anime?.media?.coverImage?.extraLarge}
                            alt={anime?.media?.title?.[animetitle] || anime?.media?.title?.romaji}
                            width={200}
                            height={200}
                            className="object-cover w-full h-full transition-transform group-hover:scale-[1.03] duration-200 bg-[#1e1e24]"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-end group-hover:bg-gradient-to-t from-black/80 to-transparent">
                    </div>
                    <span className='absolute bottom-2 group-hover:flex hidden justify-center w-full text-center text-[12px]'>EP - {anime?.progress}/{anime?.media?.episodes || '?'}</span>
                </Link>
                <button className="absolute bg-white py-1 rounded-md flex flex-col top-[10px] right-3 transition-all duration-200 ease-out md:opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 group-hover:visible visible opacity-100 md:invisible shadow-md shadow-black/50 outline-none border-none" onClick={Handlelist}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="black" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                    </svg>
                </button>
                <Modal isOpen={openlist} onOpenChange={Handlelist} size={"3xl"} backdrop="opaque" hideCloseButton={true} placement="center" radius="sm" scrollBehavior="outside"
                    classNames={{
                        body: "p-0",
                    }}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalBody className=''>
                                    <div className='relative'>
                                        <div
                                            className="w-full !h-40 brightness-50 rounded-t-md"
                                            style={{ backgroundImage: `url(${anime?.media?.bannerImage || anime?.media?.coverImage?.extraLarge || null})`, backgroundPosition: "center", backgroundSize: "cover", height: "100%", }}
                                        ></div>
                                        <div className='absolute z-10 bottom-1 sm:bottom-0 sm:top-[65%] left-0 sm:left-3 md:left-10 flex flex-row items-center'>
                                            <Image src={anime?.media?.coverImage?.extraLarge} alt='Image' width={120} height={120} className="hidden sm:flex rounded-md" />
                                            <div className='px-2 sm:px-4 mb-4 font-medium !text-xl text-white max-w-full line-clamp-2'>{anime?.media?.title?.[animetitle] || anime?.media?.title?.romaji}</div>
                                        </div>
                                    </div>
                                    <div className='mt-2 sm:mt-20 md:px-[5%] px-[2%] mb-2'>
                                        <Addtolist session={session} setList={setList} list={list}
                                            id={anime?.mediaId} eplength={anime?.media?.episodes || anime?.media?.nextAiringEpisode?.episode - 1 || 24} Handlelist={Handlelist} />
                                    </div>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <Link href={`/anime/info/${anime?.mediaId}`}>
                <div className="overflow-hidden flex flex-row justify-center items-center text-center text-white font-medium px-2.5 my-0 sm:my-1 cursor-pointer text-[12px] sm:text-sm !line-clamp-2">
                    <span className={`aspect-square w-2 h-2 inline-block mr-1 sm:mr-2 rounded-full ${anime?.media?.status === "NOT_YET_RELEASED" ? 'bg-red-500' : anime?.media?.status === 'RELEASING' ? 'bg-green-500' : 'hidden'}`}>
                    </span>
                    {anime?.media?.title?.[animetitle] || anime?.media?.title?.romaji}
                </div>
            </Link>
        </div>
    );
}

export default MediaCard;
