"use client"
import React, { useState, useEffect } from 'react';
import VidstackPlayer from './VidstackPlayer';
import { Checkbox } from "@nextui-org/react";
import { useRouter } from 'next/navigation'
import { PreviousIcon, NextIcon, SettingsMenuIcon } from '@vidstack/react/icons';
import { ProvidersMap } from '@/utils/EpisodeFunctions';

function VideoPlayer({ epid, epnum, data, provider, episodeSource, episodeData }) {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(null);
  const [subtitles, setsubtitles] = useState(null);
  const [thumbnails, setthumbnails] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [skiptimes, setSkipTimes] = useState(null);
  const [subtype, setSubtype] = useState('sub');

  useEffect(() => {
    const storedType = localStorage.getItem('selectedType');
    if (storedType) {
      setSubtype(storedType);
    }
  }, []);
  const [lsSettings,setlsSettings] = useState()

  useEffect(()=>{
    setlsSettings(JSON.parse(localStorage.getItem('settings')) || {})
  },[])

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
  const [consumetProvider, setConsumetProvider] = useState(null);
  const [defaultProvider, setdefaultProvider] = useState(null);
  const [allProviders, setAllProviders] = useState(null);
  const [currentEpisodes, setCurrentEpisodes] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const providers = ProvidersMap(episodeData, setConsumetProvider, defaultProvider, setdefaultProvider, subtype);
    setAllProviders(providers);
  }, [episodeData, subtype]);  

  const selectedProvider = allProviders?.find((i) => i.providerId === provider);

useEffect(() => {
  if (selectedProvider?.consumet === true) {
    setCurrentEpisodes(consumetProvider);
  } else {
    setCurrentEpisodes(
      subtype === 'dub'
        ? selectedProvider?.episodes?.filter((item) => item.hasDub === true) || []
        : selectedProvider?.episodes?.slice(0) || []
    );
  }
}, [selectedProvider, consumetProvider, subtype]);

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
  
  useEffect(() => {
    if (episodeSource && episodeSource.sources && episodeSource.sources.length > 0) {
      setUrl(episodeSource.sources);
    }

    if (episodeSource && episodeSource.download) {
      setDownloadUrl(episodeSource.download)
    }

    if (episodeSource && episodeSource.subtitles) {
      const reFormSubtitles = episodeSource?.subtitles?.map((i) => {
        return {
          src: i.url,
          label: i.lang,
          kind: i.lang === "Thumbnails" ? "thumbnails" : "subtitles",
          ...(i.lang === "English" && { default: true }),
        };
      });
      setsubtitles(reFormSubtitles.filter((s)=>s.kind!=='English'))
      setthumbnails(episodeSource.subtitles.filter((s)=>s.lang==='Thumbnails'))
    }

    const fetchData = async () => {
      try {
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
    // console.log(skiptime)
        setSkipTimes(skiptime);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [epid, episodeSource]);

  const getPrevEpisode = () => {
    const previousep = currentEpisodes?.find(
      (i) => i.number === parseInt(epnum) - 1
    );
    if (previousep) {
      router.push(`/anime/watch/${data.id}/${provider}/${previousep.number}?epid=${previousep.id}&type=${subtype}`)
    }
  };

  const getNextEpisode = () => {
    const nextep = currentEpisodes?.find(
      (i) => i.number === parseInt(epnum) + 1
    );
    if (nextep) {
      router.push(`/anime/watch/${data.id}/${provider}/${nextep.number}?epid=${nextep.id}&type=${subtype}`)
    }
  };

  const getCurrentEpisode = () => {
    const epdetails = currentEpisodes?.find((i) => i.number === parseInt(epnum))
    return epdetails;
  };

  const currentep = getCurrentEpisode();

  return (
    <div>
      <div className='aspect-video max-w-[1000px] max-h-[600px]'>
        {!loading ? (
          <div className='h-full w-full mb-2'>
            <VidstackPlayer sources={url} skiptimes={skiptimes} epid={epid} getNextEpisode={getNextEpisode} provider={provider} subtype={subtype}
             autoplay={autoplay} currentep={currentep} data={data} thumbnails={thumbnails} subtitles={subtitles} />
          </div>
        ) : (
          <div className="bg-[#18181b] h-full w-full rounded-[8px] flex items-center text-xl justify-center mb-2 aspect-video overflow-hidden">
            Loading...
          </div>
        )}
      </div>
      <div className="flex flex-row gap-2 items-center max-w-[1000px] justify-between px-1 h-[20px] mb-[13px]">
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
      <div className=' my-[9px] mx-2 sm:mx-1'>
        <h2 className='text-[20px]'>{data?.title?.english || data?.title?.romaji}</h2>
        <h2 className='text-[16px] text-[#ffffffb2]'>{` EPISODE ${currentep?.number || epnum} `}</h2>
      </div>
    </div>
  );
}

export default VideoPlayer;
