import captionStyles from '../../styles/captions.module.css';
import chapterTitleStyles from '../../styles/chapter-title.module.css';
import styles from '../../styles/video-layout.module.css';

import { Captions, ChapterTitle, Controls, Gesture, Spinner } from '@vidstack/react';
import * as Buttons from '../buttons';
import * as Menus from '../menus';
import * as Sliders from '../sliders';
import { Titleb } from '../title';
import { TimeGroup } from '../time-group';

export interface VideoLayoutProps {
  groupedEp?: any;
  thumbnails?: string;
  subtitles?: any
}

export function VideoLayout({ groupedEp, thumbnails, subtitles }: VideoLayoutProps) {
  return (
    <>
      <Gestures />
      <Captions className={captionStyles.captions} />
      <Controls.Root hideDelay={1000}
        className={`${styles.controls} media-paused:bg-black/10 duration-200 media-controls:opacity-100 absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/30 via-transparent to-black/30 opacity-0 transition-opacity`}
      >
        <Controls.Group className="flex justify-between items-center w-full px-1 pt-1">
          <div className='flex sm:hidden items-center justify-between w-full'>
          {/* <Buttons.ChromeCast tooltipPlacement='top'/> */}
          <div className='flex-1'></div>
          <div className="flex sm:hidden items-center">
            {subtitles?.length>0 && (
              <Buttons.Caption tooltipPlacement="top" />
              )}
            <Menus.Settings
              placement="left start"
              tooltipPlacement="left start"
              subtitles={subtitles}
              />
            <Buttons.Mute offset={10} tooltipPlacement="bottom" />
          </div>
              </div>
        </Controls.Group>
       {/* Mobile Display */}
        <Controls.Group
          className={`duration-200 ease-out flex sm:hidden gap-5 items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20`}
        >
          <div className="sm:hidden backdrop-blur-lg shadow bg-black/65 rounded-full">
            <Buttons.MobilePlayButton
              tooltipPlacement="top center"
            />
          </div>
        </Controls.Group>

        {/* Desktop Playbtn */}
        <Controls.Group
          className={`hidden media-paused:opacity-100 media-paused:scale-100 backdrop-blur-lg scale-[150%] opacity-0 duration-200 ease-out sm:flex shadow bg-black/65 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
        >
          <Buttons.DesktopPlayButton tooltipPlacement="top center" />
        </Controls.Group>

        {/* LOADING */}
        <div className="pointer-events-none absolute inset-0 z-[100] flex h-full w-full items-center justify-center">
          <Spinner.Root
            className="text-white opacity-0 transition-opacity duration-200 ease-linear media-buffering:animate-spin media-buffering:opacity-100"
            size={88}
          >
            <Spinner.Track className="opacity-25" width={8} />
            <Spinner.TrackFill className="opacity-75" width={8} />
          </Spinner.Root>
        </div>

        <Controls.Group className="flex px-4">
          <div className="flex-1" />
          <>
            <Buttons.PlayNextButton
              groupedEp={groupedEp}
              tooltipPlacement="top end"
            />
          </>
        </Controls.Group>

        {/* Desktop Display */}
        <div className={styles.spacer} />
        <Controls.Group className={`${styles.controlsGroup} mb-[5px]`}>
          <Sliders.Time thumbnails={thumbnails} />
        </Controls.Group>
        <Controls.Group className={`${styles.controlsGroup} pb-[10px]`}>
          <Buttons.PreviousEpisode
            offset={0}
            groupedEp={groupedEp}
            tooltipPlacement="top start"
          />
          <Buttons.Play tooltipPlacement="top start" />
          <Buttons.NextEpisode
            offset={0}
            groupedEp={groupedEp}
            tooltipPlacement="top"
          />
          <Buttons.Mute tooltipPlacement="top" />
          <Sliders.Volume />
          <TimeGroup />
          <Titleb />
          <div className={styles.spacer} />
          <Buttons.Caption tooltipPlacement="top"/>
          {/* <Buttons.Download tooltipPlacement='top'/> */}
          <Menus.Settings placement="top end" tooltipPlacement="top end" subtitles={subtitles}/>
          {/* <Buttons.ChromeCast tooltipPlacement='top'/> */}
          <Buttons.PIP tooltipPlacement="top" />
          <Buttons.Fullscreen tooltipPlacement="top end" />
        </Controls.Group>

        {/* mobile controls */}
        <Controls.Group className="flex sm:hidden w-full items-center px-1 z-20 mb-[-5px]">
          <div className="w-full flex items-center justify-between z-20">
            <TimeGroup />
            <div className="flex">
              <Buttons.Fullscreen offset={10} tooltipPlacement="top end" />
            </div>
          </div>
        </Controls.Group>

        <Controls.Group className="flex sm:hidden w-full items-center px-1 pb-1 z-20 mb-[10px] ">
          <Sliders.Time thumbnails={thumbnails} />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

function Gestures() {
  return (
    <>
      <Gesture className={styles.gesture} event="pointerup" action="toggle:paused" />
      <Gesture className={styles.gesture} event="dblpointerup" action="toggle:fullscreen" />
      <Gesture className={styles.gesture} event="pointerup" action="toggle:controls" />
      <Gesture className={styles.gesture} event="dblpointerup" action="seek:-10" />
      <Gesture className={styles.gesture} event="dblpointerup" action="seek:10" />
    </>
  );
}
