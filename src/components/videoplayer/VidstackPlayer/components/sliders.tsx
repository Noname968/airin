import styles from '../styles/slider.module.css';

import { TimeSlider, VolumeSlider } from '@vidstack/react';

export function Volume() {
  return (
    <VolumeSlider.Root className={`volume-slider ${styles.slider} ${styles.sliderSmall} ${styles.volumehide}`}>
      <VolumeSlider.Track className={styles.track} />
      <VolumeSlider.TrackFill className={`${styles.trackFill} ${styles.track}`} />
      <VolumeSlider.Preview className={styles.preview} noClamp>
        <VolumeSlider.Value className={styles.volumeValue} />
      </VolumeSlider.Preview>
      <VolumeSlider.Thumb className={styles.thumb} />
    </VolumeSlider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  return (
    <TimeSlider.Root className={`time-slider ${styles.slider}`}>
      <TimeSlider.Chapters className={styles.chapters}>
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div
              className="last-child:mr-0 group/slider relative mr-0.5 flex h-full w-full items-center rounded-[1px]"
              style={{ contain: "layout style" }}
              key={cue.startTime}
              ref={forwardRef}
            >
              <TimeSlider.Track className="relative ring-media-focus z-0 h-[5px] group-hover/slider:h-[10px] transition-all duration-100 w-full rounded-sm bg-white/30 group-data-[focus]:ring-[3px]">
                <TimeSlider.TrackFill className="bg-white absolute h-full w-[var(--chapter-fill)] rounded-sm will-change-[width]" />
                <TimeSlider.Progress className="absolute z-10 h-full w-[var(--chapter-progress)] rounded-sm bg-white/50 will-change-[width]" />
              </TimeSlider.Track>
            </div>
          ))
        }
      </TimeSlider.Chapters>

      <TimeSlider.Thumb className={styles.thumb} />

      <TimeSlider.Preview className={styles.preview}>
        {thumbnails ? (
          <TimeSlider.Thumbnail.Root src={thumbnails} className={styles.thumbnail}>
            <TimeSlider.Thumbnail.Img />
          </TimeSlider.Thumbnail.Root>
        ) : null}

        <TimeSlider.ChapterTitle className={styles.chapterTitle} />

        <TimeSlider.Value className={styles.timeValue} />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}
