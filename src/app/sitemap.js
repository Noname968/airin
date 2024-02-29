import { TrendingAnilist, Top100Anilist, SeasonalAnilist } from '@/lib/Anilistfunctions';
export default async function sitemap() {
  const data = await TrendingAnilist();
  const data2 = await Top100Anilist();
  const data3 = await SeasonalAnilist();

  const trending = data.map((anime)=>{
    return {
      url: `https://aniplaynow.live/anime/info/${anime.id}`,
      lastModified: new Date(),
    }
  })

  const top100 = data2.map((anime)=>{
    return {
      url: `https://aniplaynow.live/anime/info/${anime.id}`,
      lastModified: new Date(),
    }
  })

  const seasonal = data3.map((anime)=>{
    return {
      url: `https://aniplaynow.live/anime/info/${anime.id}`,
      lastModified: new Date(),
    }
  })

    return [
      {
        url: 'https://aniplaynow.live',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
      },
      ...trending,
      ...top100,
      ...seasonal
    ]
  }