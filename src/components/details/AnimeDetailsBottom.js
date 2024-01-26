"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../../styles/AnimeDetailsBottom.module.css'
import Animecards from '../CardComponent/Animecards';
import { AnimatePresence, Variants, motion } from 'framer-motion'
import Characters from './Characters';

function AnimeDetailsBottom({ data }) {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const tabs = [
        {
            name: 'Overview',
            label: 'Overview',
            render: () => {
                return (
                    <div className={styles.detailscard}>
                        <div className={styles.card1}>
                            <h3 className={styles.detailsheading}>Details</h3>
                            <div className={styles.detailscontent}>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Type</span> <span className={styles.con}>{data?.format}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Episodes</span> <span className={styles.con}>{data?.episodes || data?.nextAiringEpisode?.episode - 1 || "Na"}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Genres</span> <span className={styles.con}>{data?.genres.join(", ")}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Aired</span> <span className={styles.con}>{data?.startDate.month}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Status</span> <span className={styles.con}>{data?.status}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Season</span> <span className={styles.con}>{`${data?.season} ${data?.seasonYear}`}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Country</span> <span className={styles.con}>{data?.countryOfOrigin}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Studios</span> <span className={styles.con}>{data?.studios?.nodes[0]?.name}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Source</span> <span className={styles.con}>{data?.source}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Duration</span> <span className={styles.con}>{`${data?.duration} min` || `Na`}</span>
                                </div>
                                <div className={styles.singlecontent}>
                                    <span className={styles.sideheading}>Popularity</span> <span className={styles.con}>{`${data?.popularity} users`}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.card2}>
                            <h3 className={styles.detailsheading}>Description</h3>
                            <div className={styles.descriptioncontent}>
                                <p dangerouslySetInnerHTML={{ __html: data?.description }} />
                            </div>
                            <div className={styles.descriptioncontentmobile}>
                                <p dangerouslySetInnerHTML={{
                                    __html: showFullDescription
                                        ? data?.description
                                        : `${data?.description?.slice(0, 250)}...`
                                }} />
                                {data?.description?.length > 250 && (
                                    <button className={styles.readMoreButton} onClick={toggleDescription}>
                                        {showFullDescription ? 'Read Less' : 'Read More'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            name: 'Relations',
            label: 'Relations',
            render: () => {
                return (
                    <div className={styles.relations}>
                                <h3 className={styles.relationsheading}>Chronology</h3>
                            <Animecards data={data?.relations?.edges} cardid="Related Anime" show={false}/>
                    </div>
                );
            }
        },
        {
            name: 'Characters',
            label: 'Characters',
            render: () => {
                return (
                    <div className={styles.characters}>
                            <h3 className={styles.relationsheading}>Anime Characters</h3>
                        <Characters data={data?.characters?.edges}/>
                    </div>
                );
            }
        },
        {
            name: 'Staff',
            label: 'Staff',
            render: () => {
                return (
                    <div className={styles.detailscard}>
                        Coming Soon
                    </div>
                );
            }
        }
    ];

    const [activeTab, setActiveTab] = useState(tabs[0])

    const handleClick = (e, tab) => {
        e.preventDefault()

        setActiveTab(tab)
    }

    const isSelected = (tab) => activeTab.name === tab.name

    return (
        <div>
            <div className={styles.detailstabs}>
                <div className={styles.tabHeader}>
                    {tabs.map((tab) => (
                        <div
                            key={tab.name}
                            className={[styles.tabItem, isSelected(tab) ? styles.selected : ''].join(' ')}
                        >
                            <div key={tab.name} onClick={(e) => handleClick(e, tab)} >
                                {tab.label}
                            </div>
                            {isSelected(tab) && <motion.div layoutId='indicator' className={styles.indicator} />}
                        </div>
                    ))}
                </div>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab.name || "empty"}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                        transition={{
                            duration: .3
                        }}
                    >
                        {activeTab && activeTab?.render()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default AnimeDetailsBottom
