"use client"
import React, { useState, useEffect, useRef } from 'react'
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, useMediaStore, MediaProvider, useMediaRemote, TextTrack, Gesture, Track, PlayButton } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import styles from '../../styles/Vidstackstyles.module.css'
import VideoProgressSave from '@/utils/VideoProgressSave';

function VidstackPlayer({ data, sources, skiptimes, epid, thumbnails, subtitles, getNextEpisode, currentep, provider, subtype, epnum, settings }) {
    const [getVideoProgress, UpdateVideoProgress] = VideoProgressSave();
    const playerRef = useRef(null);
    const { duration } = useMediaStore(playerRef);
    const remote = useMediaRemote(playerRef);
    const defaultQuality = 'default';
    const fallbackQualities = ['auto', '1080p'];
    const sourceWithDefaultQuality = sources?.find(source => source?.quality === defaultQuality);
    const selectedSource = sourceWithDefaultQuality || sources?.find(source => fallbackQualities?.includes(source.quality));

    const [src, setSrc] = useState(selectedSource?.url || '');
    const [opbutton, setopbutton] = useState(false);
    const [edbutton, setedbutton] = useState(false);
    const [autoSkip, setAutoSkip] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    let interval;
    let autoNext = true

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedSettings = localStorage.getItem('settings');
            const parsedSettings = storedSettings ? JSON.parse(storedSettings) : {};
            const initialAutoSkip = parsedSettings.autoskip || false;
            setAutoSkip(initialAutoSkip);
        }
    }, []);

    useEffect(() => {
        // if (subtitles && subtitles.length > 0) {
        //     const track = new TextTrack({
        //         kind: 'subtitles',
        //         default: true,
        //         label: 'English',
        //         language: 'en-US',
        //         type: 'vtt',
        //         src: subtitles[0]?.url || ''
        //     });

        //     playerRef.current.textTracks.add(track);
        // }

        playerRef.current?.subscribe(({ currentTime, duration }) => {

            if (skiptimes && skiptimes.length > 0) {
                const opStart = skiptimes[0]?.startTime ?? 0;
                const opEnd = skiptimes[0]?.endTime ?? 0;

                const epStart = skiptimes[1]?.startTime ?? 0;
                const epEnd = skiptimes[1]?.endTime ?? 0;

                const opButtonText = skiptimes[0]?.text || "";
                const edButtonText = skiptimes[1]?.text || "";

                setopbutton(opButtonText === "Opening" && (currentTime > opStart && currentTime < opEnd));
                setedbutton(edButtonText === "Ending" && (currentTime > epStart && currentTime < epEnd));

                if (autoSkip) {
                    if (currentTime > opStart && currentTime < opEnd) {
                        console.log("Skipping OP...");
                        Object.assign(playerRef.current ?? {}, { currentTime: opEnd });
                        return null;
                    }
                    if (currentTime > epStart && currentTime < epEnd) {
                        console.log("Skipping EP...");
                        Object.assign(playerRef.current ?? {}, { currentTime: epEnd });
                        return null;
                    }
                }
            }

        })

    }, []);

    function onCanPlay() {
        if (skiptimes && skiptimes.length > 0) {
            const track = new TextTrack({
                kind: 'chapters',
                default: true,
                label: 'English',
                language: 'en-US',
                type: 'json'
            });
            for (const cue of skiptimes) {
                track.addCue(new window.VTTCue(Number(cue.startTime), Number(cue.endTime), cue.text))
            }
            playerRef.current.textTracks.add(track);
        }
    }

    function onEnd() {
        if (autoNext) {
            getNextEpisode();
        }
        // console.log("End")
        setIsPlaying(false);
    }

    function onEnded() {
        if (autoNext) {
            getNextEpisode();
        }
    }

    function onPlay() {
        // console.log("play")
        setIsPlaying(true);
    }

    function onPause() {
        // console.log("pause")
        setIsPlaying(false);
    }

    useEffect(() => {
        if (isPlaying) {
            interval = setInterval(async () => {
                const currentTime = playerRef.current?.currentTime
                    ? Math.round(playerRef.current?.currentTime)
                    : 0;

                const epimage = currentep.img?.includes("null")
                    ? data?.coverImage?.extraLarge
                    : currentep?.image || currentep?.img;

                UpdateVideoProgress(data?.id, {
                    id: String(data?.id),
                    epid: epid,
                    eptitle: currentep?.title || `EP ${currentep?.number}`,
                    aniTitle: data?.title?.romaji || data?.title?.english,
                    image: epimage || data?.bannerImage || data?.coverImage?.extraLarge || '',
                    epnum: Number(currentep?.number) || Number(epnum),
                    duration: duration,
                    timeWatched: currentTime,
                    provider: provider,
                    //   nextId: navigation?.next?.id,
                    //   nextNumber: navigation?.next?.number,
                    subtype: subtype,
                    createdAt: new Date().toISOString(),
                });
            }, 5000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isPlaying, duration]);

    function onLoadedMetadata() {
        const seek = getVideoProgress(data?.id);
        if (seek?.epnum === Number(epnum)) {
            const seekTime = seek?.timeWatched;
            const percentage = duration !== 0 ? seekTime / Math.round(duration) : 0;

            if (percentage >= 0.9) {
                remote.seek(0);
            } else {
                remote.seek(seekTime-3);
            }
        }
    }

    function handleop() {
        console.log("Skipping OP...");
        Object.assign(playerRef.current ?? {}, { currentTime: skiptimes[0]?.endTime ?? 0 });
    }

    function handleed() {
        console.log("Skipping ED...");
        Object.assign(playerRef.current ?? {}, { currentTime: skiptimes[1]?.endTime ?? 0 });
    }

    return (
        <MediaPlayer key={sources} ref={playerRef} playsinline aspectRatio={16 / 9} load={settings?.load || 'idle'} muted={settings?.audio || false}
        autoFocus={true} autoplay={settings?.autoplay || false} title={currentep?.title || `EP ${currentep?.number}`}
            data-hocus="true"
            className={`w-full h-full overflow-hidden cursor-pointer rounded-lg ${styles.mediaplayer}`}
            crossorigin={"anonymous"}
            streamType="on-demand"
            onEnd={onEnd}
            onEnded={onEnded}
            onCanPlay={onCanPlay}
            src={{
                src: src,
                type: "application/x-mpegurl",
            }}
            onPlay={onPlay}
            onPause={onPause}
            onLoadedMetadata={onLoadedMetadata}
        // onTimeUpdate={onTimeUpdate}
        >
            <div className={styles.bigplaycontainer}>
                <PlayButton className={styles.vdsbutton}>
                    <span className="backdrop-blur-sm scale-[160%] absolute duration-200 ease-out flex shadow bg-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                        <svg className="w-7 h-7 m-2" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M10.6667 6.6548C10.6667 6.10764 11.2894 5.79346 11.7295 6.11862L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.3771 16.5357L11.7295 25.8813C11.2895 26.2065 10.6667 25.8923 10.6667 25.3451L10.6667 6.6548Z" fill="currentColor"></path></svg>
                    </span>
                </PlayButton>
            </div>
            <MediaProvider>
            {subtitles && subtitles?.map((track) => (
            <Track {...track} key={track.src} />
          ))}
            </MediaProvider>
            <Gesture className="vds-gesture" event="pointerup" action="toggle:paused" />
            <Gesture className="vds-gesture" event="pointerup" action="toggle:controls" />
            <Gesture className="vds-gesture" event="dblpointerup" action="seek:-5" />
            <Gesture className="vds-gesture" event="dblpointerup" action="seek:5" />
            <Gesture className="vds-gesture" event="dblpointerup" action="toggle:fullscreen" />
            {opbutton && <button onClick={handleop} className='absolute bottom-[83px] right-4 z-[80] bg-white text-black py-2 px-3 rounded-[8px] font-medium'>Skip Opening</button>}
            {edbutton && <button onClick={handleed} className='absolute bottom-[83px] right-4 z-[80] bg-white text-black py-2 px-3 rounded-[8px] font-medium'>Skip Ending</button>}
            <DefaultVideoLayout icons={defaultLayoutIcons} thumbnails={thumbnails ? `https://cors-anywhere-livid-six.vercel.app/` + thumbnails[0]?.url : ""} />
        </MediaPlayer>
    )
}

export default VidstackPlayer
