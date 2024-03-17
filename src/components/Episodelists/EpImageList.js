import React from 'react'
import Image from 'next/image'
import styles from '../../styles/Epimglist.module.css'
import Link from 'next/link'

function EpImageList({ data, epdata, defaultProvider, subtype, progress }) {

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-4 !max-h-[22.2rem] md:max-h-[26rem] lg:max-h-[29rem] xl:!max-h-[28.8rem] max-2xl:max-h-[40rem] overflow-y-auto ">
      {epdata?.map((episode) => {
        const isWatched = parseInt(progress) >= episode.number;
        return (
          <Link
            href={`/anime/watch?id=${data?.id}&host=${defaultProvider}&epid=${encodeURIComponent(
              episode?.id || episode?.episodeId
            )}&ep=${episode?.number}&type=${subtype}`}
            key={episode?.id || episode?.episodeId}
            className={`relative group`}
          >
            <div className={`relative w-full flex-1 rounded-lg overflow-hidden bg-[#18181b] aspect-video ${isWatched ? 'opacity-60' : ''}`}>
              <Image src={episode?.img || episode?.image || data?.bannerImage || data?.coverImage.extraLarge} width={200} height={200} alt={episode?.title} className="bg-[#18181b] h-full w-full object-cover aspect-w-16 aspect-h-9 rounded-lg transition-all duration-300 transform group-hover:scale-105 group-hover:opacity-60" quality={100} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="hidden group-hover:flex items-center justify-center opacity-0 bg-white bg-opacity-40 hover:bg-[#4d148c] rounded-full shadow group-hover:opacity-90 w-12 h-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className='play-buttonicon w-5 h-5' viewBox="0 0 24 24"><path fill="currentColor" d="M21.409 9.353a2.998 2.998 0 0 1 0 5.294L8.597 21.614C6.534 22.737 4 21.277 4 18.968V5.033c0-2.31 2.534-3.769 4.597-2.648z" /></svg>
                </div>
              </div>
            </div>
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-[6px] py-[3px] text-xs rounded-md">{"EP " + episode?.number}</span>
            {episode?.isFiller===true && 
            <span className="absolute bottom-2 right-2 bg-[#4D148C] px-[6px] py-[3px] text-xs rounded-md">F</span>
            }
            <span
              className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-xl bg-red-600 z-10 `}
              style={{
                width: `${ isWatched ? '92%' : '0'}`,
              }}
            />          
            </Link>
        );
      })}
    </div>
  )
}

export default EpImageList
