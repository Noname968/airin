import Episodesection from '@/components/Episodesection'
import { AnimeInfoAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import AnimeDetailsTop from '@/components/details/AnimeDetailsTop'
import AnimeDetailsBottom from '@/components/details/AnimeDetailsBottom'
import Navbarcomponent from '@/components/navbar/Navbar'
import Animecards from '@/components/CardComponent/Animecards'
import { redis } from '@/lib/rediscache'

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
  const id = params.infoid[0];
  // const data = await getInfo(id);
  const data = await AnimeInfoAnilist(id);

  return (
    <div className="">
      <Navbarcomponent />
      <div className='h-[500px] '>
        <AnimeDetailsTop data={data} />
      </div>
      <AnimeDetailsBottom data={data} />
      <Episodesection data={data} id={id} />
      {data?.recommendations?.nodes?.length > 0 && (
        <div className="recommendationglobal">
          <Animecards data={data.recommendations.nodes} cardid={"Recommendations"} />
        </div>
      )}
    </div>
  )
}

export default AnimeDetails