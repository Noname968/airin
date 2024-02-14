import { checkEnvironment } from "./checkEnvironment";
import { headers } from "next/headers"

export const getWatchHistory = async () => {
    try {
      const response = await fetch(
        `${checkEnvironment()}/api/watchhistory`, {
          method: "GET",
          headers: new headers()
        }, 
        { cache: "no-store" }
        );        
        if (!response.ok) {
          throw new Error('Failed to fetch recent history')
        }
        const data = await response.json();
        return data;
    } catch (error) {
      console.error("Error fetching watch history", error);
    }
  }

export const createWatchEp = async (name, epId) =>{
    try {
        const response = await fetch(
            `${checkEnvironment()}/api/watchhistory`, {
              method: "POST",
              body: JSON.stringify({
                name,
                epId
              }),
              headers: new headers()
            }
          );
          if (!response.ok) {
            throw new Error('Failed to create episode history')
          }
    }
    catch (error) {
        console.error("Error creating episode tracking", error);
      }
}

export const getEpisode = async(epId)=>{
  try {
    const response = await fetch(
      `${checkEnvironment()}/api/watchhistory?epId=${epId}`, {
        method: "GET",
        headers: new headers()
      }
    );
    if (!response.ok) {
      throw new Error('Failed to get Episode')
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching episode history by epid", error);
  }
}