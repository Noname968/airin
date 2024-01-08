import React from "react";
import VideoPlayer from "@/components/videoplayer/VideoPlayer";
import PlayerEpisodeList from "@/components/videoplayer/PlayerEpisodeList";
import AnimeNavbar from "@/components/Animenavbar";
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions'
import NextAiringDate from "@/components/videoplayer/NextAiringDate";
import PlayerAnimeCard from "@/components/videoplayer/PlayerAnimeCard";
import { getEpisodes, getSources } from "@/lib/getData";

async function AnimeWatch({ params, searchParams }) {
  const id = params.watchid[0];
  const provider = params.watchid[1];
  const epnum = params.watchid[2];
  const epid = searchParams.epid;
  const subdub = searchParams.type;
  const data = await AnimeInfoAnilist(id);
  const episodeData = await getEpisodes(id,data?.status,false);
  const episodeSource = await getSources(id, provider, epid, epnum, subdub);

  console.log(id,provider,epid,epnum,subdub)

  // console.log(epnum)
  // console.log(data.relations.edges)

  return (
    <>
    <AnimeNavbar/>
    <div className=" max-md:max-w-[1200px] mx-auto lg:max-w-[94%] mt-[60px] xl:flex xl:flex-row xl:justify-between flex flex-col justify-center">
      <div className=" flex-grow">
      <VideoPlayer epid={epid} episodeSource={episodeSource} provider={provider} epnum={epnum} data={data}  episodeData={episodeData}/>
      <PlayerEpisodeList data={data} episodeData={episodeData} onprovider={provider}/>
      {data?.status==='RELEASING' && 
      <NextAiringDate nextAiringEpisode={data.nextAiringEpisode}/>
      }
      </div>
      <div className="xl:max-w-[100%] my-5">
        <h2 className="px-[8px] lg:px-[2px] lg:text-[22px] text-[18px]">Related Anime</h2>
      <div className=" xl:max-h-[400px] xl:max-w-[380px] max-w-[1000px] xl:overflow-y-scroll xl:overflow-x-hidden overflow-x-scroll scrollbar-hide overflow-y-hidden">
      <PlayerAnimeCard data={data?.relations?.edges}/>
      </div>
      <h2 className="px-[8px] lg:px-[2px] lg:text-[22px] text-[18px] mt-[30px]">Recommendations</h2>
      <div className=" xl:max-h-[100%] xl:max-w-[380px] max-w-[1000px] xl:overflow-y-scroll xl:overflow-x-hidden overflow-x-scroll scrollbar-hide overflow-y-hidden">
      <PlayerAnimeCard data={data?.relations?.edges}/>
      </div>
      </div>
    </div>
    </>
  );
}

export default AnimeWatch;
