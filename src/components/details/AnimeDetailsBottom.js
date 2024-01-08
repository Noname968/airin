"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import styles from '../../styles/AnimeDetailsBottom.module.css'
import { Tabs, Tab, Card, CardBody, CardHeader } from "@nextui-org/react";

function AnimeDetailsBottom({ data }) {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div>
            <div className={styles.detailstabs}>
                <Tabs aria-label="Options" variant='underlined' key="underlined">
                    <Tab key="Overview" title="Overview">
                        <Card className={styles.detailscard}>
                            <CardBody className={styles.card1}>
                                <h3 className={styles.detailsheading}>Details</h3>
                                <div className={styles.detailscontent}>
                                    <div className={styles.singlecontent}>
                                        <span className={styles.sideheading}>Type</span> <span className={styles.con}>{data?.format}</span>
                                    </div>
                                    <div className={styles.singlecontent}>
                                        <span className={styles.sideheading}>Episodes</span> <span className={styles.con}>{data?.episodes || data?.nextAiringEpisode?.episode-1 || "Na"}</span>
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
                            </CardBody>
                            <CardBody>
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
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="Relations" title="Relations">
                        <Card>
                            <CardBody>
                                Coming Soon
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="Characters" title="Characters">
                        <Card>
                            <CardBody>
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </CardBody>
                        </Card>
                    </Tab>
                    <Tab key="Staff" title="Staff">
                        <Card>
                            <CardBody>
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </CardBody>
                        </Card>
                    </Tab>
                </Tabs>
            </div>

        </div>
    )
}

export default AnimeDetailsBottom
