"use client"
import React, { useEffect, useState } from 'react'
import { getSources } from '@/lib/getData';
import PlayerEpisodeList from './PlayerEpisodeList';
import VidstackPlayer from './VidstackPlayer';
import { Checkbox } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { PreviousIcon, NextIcon, SettingsMenuIcon } from '@vidstack/react/icons';

function PlayerComponent({ id, epid, provider, epnum, subdub, data }) {
    const [episodeData, setepisodeData] = useState(null);
    const [episodeSource, setepisodeSource] = useState();
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState(null);
    const [subtitles, setsubtitles] = useState(null);
    const [thumbnails, setthumbnails] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [skiptimes, setSkipTimes] = useState(null);
    const [subtype, setSubtype] = useState('sub');


    useEffect(() => {
        const fetchSources = async () => {
            setLoading(true);

            try {
                const response = await getSources(id, provider, epid, epnum, subdub);
                console.log(response);

                setepisodeSource(response);

                if (response && response.sources && response.sources.length > 0) {
                    setUrl(response.sources);
                }

                if (response && response.download) {
                    setDownloadUrl(response.download);
                }

                if (response && response.subtitles) {
                    const reFormSubtitles = response.subtitles.map((i) => ({
                        src: i.url,
                        label: i.lang,
                        kind: i.lang === "Thumbnails" ? "thumbnails" : "subtitles",
                        ...(i.lang === "English" && { default: true }),
                    }));

                    setsubtitles(reFormSubtitles.filter((s) => s.kind !== 'English'));
                    setthumbnails(response.subtitles.filter((s) => s.lang === 'Thumbnails'));
                }

                const skipResponse = await fetch(
                    `https://api.aniskip.com/v2/skip-times/${data?.idMal}/${parseInt(epnum)}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
                );

                if (!skipResponse.ok) {
                    throw new Error('Failed to fetch skip data');
                }

                const skipData = await skipResponse.json();
                const op = skipData?.results?.find((item) => item.skipType === 'op') || null;
                const ed = skipData?.results?.find((item) => item.skipType === 'ed') || null;
                const episodeLength = skipData?.results?.find((item) => item.episodeLength)?.episodeLength || 0;

                const skiptime = [];

                if (op && op.interval) {
                    skiptime.push({
                        startTime: op.interval.startTime ?? 0,
                        endTime: op.interval.endTime ?? 0,
                        text: 'Opening',
                    });
                }

                if (ed && ed.interval) {
                    skiptime.push({
                        startTime: ed.interval.startTime ?? 0,
                        endTime: ed.interval.endTime ?? 0,
                        text: 'Ending',
                    });
                } else {
                    skiptime.push({
                        startTime: op?.interval?.endTime ?? 0,
                        endTime: episodeLength,
                        text: '',
                    });
                }

                setSkipTimes(skiptime);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchSources();
    }, [id, provider, epid, epnum, subdub]);


    useEffect(() => {
        const storedType = localStorage.getItem('selectedType');
        if (storedType) {
            setSubtype(storedType);
        }
    }, []);
    const [lsSettings, setlsSettings] = useState()

    useEffect(() => {
        setlsSettings(JSON.parse(localStorage.getItem('settings')) || {})
    }, [])

    const defaultSettings = {
        autoplay: false,
        autoskip: false,
        autonext: false,
    };
    const [settings, setSettings] = useState({
        ...defaultSettings,
        ...lsSettings,
    });

    const { autoplay, autoskip, autonext } = settings;

    useEffect(() => {
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    const router = useRouter();
    const [showIcons, setShowIcons] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isSmallScreen = windowWidth < 500;

    const toggleIcons = () => {
        setShowIcons((prevShowIcons) => !prevShowIcons);
    };

    const getPrevEpisode = () => {
        const previousep = episodeData?.find(
            (i) => i.number === parseInt(epnum) - 1
        );
        if (previousep) {
            router.push(`/anime/watch/${data.id}/${provider}/${previousep.number}?epid=${previousep.id}&type=${subtype}`)
        }
    };

    const getNextEpisode = () => {
        const nextep = episodeData?.find(
            (i) => i.number === parseInt(epnum) + 1
        );
        if (nextep) {
            router.push(`/anime/watch/${data.id}/${provider}/${nextep.number}?epid=${nextep.id}&type=${subtype}`)
        }
    };

    const getCurrentEpisode = () => {
        const epdetails = episodeData?.find((i) => i.number === parseInt(epnum))
        return epdetails;
    };

    const currentep = getCurrentEpisode();

    return (
        <div className='xl:w-[96.5%]'>
            <div>
                <div className='mb-2'>
                    {!loading && url ? (
                        <div className='h-full w-full aspect-video overflow-hidden'>
                            <VidstackPlayer sources={url} skiptimes={skiptimes} epid={epid} getNextEpisode={getNextEpisode} provider={provider} subtype={subtype}
                                autoplay={autoplay} currentep={currentep} data={data} thumbnails={thumbnails} subtitles={subtitles} />
                        </div>
                    ) : (
                        <div className="bg-[#18181b] h-full w-full rounded-[8px] flex items-center text-xl justify-center aspect-video">
                            Loading...
                        </div>
                    )}
                </div>
                <div className="flex flex-row gap-2 items-center justify-between px-1 h-[20px] mb-[13px] w-[99%] lg:w-full">
                    <div className="flex flex-row gap-2 items-center scroll-smooth">
                        {showIcons && <>
                            <Checkbox isSelected={autoplay} onValueChange={(value) => setSettings({ ...settings, autoplay: value })} color="default" size='sm' className="text-[10px]">
                                <span className='text-[12px] text-[#ffffffb2]'>Auto Play</span>
                            </Checkbox>
                            <Checkbox isSelected={autonext} onValueChange={(value) => setSettings({ ...settings, autonext: value })} color="default" size="sm">
                                <span className='text-[12px] text-[#ffffffb2]'>Auto Next</span>
                            </Checkbox>
                            {!isSmallScreen && (
                                <Checkbox
                                    isSelected={autoskip}
                                    onValueChange={(value) => setSettings({ ...settings, autoskip: value })}
                                    color="default"
                                    size="sm"
                                >
                                    <span className='text-[12px] text-[#ffffffb2]'>Auto Skip</span>
                                </Checkbox>
                            )}
                        </>}
                    </div>
                    <div className='flex flex-row gap-2 items-center scroll-smooth'>
                        <span className='flex flex-row text-[12.5px] gap-[3px] cursor-pointer text-[#ffffffb2]' onClick={getPrevEpisode}> <PreviousIcon width={17} /> Prev </span>
                        <span className='flex flex-row text-[12.5px] gap-[3px] cursor-pointer text-[#ffffffb2]' onClick={getNextEpisode}> <NextIcon width={17} /> Next </span>
                        <span className='flex flex-row text-[12.5px] gap-[3px] cursor-pointer' onClick={toggleIcons}> <SettingsMenuIcon width={20} /> </span>
                    </div>
                </div>
                <div className=' my-[9px] mx-2 sm:mx-1 px-1 lg:px-0'>
                    <h2 className='text-[20px]'>{data?.title?.english || data?.title?.romaji}</h2>
                    <h2 className='text-[16px] text-[#ffffffb2]'>{` EPISODE ${currentep?.number || epnum} `}</h2>
                </div>
            </div>
            <div className='w-[98%] mx-auto lg:w-full'>
            <PlayerEpisodeList id={id} data={data} setwatchepdata={setepisodeData} onprovider={provider} epnum={epnum}/>
            </div>
        </div>
    )
}

export default PlayerComponent
