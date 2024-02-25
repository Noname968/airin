import React from "react";
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions'
import NextAiringDate from "@/components/videoplayer/NextAiringDate";
import PlayerAnimeCard from "@/components/videoplayer/PlayerAnimeCard";
import Navbarcomponent from "@/components/navbar/Navbar";
import PlayerComponent from "@/components/videoplayer/PlayerComponent";
import Animecards from "@/components/CardComponent/Animecards";
import { createWatchEp, getEpisode } from "@/lib/EpHistoryfunctions";
import { WatchPageInfo } from "@/lib/AnilistUser";
import { getAuthSession } from "../../../api/auth/[...nextauth]/route";
import { redis } from '@/lib/rediscache';

export const revalidate = 60;

async function getInfo(token,id) {
  try {
    let cachedData;
    if (redis) {
      cachedData = await redis.get(`info:${id}`); 
    }
    if (cachedData) {
      // console.log("using cached info")
      return JSON.parse(cachedData);
    } else {
      const data = await WatchPageInfo(null,id);
      const cacheTime = data?.nextAiringEpisode?.episode ? 60 * 60 * 2 : 60 * 60 * 24 * 45;
      if (redis) {
        await redis.set(
          `info:${id}`,
          JSON.stringify(data),
          "EX",
          cacheTime
        );
        // console.log("cached info")
      }
      return data;
    }
  } catch (error) {
    console.error("Error fetching info: ", error);
  } 
}

export async function generateMetadata({ params, searchParams }) {
  const session = await getAuthSession();
  const id =  searchParams.id;
  const data = await getInfo(session?.user?.token, id);
  const epnum =  searchParams.ep;
  
  return {
    title:"Episode "+ epnum + ' - ' + data?.title?.english || data?.title?.romaji || 'Loading...',
    description: data?.description?.slice(0,180),
    openGraph: {
      title:"Episode "+ epnum + ' - ' + data?.title?.english || data?.title?.romaji,
      images: [data?.coverImage?.extraLarge],
      description: data?.description,
    },
    twitter: {
      card: "summary",
      title:"Episode "+ epnum + ' - ' + data?.title?.english || data?.title?.romaji,
      description: data?.description?.slice(0,180),
    },
  }
}

export async function Ephistory(session, epId, aniId){
  try {
    let savedep;
    if (session) {
      await createWatchEp(epId, aniId);
      savedep = await getEpisode(epId);
    }
    return savedep;
  } catch (error) {
    console.error(error);
    return null;
  }
};

async function AnimeWatch({ params, searchParams }) {
  const session = await getAuthSession();
  const id = searchParams.id;
  const provider = searchParams.host;
  const epNum = searchParams.ep;
  const epId = searchParams.epid;
  const subdub = searchParams.type;
  const data = await getInfo(session?.user?.token, id);
  const savedep = await Ephistory(session, epId, id);
  // console.log(savedep)
  // console.log(data)

  return (
    <>
        <Navbarcomponent />
      <div className=" w-full flex flex-col lg:flex-row lg:max-w-[98%] mx-auto xl:max-w-[94%] lg:gap-[6px] mt-[70px]">
        <div className="flex-grow w-full h-full">
          <PlayerComponent id={id} epId={epId} provider={provider} epNum={epNum} data={data} subdub={subdub} session={session} savedep={savedep}/>
          {data?.status === 'RELEASING' &&
            <NextAiringDate nextAiringEpisode={data?.nextAiringEpisode} />
          }
        </div>
        <div className="h-full lg:flex lg:flex-col md:max-lg:w-full gap-10">
        {/* <div className="rounded-lg hidden lg:block lg:max-w-[280px] xl:max-w-[380px] w-[100%] xl:overflow-y-scroll xl:overflow-x-hidden overflow-hidden scrollbar-hide overflow-y-hidden">
            <PlayerAnimeCard data={data?.relations?.edges} id="Related Anime"/>
          </div> */}
          <div className="rounded-lg hidden lg:block lg:max-w-[280px] xl:max-w-[380px] w-[100%] xl:overflow-y-scroll xl:overflow-x-hidden overflow-hidden scrollbar-hide overflow-y-hidden">
            <PlayerAnimeCard data={data?.recommendations?.nodes} id="Recommendations"/>
          </div>
        </div>
        {/* <div className="lg:hidden">
        <Animecards data={data?.relations?.edges} cardid="Related Anime"/>
        </div> */}
        <div className="lg:hidden">
        <Animecards data={data?.recommendations?.nodes} cardid={"Recommendations"}/>
        </div>
      </div>
    </>
  );
}

export default AnimeWatch;
