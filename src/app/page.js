import Animecard from '@/components/Animecard'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/Navbar'
import { TrendingAnilist, RecentEpisodes } from '@/lib/Anilistfunctions'
import React from 'react'
import { MotionDiv } from '@/utils/MotionDiv'


async function Home() {
  const herodata = await TrendingAnilist();
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
     </div>
    </div>
  )
}

export default Home
