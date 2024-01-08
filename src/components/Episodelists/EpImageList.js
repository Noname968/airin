import React from 'react'
import Image from 'next/image'
import styles from '../../styles/Epimglist.module.css'
import Link from 'next/link'

function EpImageList({ data, epdata, defaultProvider, subtype }) {
  
  return (
    <div className={styles.epimgcontainer} >
      {epdata?.map((episode) => (
        <Link
        href={`/anime/watch/${data.id}/${defaultProvider}/${episode?.number}?epid=${encodeURIComponent(
            episode?.id
          )}&type=${subtype}`}
          key={episode.id}
        >        
        <div className={styles.epimageitem}>
            <div className={styles.epimgdiv}>
              <Image src={episode?.image || episode?.img || data?.bannerImage} width={200} height={200} className={styles.epimage} quality={100} />
            </div>
            <div className={styles.epimgplayicon}>
              <i className="fa-solid fa-play fa-beat fa-2xl play-buttonicon" style={{ color: "#ffffff" }}></i>
            </div>
            <span className={styles.epimgnumber}>{"EP " + episode?.number}</span>
          </div>
        </Link>
      ))}
      </div>
)
}

export default EpImageList
