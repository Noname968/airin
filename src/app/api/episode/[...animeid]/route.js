import axios from 'axios';
import { redis } from '@/lib/rediscache';
import { NextResponse } from "next/server"
import { CombineEpisodeMeta } from '@/utils/EpisodeFunctions';

axios.interceptors.request.use(config => {
  config.timeout = 9000;
  return config;
})

async function MalSync(idMal) {
  try {
    const response = await fetch(`https://api.malsync.moe/mal/anime/${idMal}`);

    const data = await response.json();
    const sites = Object.keys(data.Sites).map(providerId => ({ providerId: providerId.toLowerCase(), data: Object.values(data.Sites[providerId]) }));
    const newdata = sites.filter(site => site.providerId === 'gogoanime' || site.providerId === 'zoro');
    const finaldata = [];
    newdata.forEach(item => {
      const { providerId, data } = item;
      if (providerId === 'gogoanime') {
        const dub = data.find(item => item.title.toLowerCase().endsWith(" (dub)"))?.identifier;
        const sub = data.find(item => item.title.toLowerCase().includes(" (uncensored)"))?.identifier ?? data.find(item => !item.title.toLowerCase().includes(")"))?.identifier;
        finaldata.push({ providerId, sub: sub || "", dub: dub || "" });
      } else {
        const remove = 'https://hianime.to/';
        const sub = data[0].url.replace(remove, '')
        finaldata.push({ providerId, sub: sub || '' });
      }
    });
    console.log(newdata)
    return finaldata;
  } catch (error) {
    console.error('Error fetching data from Malsync:', error);
  }
}


async function fetchConsumetEpisodes(sub, dub) {
  try {
    async function fetchData(id) {
      const { data } = await axios.get(
        `${process.env.CONSUMET_URI}/anime/gogoanime/info/${id}`
      );
      if (data?.message === "Anime not found" && data?.episodes?.length < 1) {
        return [];
      }
      return data.episodes;
    }

    const [subData, dubData] = await Promise.all([
      sub !== "" ? fetchData(sub) : Promise.resolve([]),
      dub !== "" ? fetchData(fetchData(dub)) : Promise.resolve([]),
    ]);

    const array = [
      {
        consumet: true,
        providerId: "gogoanime",
        episodes: {
          sub: subData,
          dub: dubData,
        },
      },
    ];

    return array;
  } catch (error) {
    console.error("Error fetching consumet gogoanime:", error.message);
    return [];
  }
}

async function fetchZoroEpisodes(id) {
  try {
    const { data } = await axios.get(`${process.env.ZORO_URI}/anime/episodes/${id}`);
    if (!data?.episodes) return [];

    const array = [
      {
        providerId: "zoro",
        episodes: data?.episodes,
      },
    ];

    return array;
    } catch (error) {
    console.error("Error fetching and processing zoro:", error.message);
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

    if (!data) return [];

    const metadata = data?.find((i) => i.providerId === "tvdb") || data[0];
    return metadata?.data;
    // const data = await axios.get(`https://api.ani.zip/mappings?anilist_id=${id}`);
    // const episodesArray = Object.values(data.data.episodes);

    // if(!episodesArray){
    //   return [];
    // }
    // return episodesArray

  } catch (error) {
    console.error("Error fetching and processing meta:", error.message);
    return [];
  }
}

const fetchAndCacheData = async (id, idMal, meta, redis, cacheTime, refresh) => {
  const malsync = await MalSync(idMal);
  console.log(malsync)
  const promises = [];

  malsync.forEach(obj => {
    if (obj.providerId === 'gogoanime') {
      promises.push(fetchConsumetEpisodes(obj.sub, obj.dub));
    } else if (obj.providerId === 'zoro') {
      promises.push(fetchZoroEpisodes(obj.sub));
    }
  });
  promises.push(fetchEpisodeImages(id, !refresh));

  const [consumet, zoro, cover] = await Promise.all(promises);
  // const [consumet, anify, cover] = await Promise.all([
  //   fetchConsumetEpisodes(id),
  //   fetchAnifyEpisodes(id),
  //   fetchEpisodeImages(id, !refresh)
  // ]);

  // Check if redis is available
  if (redis) {
    if (consumet.length > 0 || zoro.length > 0) {
      await redis.setex(`episode:${id}`, cacheTime, JSON.stringify([...consumet, ...zoro]));
    }

    const combinedData = [...consumet, ...zoro];
    let data = combinedData;
    if (refresh) {
      if (cover && cover?.length > 0) {
        try {
          await redis.setex(`meta:${id}`, cacheTime, JSON.stringify(cover));
          data = await CombineEpisodeMeta(combinedData, cover);
        } catch (error) {
          console.error("Error serializing cover:", error.message);
        }
      }
      else if (meta) {
        data = await CombineEpisodeMeta(combinedData, JSON.parse(meta));
      }
    } else if (meta) {
      data = await CombineEpisodeMeta(combinedData, JSON.parse(meta));
    }

    return data;
  } else {
    console.error("Redis URL not provided. Caching not possible.");
    return [...consumet, ...zoro];
  }
};

export const GET = async (req, { params }) => {
  const url = new URL(req.url);
  const id = params.animeid[0];
  const idMal = url.searchParams.get('idMal');
  const releasing = url.searchParams.get('releasing') || false;
  const refresh = url.searchParams.get('refresh') === 'true' || false;

  let cacheTime = null;
  if (releasing === "true") {
    cacheTime = 60 * 60 * 3;
  } else if (releasing === "false") {
    cacheTime = 60 * 60 * 24 * 45;
  }

  let meta = null;
  let cached;

  if (redis) {
    try {
      // // Find keys matching the pattern "meta:*"
      // const keys = await redis.keys("meta:*");

      // // Delete keys matching the pattern "meta:*"
      // if (keys.length > 0) {
      //   await redis.del(keys);
      //   console.log(`Deleted ${keys.length} keys matching the pattern "meta:*"`);
      // }
      meta = await redis.get(`meta:${id}`);
      if (JSON.parse(meta)?.length === 0) {
        await redis.del(`meta:${id}`);
        console.log("deleted meta cache");
        meta = null;
      }
      cached = await redis.get(`episode:${id}`);
      if (JSON.parse(cached)?.length === 0) {
        await redis.del(`episode:${id}`);
        cached = null;
      }
      let data;
      if (refresh) {
        data = await fetchAndCacheData(id, idMal, meta, redis, cacheTime, refresh);
      }
      if (data?.length > 0) {
        console.log("deleted cache");
        return NextResponse.json(data);
      }

      console.log("using redis");
    } catch (error) {
      console.error("Error checking Redis cache:", error.message);
    }
  }

  if (cached) {
    try {
      let cachedData = JSON.parse(cached);
      if (meta) {
        cachedData = await CombineEpisodeMeta(cachedData, JSON.parse(meta));
      }
      return NextResponse.json(cachedData);
    } catch (error) {
      console.error("Error parsing cached data:", error.message);
    }
  } else {
    const fetchdata = await fetchAndCacheData(id, idMal, meta, redis, cacheTime, !refresh);
    return NextResponse.json(fetchdata);
  }
};