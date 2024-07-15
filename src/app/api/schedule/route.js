import axios from "axios";
import { redis } from "@/lib/rediscache";
import { NextResponse } from "next/server";

async function fetchSchedule() {
    try {
        const { data } = await axios.get(
            `https://anify.eltik.cc/schedule?fields=[id,title,coverImage]`
        );
        return data;
    } catch (error) {
        console.error("Error fetching schedule:", error);
        return null;
    }
}

async function refreshCache() {
    const today = new Date().getDay();
    if (today === 1) {
        const newData = await fetchSchedule();
        if (newData) {
            if (redis) {
                await redis.set(
                    "schedule",
                    JSON.stringify(newData),
                    "EX",
                    60 * 60 * 24 * 7
                );
            }
            console.log("Cache refreshed successfully.");
        }
    }
}

const refreshInterval = 24 * 60 * 60 * 1000; 
const cacheRefreshInterval = setInterval(refreshCache, refreshInterval);

export const GET = async (req) => {
    let cached;
    if (redis) {
        cached = await redis.get("schedule");
    }
    if (cached) {
        return NextResponse.json(JSON.parse(cached));
    } else {
        const data = await fetchSchedule();
        if (data) {
            if (redis) {
                await redis.set(
                    "schedule",
                    JSON.stringify(data),
                    "EX",
                    60 * 60 * 24 * 7
                );
            }
            return NextResponse.json(data);
        } else {
            return NextResponse.json({ message: "Schedule not found" });
        }
    }
};
