import Episodesection from '@/components/Episodesection'
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import AnimeDetailsTop from '@/components/details/AnimeDetailsTop'
import AnimeDetailsBottom from '@/components/details/AnimeDetailsBottom'
import AnimeNavbar from '@/components/Animenavbar'
import { getEpisodes } from '@/lib/getData'
import RecommendationCard from '@/components/details/RecommendationCard'

// async function getData(id,status,refresh=false) {
//   try {
//     const response = await fetch(
//       `${checkEnvironment()}/api/episode/${id}?releasing=${status === "RELEASING" ? "true" : "false"}&refresh=${refresh}`
//     );
//     if (!response.ok) {
//       throw new Error('Failed to fetch episodes')
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching Consumet Episodes:", error);
//   } 
// }

async function AnimeDetails({params}) {
  const id = params.infoid[0];
  const data = await AnimeInfoAnilist(id);
  // const episodeData = await getEpisodes(id,data?.status,false);
  
  return (
    <div className="">
      <AnimeNavbar/>
      <div className='h-[460px] sm:h-[500px] '>
      <AnimeDetailsTop data={data}/>
      </div>
      <AnimeDetailsBottom data={data}/>
      <Episodesection data={data}/>
      <div className="recommendationglobal">
      <RecommendationCard data={data.recommendations.nodes} title={"Recommendations"}/>
      </div>
    </div>
  )
}

export default AnimeDetails
