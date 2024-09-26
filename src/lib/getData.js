"use server"
import { redis } from "@/lib/rediscache";

export async function getRecentEpisodes() {
    try {
        const res = await fetch(
            `https://anify.eltik.cc/recent?type=anime&page=1&perPage=20&fields=[id,title,status,format,currentEpisode,coverImage,episodes,totalEpisodes]`
        );
        const data = await res.json();
        const mappedData = data.map((i) => {
            const episodesData = i?.episodes?.data;
            const getEpisodes = episodesData ? episodesData.find((x) => x.providerId === "gogoanime") || episodesData[0] : [];
            const getEpisode = getEpisodes?.episodes?.find(
                (x) => x.number === i.currentEpisode
            );

            return {
                id: i.id,
                latestEpisode: getEpisode?.id ? getEpisode.id.substring(1) : '',
                title: i.title,
                status: i.status,
                format: i.format,
                totalEpisodes: i?.totalEpisodes,
                currentEpisode: i.currentEpisode,
                coverImage: i.coverImage,
            };
        });
        return mappedData;
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
        return JSON.parse(cached);
    }
    else {
        const data = await fetchRecent();
        if (data && data?.length > 0) {
            if (redis) {
                await redis.set(
                    "recent",
                    JSON.stringify(data),
                    "EX",
                    60 * 60
                );
            }
            return data;
        } else {
            return { message: "Recent Episodes not found" };
        }
    }
};