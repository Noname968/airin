import React from 'react'
import Image from 'next/image'
import styles from '../../styles/Epimglist.module.css'
import Link from 'next/link'

function EpImgContent({ data, epdata, defaultProvider, subtype }) {
  return (
    <div className={styles.epimgcondiv}>
    {epdata?.map((episode) => (
      <Link 
        href={`/anime/watch/${data.id}/${defaultProvider}/${episode?.number}?epid=${encodeURIComponent(
          episode?.id
        )}&type=${subtype}`}
        key={episode.id}
      >        
      <div className={styles.epimageconitem}>
          <div className={styles.epcondiv}>
            <Image src={episode?.image || episode?.img || data?.bannerImage} width={200} height={200} className={styles.epimgcon} quality={100} />
          <div className={styles.epimgplayico}>
            <i className="fa-solid fa-play fa-xl play-buttonicon" style={{ color: "#ffffff" }}></i>
          </div>
          <span className={styles.epimgnumber}>{"EP " + episode?.number}</span>
          </div>
          <div className={styles.epimgright}>
            <div className={styles.epimgtitle}>{episode?.title}</div>
            <div className={styles.epimgdescription}>{episode?.description}</div>
        </div>
        </div>
       </Link>
    ))}
  </div>
  )
}

export default EpImgContent
