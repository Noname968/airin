import React from 'react'
import Link from 'next/link'
import styles from '../../styles/Epimglist.module.css'

function EpNumList({ data, epdata, defaultProvider, subtype, epnum }) {
    return (
        <div className={styles.epnumlistcontainer}>
            {epdata
                .slice()
                .map((episode) => (
                    <Link
                        href={`/anime/watch?id=${data?.id}&host=${defaultProvider}&epid=${encodeURIComponent(
                            episode?.id
                        )}&ep=${episode?.number}&type=${subtype}`}
                        key={episode?.id}
                    >
                        <div className={`${styles.epdiv} ${parseInt(epnum) === episode.number ? styles.selectedEpnum : ''}`}>
                            {episode.number}</div>
                    </Link>
                ))}
        </div>
    )
}

export default EpNumList
