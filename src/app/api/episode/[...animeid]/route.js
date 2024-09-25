async function fetchGogoanime(sub, dub) {
  try {
    async function fetchData(id) {
      const { data } = await axios.get(
        `${process.env.CONSUMET_URI}/anime/gogoanime/info/${id}`
      );
      if (data?.message === "Anime not found" && data?.episodes?.length < 1) {
        return [];
      }
      return data?.episodes;
    }

    const [subData, dubData] = await Promise.all([
      sub !== "" ? fetchData(sub) : Promise.resolve([]),
      dub !== "" ? fetchData(dub) : Promise.resolve([]),
    ]);

    const array = [
      {
        consumet: true,
        providerId: "gogoanime",
        episodes: {
          ...(subData && subData.length > 0 && { sub: subData }),
          ...(dubData && dubData.length > 0 && { dub: dubData }),
        },
      },
    ];

    return array;
  } catch (error) {
    console.error("Error fetching consumet gogoanime:", error.message);
    return [];
  }
}

async function fetchZoro(id) {
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
    console.error("Error fetching zoro:", error.message);
    return [];
  }
}

async function fetchEpisodeMeta(id, available = false) {
  try {
    if (available) {
      return null;
    }
    // const { data } = await axios.get(
    //   `https://api.anify.tv/content-metadata/${id}`
    // );
    // if (!data) return [];

    // const metadata = data?.find((i) => i.providerId === "tvdb") || data[0];
    // return metadata?.data;
    const data = await axios.get(`https://api.ani.zip/mappings?anilist_id=${id}`);
    const episodesArray = Object.values(data?.data?.episodes);

    if(!episodesArray){
      return [];
    }
    return episodesArray

  } catch (error) {
    console.error("Error fetching and processing meta:", error.message);
    return [];
  }
}

const fetchAndCacheData = async (id, meta, redis, cacheTime, refresh) => {
  let malsync;
  if(id){
    malsync = await MalSync(id);
  }
  const promises = [];
  
  if (malsync) {
    console.log(malsync)
    const gogop = malsync.gogoanime;
    const zorop = malsync.zoro
  
    if (gogop) {
      promises.push(fetchGogoanime(gogop.sub, gogop.dub));
    } else {
      promises.push(Promise.resolve([]));
    }
  
    if (zorop) {
      promises.push(fetchZoro(zorop.sub));
    } else {
      promises.push(Promise.resolve([]));
    }
    promises.push(fetchEpisodeMeta(id, !refresh));

  } else {
    promises.push(fetchConsumet(id));
    promises.push(fetchAnify(id));
    promises.push(fetchEpisodeMeta(id, !refresh));
  }
  const [consumet, anify, cover] = await Promise.all(promises);  

  // Check if redis is available
  if (redis) {
    if (consumet.length > 0 || anify.length > 0) {
      await redis.setex(`episode:${id}`, cacheTime, JSON.stringify([...consumet, ...anify]));
    }

    const combinedData = [...consumet, ...anify];
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
    return [...consumet, ...anify];
  }
};

export const GET = async (req, { params }) => {
  const url = new URL(req.url);
  const id = params.animeid[0];
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
        data = await fetchAndCacheData(id, meta, redis, cacheTime, refresh);
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
    const fetchdata = await fetchAndCacheData(id, meta, redis, cacheTime, !refresh);
    return NextResponse.json(fetchdata);
  }
};