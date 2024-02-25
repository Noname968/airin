"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from '../../styles/AnimeDetailsTop.module.css'
import { Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@nextui-org/react";
import Link from 'next/link'
import { ContextSearch } from '@/context/DataContext';

function AnimeDetailsTop({ data }) {
  const { dfprovider, dfepisodes, dftype, animetitle } = ContextSearch();
  const [subtype, setSubtype] = useState('sub');

  useEffect(() => {
    const storedType = localStorage.getItem('selectedType');
    if (storedType) {
      setSubtype(storedType);
    }
  }, []);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return ( 
    <div className={styles.detailsbanner}>
      <div
        className={styles.detailsbgimage}
        style={{ backgroundImage: `url(${data?.bannerImage || data?.coverImage.extraLarge || null})`, backgroundPosition: "center", backgroundSize: "cover", height: "100%" }}
      ></div>
      <div className={styles.gradientOverlay}></div>
      <>
        <Button className={styles.detailstrailer} onPress={onOpen}>Watch Trailer</Button>
        <Modal backdrop='blur' isOpen={isOpen} onOpenChange={onOpenChange} size={"2xl"}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-0">{data.title?.[animetitle] || data?.title?.romaji}</ModalHeader>
                <ModalBody>
                  <div>
                    <iframe
                      title="Trailer"
                      className='w-[620px] h-[350px] mb-4'
                      src={`https://www.youtube.com/embed/${data?.trailer?.id}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
      <div className={styles.detailsinfo}>
        <div className={styles.detailsimgcon}>
          <Image src={data?.coverImage?.extraLarge} alt='Image' width={200} height={200} className={styles.detailsimage} />
        </div>
        <div className={styles.detailstitle}>
          <h1 className={`${styles.title} text-[1.7rem] font-[500]`}>
            {data?.title?.[animetitle] || data?.title?.romaji}
          </h1>
          <h4 className={`${styles.alttitle}`}>
            {animetitle === 'romaji' ? data?.title?.english : data?.title?.romaji}
          </h4>
          <p className={styles.scores}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[17px] h-[17px] mr-[2px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            {data?.averageScore / 10} | <span className={`${data?.status === 'RELEASING' ? styles.activestatus : styles.notactive}`}> {data?.status}</span>
          </p>
         <div className='flex'>
         {dfepisodes && dfprovider && dfepisodes.length > 0 ?
            <Link href={`/anime/watch?id=${data?.id}&host=${dfprovider}&epid=${encodeURIComponent(dfepisodes[0]?.id)}&ep=${dfepisodes[0]?.number}&type=${dftype || subtype}`}>
              <button className={styles.detailswatch}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd"></path></svg>
                Watch Now
              </button>
            </Link> :
            <button className={`${styles.detailswatch} opacity-40 bg-black`} disabled><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd"></path></svg>
              Watch Now
            </button>
          }
              <button className={styles.detailsaddlist}>
                Add to list
              </button>
         </div>
        </div>
      </div>
    </div>
  )
}

export default AnimeDetailsTop
