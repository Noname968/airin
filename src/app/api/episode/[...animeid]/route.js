import axios from 'axios';
import { redis } from '@/lib/rediscache';
import { NextResponse } from "next/server"
import { CombineEpisodeMeta } from '@/utils/EpisodeFunctions';

axios.interceptors.request.use(config =>{
  // config.timeout = 8000;
  return config;
})

async function fetchConsumetEpisodes(id) {
  try {
    async function fetchData(dub) {
      const { data } = await axios.get(
        `https://consumet-anime-api.vercel.app/meta/anilist/episodes/${id}${dub ? "?dub=true" : ""}`
      );
      if (data?.message === "Anime not found" && data?.length < 1) {
        return [];
      }

      // return data.episodes;
      return data;
    }

    const [subData, dubData] = await Promise.all([
      fetchData(),
      fetchData(true),
    ]);

    const array = [
      {
        consumet:true,
        providerId: "gogoanime",
        episodes: {
          sub: subData,
          dub: dubData,
        },
      },
    ];

    return array;
  } catch (error) {
    console.error("Error fetching and processing consumet:", error.message);
    return [];
  }
}

async function fetchAnifyEpisodes(id) {
  try {
    const { data } = await axios.get(`https://api.anify.tv/info/${id}?fields=[episodes]`);

    const epdata = data.episodes.data
    if (!data) {
      return [];
    }

    const filtereddata = epdata.filter((episodes) => episodes.providerId !== "9anime");
    return filtereddata;
  } catch (error) {
    console.error("Error fetching and processing anify:", error.message);
    return [];
  }
}

async function fetchEpisodeImages(id, available = false) {
  try {
    if (available) {
      return null;
    }
    const { data } = await axios.get(
      `https://api.anify.tv/content-metadata/${id}`
    );

    if (!data) {
      return [];
    }

    const metadata = data?.find((i) => i.providerId === "tvdb") || data[0];
    return metadata?.data;

  } catch (error) {
    console.error("Error fetching and processing meta:", error.message);
    return [];
  }
}

export const GET = async (req, { params }) => {
  const url = new URL(req.url);
  const id = params.animeid[0];
  const releasing = url.searchParams.get('releasing') || false;
  const refresh = url.searchParams.get('refresh') === 'true' || false;

  let cacheTime = null;
  if (releasing === "true") {
    cacheTime = 60 * 60 * 2; 
  } else if (releasing === "false") {
    cacheTime = 60 * 60 * 24 * 30;
  }

  let meta = null;
  let cached;

  if(redis){
    if (refresh) {
      await redis.del(`episode:${id}`);
      // await redis.flushall();
      console.log("deleted cache");
    } else {
      cached = await redis.get(`episode:${id}`);
      console.log("using redis");
    }
    meta = await redis.get(`meta:${id}`);
  }

  if (cached) {
    let cachedData = JSON.parse(cached);
    if (meta) {
      cachedData = await CombineEpisodeMeta(cachedData, JSON.parse(meta));
    }
    return NextResponse.json(cachedData);
  } else {

    const [consumet, anify, cover] = await Promise.all([
      fetchConsumetEpisodes(id),
      fetchAnifyEpisodes(id),
      fetchEpisodeImages(id, meta)
    ]);
      
      await redis.setex(`episode:${id}`, cacheTime, JSON.stringify([...consumet, ...anify]));
      const combinedData = [...consumet, ...anify];
      let data = combinedData;

      if (meta) {
        data = await CombineEpisodeMeta(combinedData, JSON.parse(meta));
      } else if (cover && cover?.length > 0) {
        try {
          if (redis) await redis.set(`meta:${id}`, JSON.stringify(cover));
          data = await CombineEpisodeMeta(combinedData, cover);
        } catch (error) {
          console.error("Error serializing cover:", error.message);
        }
      }
      

    return NextResponse.json(data);
  }
};
