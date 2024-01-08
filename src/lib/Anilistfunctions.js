import { trending,animeinfo } from "./anilistqueries";


export const RecentEpisodes = async () => {
    try {
      const res = await fetch(`https://consumet-anime-api.vercel.app/meta/anilist/recent-episodes`,{ next: { revalidate: 0 }});
      return res.json();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

export const TrendingAnilist=async()=>{
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: trending,
                variables: {
                    page: 1,
                    perPage: 15,
                },
            }),
        },{ next: { revalidate: 0 }});

        const data = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const AnimeInfoAnilist=async(animeid)=>{
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: animeinfo,
                variables: {
                    id: animeid,
                },
            }),
        },{ next: { revalidate: 0 }});

        const data = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}