import React from "react";
import PlayerEpisodeList from "@/components/videoplayer/PlayerEpisodeList";
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions'
import NextAiringDate from "@/components/videoplayer/NextAiringDate";
import PlayerAnimeCard from "@/components/videoplayer/PlayerAnimeCard";
import { getEpisodes, getSources } from "@/lib/getData";
import Navbarcomponent from "@/components/navbar/Navbar";
import PlayerComponent from "@/components/videoplayer/PlayerComponent";
import Animecards from "@/components/CardComponent/Animecards";

export async function generateMetadata({ params }) {
  const id = params.watchid[0];
  const data = await AnimeInfoAnilist(id);
  const epnum = params.watchid[2];
  
  return {
    title:"Episode "+ epnum + ' - ' + data?.title.english || data?.title.romaji || 'Loading...',
    description: data?.description.slice(0,180),
    openGraph: {
      title:"Episode "+ epnum + ' - ' + data?.title.english || data?.title.romaji,
      images: [data?.coverImage?.extraLarge],
      description: data?.description,
    },
    twitter: {
      card: "summary",
      title:"Episode "+ epnum + ' - ' + data?.title.english || data?.title.romaji,
      description: data?.description.slice(0,180),
    },
  }
}


async function AnimeWatch({ params, searchParams }) {
  const id = params.watchid[0];
  const provider = params.watchid[1];
  const epnum = params.watchid[2];
  const epid = searchParams.epid;
  const subdub = searchParams.type;
  const data = await AnimeInfoAnilist(id);
  // const episodeData = await getEpisodes(id,data?.status,false);
  // const episodeSource = await getSources(id, provider, epid, epnum, subdub);

  console.log(id, provider, epid, epnum, subdub)

  // console.log(epnum)
  // console.log(data.relations.edges)

  return (
    <>
      <div className="h-[65px]">
        <Navbarcomponent />
      </div>
      <div className=" w-full flex flex-col lg:flex-row lg:max-w-[98%] mx-auto xl:max-w-[94%] lg:gap-[6px]">
        <div className="flex-grow w-full h-full">
          <PlayerComponent id={id} epid={epid} provider={provider} epnum={epnum} data={data} subdub={subdub} />
          {data?.status === 'RELEASING' &&
            <NextAiringDate nextAiringEpisode={data.nextAiringEpisode} />
          }
        </div>
        <div className="h-full lg:flex lg:flex-col md:max-lg:w-full gap-10">
        <div className="rounded-lg hidden lg:block lg:max-w-[280px] xl:max-w-[400px] w-[100%] xl:overflow-y-scroll xl:overflow-x-hidden overflow-hidden scrollbar-hide overflow-y-hidden">
            <PlayerAnimeCard data={data?.relations?.edges} id="Related Anime"/>
          </div>
          <div className="rounded-lg hidden lg:block lg:max-w-[280px] xl:max-w-[400px] w-[100%] xl:overflow-y-scroll xl:overflow-x-hidden overflow-hidden scrollbar-hide overflow-y-hidden">
            <PlayerAnimeCard data={data?.recommendations?.nodes} id="Recommendations"/>
          </div>
        </div>
        <div className="lg:hidden">
        <Animecards data={data?.relations?.edges} cardid="Related Anime"/>
        </div>
        <div className="lg:hidden">
        <Animecards data={data?.recommendations?.nodes} cardid={"Recommendations"}/>
        </div>
      </div>
    </>
  );
}

export default AnimeWatch;
