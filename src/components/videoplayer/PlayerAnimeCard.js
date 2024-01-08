import React from 'react'
import Image from 'next/image'
import styles from '../../styles/PlayAnimeCard.module.css'
import Link from 'next/link'

function PlayerAnimeCard({ data }) {
  return (
    <div className={styles.playanimecard}>
      {data.map((item) => (
        <div className={styles.playcarditem} key={item.node.id}>
          {/* Check if relationType is manga */}
          {item?.node?.format?.toLowerCase() === 'manga' || item?.node?.format?.toLowerCase() === 'novel' ? (
              <Image src={item?.node?.coverImage?.large} width={70} height={90} alt='image' className={styles.playcardimg}/>
          ) : (
            <Link href={`/anime/info/${item?.node?.id}`}>
                  <Image src={item?.node?.coverImage?.large} width={70} height={90} alt='image' className={styles.playcardimg} />
            </Link>
          )}
          <div className={styles.playcardinfo}>
            <p className={styles.playcardrelation}>{item?.relationType}</p>
            {/* Check if relationType is manga */}
            {item?.node?.format?.toLowerCase() === 'manga' || item?.node?.format?.toLowerCase() === 'novel' ? (
                  <p className={styles.playcardtitle}>{item?.node?.title?.english || item?.node?.title?.romaji}</p>
                  ) : (
              <Link href={`/anime/info/${item?.node?.id}`}>
                  <p className={styles.playcardtitle}>{item?.node?.title?.english || item?.node?.title?.romaji}</p>
              </Link>
            )}
            <p className={styles.playepnum}>
              {item.node.format} <span>.</span> {item?.node?.episodes && item?.node?.episodes + " EP" || item?.node?.chapters && item?.node?.chapters + " CH" || "?"} <span>.</span> {item.node.status ? item.node.status : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayerAnimeCard;
