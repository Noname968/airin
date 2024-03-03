import axios from "axios";
import { redis } from "@/lib/rediscache";
import { NextResponse } from "next/server";

axios.interceptors.request.use(config =>{
    config.timeout = 9000;
    return config;
  })

async function fetchRecent() {
    try {
        const { data } = await axios.get(
            `https://api.anify.tv/recent?type=anime&page=1&perPage=20&fields=[id,slug,title,status,format,currentEpisode,coverImage,episodes,totalEpisodes]`
        );
        return data;
    } catch (error) {
        console.error("Error fetching Recent Episodes:", error);
        return [];
    }
}

export const GET = async (req) => {
    let cached;
    if (redis) {
        console.log('using redis')
        cached = await redis.get('recent');
    }
    if (cached) {
        return NextResponse.json(JSON.parse(cached));
    }
    else {
        const data = await fetchRecent();
        if (data) {
            if (redis) {
                await redis.set(
                    "recent",
                    JSON.stringify(data),
                    "EX",
                    60
                );
            }
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ message: "Recent Episodes not found" });
        }
    }
};