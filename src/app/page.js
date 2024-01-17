import Animecard from '@/components/Animecard'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/Navbar'
import { TrendingAnilist, RecentEpisodes, Top100Anilist, SeasonalAnilist } from '@/lib/Anilistfunctions'
import React from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import VerticalList from '@/components/home/VerticalList'


async function Home() {
  const herodata = await TrendingAnilist();
  const top100data = await Top100Anilist();
  const seasonaldata = await SeasonalAnilist();
  // const recentdata = await RecentEpisodes();

  return (
    <div>
      <Navbarcomponent home={true}/>
      <Herosection data={herodata} />
     <div className='sm:max-w-[97%] md:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto'>
     {/* <MotionDiv
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Animecard data={recentdata.results} cardid="Recent Episodes" />
      </MotionDiv> */}
      <MotionDiv
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Animecard data={herodata} cardid="Trending Now" />
      </MotionDiv>
      <MotionDiv
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className='lg:flex lg:flex-row justify-between lg:gap-20'>
          <VerticalList data={top100data} id="Top 100 Anime"/>
          <VerticalList data={seasonaldata} id="Seasonal Anime"/>
        </div>
      </MotionDiv>
     </div>
    </div>
  )
}

export default Home
