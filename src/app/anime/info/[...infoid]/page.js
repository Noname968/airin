import Episodesection from '@/components/Episodesection'
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import AnimeDetailsTop from '@/components/details/AnimeDetailsTop'
import AnimeDetailsBottom from '@/components/details/AnimeDetailsBottom'
import Navbarcomponent from '@/components/navbar/Navbar'
import Animecards from '@/components/CardComponent/Animecards'
import { getAuthSession } from '@/app/api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
import DetailsContainer from './DetailsContainer'

// async function getInfo(id) {
//   try {
//     let cachedData;
//     if (redis) {
//       cachedData = await redis.get(`info:${id}`); 
//     }
//     if (cachedData) {
//       // console.log("using cached info")
//       return JSON.parse(cachedData);
//     } else {
//       const data = await AnimeInfoAnilist(id);
//       const cacheTime = data?.nextAiringEpisode?.episode ? 60 * 60 * 2 : 60 * 60 * 24 * 45;
//       if (redis) {
//         await redis.set(
//           `info:${id}`,
//           JSON.stringify(data),
//           "EX",
//           cacheTime
//         );
//         // console.log("cached info")
//       }
//       return data;
//     }
//   } catch (error) {
//     console.error("Error fetching info: ", error);
//   } 
// }

export async function generateMetadata({ params }) {
  const id = params.infoid[0];
  // const data = await getInfo(id);
  const data = await AnimeInfoAnilist(id);

  return {
    title: data?.title?.english || data?.title?.romaji || 'Loading...',
    description: data?.description.slice(0, 180),
    openGraph: {
      title: data?.title?.english || data?.title?.romaji,
      images: [data?.coverImage?.extraLarge],
      description: data?.description,
    },
    twitter: {
      card: "summary",
      title: data?.title?.english || data?.title?.romaji,
      description: data?.description?.slice(0, 180),
    },
  }
}

async function AnimeDetails({ params }) {
  const session = await getAuthSession();
  const id = params.infoid[0];
  // const data = await getInfo(id);
  const data = await AnimeInfoAnilist(id);

  return (
    <div className="">
      <Navbarcomponent />
     <DetailsContainer data={data} id={id} session={session}/>
    </div>
  )
}

export default AnimeDetails