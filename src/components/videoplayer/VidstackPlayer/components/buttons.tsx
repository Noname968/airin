import buttonStyles from "../styles/button.module.css";
import tooltipStyles from "../styles/tooltip.module.css";
import { useNowPlaying, useDataInfo } from "@/lib/store";
import { useStore } from "zustand";
import {
  CaptionButton,
  FullscreenButton,
  isTrackCaptionKind,
  MuteButton,
  PIPButton,
  PlayButton,
  Tooltip,
  useMediaState,
  type TooltipPlacement,
  useMediaRemote,
  useMediaStore,
  SeekButton,
  GoogleCastButton,
  AirPlayButton,
} from "@vidstack/react";
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon,
  PlayIcon,
  ReplayIcon,
  NextIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  PreviousIcon,
  SeekForward10Icon,
  SeekBackward10Icon,
  ChromecastIcon,
  AirPlayIcon,
} from "@vidstack/react/icons";
import { useRouter } from "next-nprogress-bar";

export interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement;
  offset?: number | undefined;
  groupedEp?: any;
  host?: boolean;
}

export function Play({ tooltipPlacement, offset }: MediaButtonProps) {
  const isPaused = useMediaState("paused"),
    ended = useMediaState("ended"),
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={`play-button ${buttonStyles.button}`}>
          <Icon className="w-8 h-8" />
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
        offset={offset}
      >
        {isPaused ? "Play" : "Pause"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SeekForwardButton({
  tooltipPlacement,
  offset,
}: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton
          seconds={10}
          className={`play-button ${buttonStyles.button}`}
        >
          <SeekForward10Icon className="w-8 h-8" />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        Forward 10sec
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SeekBackwardButton({
  tooltipPlacement,
  offset,
}: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton
          seconds={-10}
          className={`play-button ${buttonStyles.button}`}
        >
          <SeekBackward10Icon className="w-8 h-8" />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        Backward 10sec
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function NextEpisode({
  tooltipPlacement,
  offset,
  groupedEp,
}: MediaButtonProps) {
  const router = useRouter();
  const nowPlaying = useStore(useNowPlaying, (state) => state.nowPlaying);
  const dataInfo = useStore(useDataInfo, (state) => state.dataInfo);
  function handleNext() {
    router.push(
      `/anime/watch?id=${dataInfo?.id}&host=${nowPlaying?.provider}&epid=${groupedEp?.nextep?.id || groupedEp?.nextep?.episodeId}&ep=${groupedEp?.nextep?.number}&type=${nowPlaying?.subtype}`
    );
  }

  return (
    groupedEp?.nextep && (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            onClick={handleNext}
            onTouchEnd={handleNext}
            className={`play-button ${buttonStyles.button}`}
          >
            <NextIcon className="w-7 h-7" />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          offset={offset}
          className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
          placement={tooltipPlacement}
        >
          Next Episode
        </Tooltip.Content>
      </Tooltip.Root>
    )
  );
}

export function PreviousEpisode({
  tooltipPlacement,
  offset,
  groupedEp,
}: MediaButtonProps) {
  const router = useRouter();
  const nowPlaying = useStore(useNowPlaying, (state) => state.nowPlaying);
  const dataInfo = useStore(useDataInfo, (state) => state.dataInfo);
  function handlePrev() {
    router.push(
      `/anime/watch?id=${dataInfo?.id}&host=${nowPlaying?.provider}&epid=${groupedEp?.previousep?.id || groupedEp?.previousep?.episodeId}&ep=${groupedEp?.previousep?.number}&type=${nowPlaying?.subtype}`
    );
  }

  return (
    groupedEp?.previousep && (
      <Tooltip.Root>
        <Tooltip.Trigger>
          <div
            onClick={handlePrev}
            onTouchEnd={handlePrev}
            className={`play-button mt-[0px] ${buttonStyles.button}`}
          >
            <PreviousIcon className="w-7 h-7" />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          offset={offset}
          className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
          placement={tooltipPlacement}
        >
          Previous Episode
        </Tooltip.Content>
      </Tooltip.Root>
    )
  );
}
export function DesktopPlayButton({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState("paused"),
    ended = useMediaState("ended"),
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon;
  return (
    <PlayButton
      className={`group ring-media-focus relative inline-flex h-16 w-16 media-paused:cursor-pointer cursor-default items-center justify-center rounded-full outline-none`}
    >
      <Icon className="w-10 h-10" />
    </PlayButton>
  );
}

export function MobilePlayButton({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState("paused"),
    ended = useMediaState("ended"),
    Icon = ended ? ReplayIcon : isPaused ? PlayIcon : PauseIcon;
  return (
    <PlayButton
      className={` group ring-media-focus relative inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full outline-none`}
    >
      <Icon className="w-8 h-8" />
    </PlayButton>
  );
}

export function Mute({ tooltipPlacement, offset }: MediaButtonProps) {
  const volume = useMediaState("volume"),
    isMuted = useMediaState("muted");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className={`play-button ${buttonStyles.button}`}>
          {isMuted || volume == 0 ? (
            <MuteIcon className="w-8 h-8" />
          ) : volume < 0.5 ? (
            <VolumeLowIcon className="w-8 h-8" />
          ) : (
            <VolumeHighIcon className="w-8 h-8" />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        {isMuted ? "Unmute" : "Mute"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Caption({ tooltipPlacement, offset }: MediaButtonProps) {
  const track = useMediaState("textTrack"),
    isOn = track && isTrackCaptionKind(track);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className={`play-button ${buttonStyles.button}`}>
          {isOn ? (
            <ClosedCaptionsOnIcon className="w-8 h-8" />
          ) : (
            <ClosedCaptionsIcon className="w-8 h-8" />
          )}
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        {isOn ? "Closed-Captions On" : "Closed-Captions Off"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PIP({ tooltipPlacement, offset }: MediaButtonProps) {
  const isActive = useMediaState("pictureInPicture");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={`play-button ${buttonStyles.button}`}>
          {isActive ? (
            <PictureInPictureExitIcon className="w-8 h-8" />
          ) : (
            <PictureInPictureIcon className="w-8 h-8" />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        {isActive ? "Exit PIP" : "Enter PIP"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PlayNextButton({
  tooltipPlacement,
  groupedEp,
}: MediaButtonProps) {
  // const remote = useMediaRemote();
  const router = useRouter();
  const nowPlaying = useStore(useNowPlaying, (state) => state.nowPlaying);
  const dataInfo = useStore(useDataInfo, (state) => state.dataInfo);
  return (
    <button
      // title="Next Ep"
      type="button"
      onClick={() => {
        if (groupedEp?.nextep) {
          router.push(
            `/anime/watch?id=${dataInfo?.id}&host=${nowPlaying?.provider}&epid=${groupedEp?.nextep?.id || groupedEp?.nextep?.episodeId}&ep=${groupedEp?.nextep?.number}&type=${nowPlaying?.subtype}`
          );
        }
      }}
      className="nextbtn hidden absolute bottom-[70px] sm:bottom-[83px] text-[15px] right-4 z-[40] bg-white text-black py-2 px-3 rounded-[4px] font-medium"
    >
      Next Episode
    </button>
  );
}

export function Fullscreen({ tooltipPlacement, offset }: MediaButtonProps) {
  const isActive = useMediaState("fullscreen");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className={`play-button ${buttonStyles.button}`}>
          {isActive ? (
            <FullscreenExitIcon className="w-8 h-8" />
          ) : (
            <FullscreenIcon className="w-8 h-8" />
          )}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        {isActive ? "Exit Fullscreen" : "Enter Fullscreen"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function ChromeCast({ tooltipPlacement, offset }: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <GoogleCastButton className={`play-button ${buttonStyles.button}`}>
          <ChromecastIcon />
        </GoogleCastButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        Chromecast
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function AirPlay({ tooltipPlacement, offset }: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <AirPlayButton className="media-button">
          <AirPlayIcon />
        </AirPlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        offset={offset}
        className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
        placement={tooltipPlacement}
      >
        Airplay
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

// export function Download({
//   tooltipPlacement,
//   offset,
//   groupedEp
// }: MediaButtonProps) {
//   const router = useRouter();
// const nowPlaying = useStore(useNowPlaying, (state) => state.nowPlaying);
// const dataInfo = useStore(useDataInfo, (state) => state.dataInfo);
//   function handleDownload() {
//     router.push(
//       `${nowPlaying.download}`
//     );
//   }

//   return (
//     nowPlaying?.download && (
//       <Tooltip.Root>
//         <Tooltip.Trigger asChild>
//           <div
//             onClick={handleDownload}
//             onTouchEnd={handleDownload}
//             className={`play-button ${buttonStyles.button}`}
//           >
//           <DownloadIcon/>
//           </div>
//         </Tooltip.Trigger>
//         <Tooltip.Content
//           offset={offset}
//           className={`${tooltipStyles.tooltip} parent-data-[open]:hidden`}
//           placement={tooltipPlacement}
//         >
//           Download Episode
//         </Tooltip.Content>
//       </Tooltip.Root>
//     )
//   );
// }
