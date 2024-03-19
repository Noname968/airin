import axios from 'axios'
import { redis } from '@/lib/rediscache';
import { NextResponse, NextRequest } from "next/server"

async function consumetEpisode(id) {
    try {
      const { data } = await axios.get(
        `${process.env.CONSUMET_URI}/meta/anilist/watch/${id}`
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

async function zoroEpisode(provider, episodeid, epnum, id, subtype) {
    try {
      const cleanEpisodeId = episodeid.replace("/watch/", "");
      const { data } = await axios.get(`${process.env.ZORO_URI}/anime/episode-srcs?id=${cleanEpisodeId}&server=vidstreaming&category=${subtype}`);
    return data;
    } catch (error) {
      console.error(error);
      return AnifyEpisode(provider, episodeid, epnum, id, subtype);
    }
  }
  
  async function AnifyEpisode(provider, episodeid, epnum, id, subtype) {
    try {
      const { data } = await axios.get(
        `https://api.anify.tv/sources?providerId=${provider}&watchId=${encodeURIComponent(
          episodeid
        )}&episodeNumber=${epnum}&id=${id}&subType=${subtype}`
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

export const POST = async (req,{params}) => {
  const id = params.epsource[0];
  const {source, provider, episodeid, episodenum, subtype} = await req.json();
    // let cacheTime = 25 * 60;
    // let cached = await redis.get(`source:${params.epid[0]}`);

    // if (cached) {
    //     const cachedData = JSON.parse(cached);
    //     return NextResponse.json(cachedData);
    //   } else {
    //     const data = await consumetEpisode(params.epid[0]);
    
    //     await redis.setex(`source:${params.epid[0]}`, cacheTime, JSON.stringify(data));
    
    //     return NextResponse.json(data);
    //   }

    // console.log(provider,episodeid,episodenum,id,subtype)
    if (source === "consumet") {
      const data = await consumetEpisode(episodeid);
      return NextResponse.json(data);
    }

    if (source === "anify" && provider === "zoro") {
      const data = await zoroEpisode(provider, episodeid, episodenum, id, subtype);
      return NextResponse.json(data);
    }

    if(source === "anify"){
      const data = await AnifyEpisode(provider, episodeid, episodenum, id, subtype);
      return NextResponse.json(data);
    }
}