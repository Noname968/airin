"use server"
import Animecard from '@/components/CardComponent/Animecards'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/navbar/Navbar'
import { TrendingAnilist, Top100Anilist, SeasonalAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import VerticalList from '@/components/home/VerticalList'
import ContinueWatching from '@/components/home/ContinueWatching'
import RecentEpisodes from '@/components/home/RecentEpisodes'
import { getAuthSession } from './api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
// import { getWatchHistory } from '@/lib/EpHistoryfunctions'

async function getHomePage() {
  try {
    let cachedData;
    if (redis) {
      cachedData = await redis.get(`homepage`);
      if (!JSON.parse(cachedData)) {
        await redis.del(`homepage`);
        cachedData = null;
      }
    }
    if (cachedData) {
      const { herodata, top100data, seasonaldata } = JSON.parse(cachedData);
      return { herodata, top100data, seasonaldata };
    } else {
      const [herodata, top100data, seasonaldata] = await Promise.all([
        TrendingAnilist(),
        Top100Anilist(),
        SeasonalAnilist()
      ]);
      const cacheTime = 60 * 60 * 2;
      if (redis) {
        await redis.set(`homepage`, JSON.stringify({ herodata, top100data, seasonaldata }), "EX", cacheTime);
      }
      return { herodata, top100data, seasonaldata };
    }
  } catch (error) {
    console.error("Error fetching homepage from anilist: ", error);
    return null;
  }
}

async function Home() {
  const session = await getAuthSession();
  const { herodata = [], top100data = [], seasonaldata = [] } = await getHomePage();
  // const history = await getWatchHistory();
  // console.log(history)

  return (
    <div>
      <Navbarcomponent home={true} />
      <Herosection data={herodata} />
      <div className='sm:max-w-[97%] md:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto flex flex-col md:gap-11 sm:gap-7 gap-5 mt-8'>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Animecard data={herodata} cardid="Trending Now" />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <RecentEpisodes cardid="Recent Episodes" />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <ContinueWatching session={session} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className='lg:flex lg:flex-row justify-between lg:gap-20'>
            <VerticalList data={top100data} mobiledata={seasonaldata} id="Top 100 Anime" />
            <VerticalList data={seasonaldata} id="Seasonal Anime" />
          </div>
        </MotionDiv>
      </div>
    </div>
  )
}

export default Home
