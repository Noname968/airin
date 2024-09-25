import { ANIME } from "@consumet/extensions";

const gogo = new ANIME.Gogoanime();

export async function getGogoSources(id) {
  try {
    const data = await gogo.fetchEpisodeSources(id);

    if (!data) return null;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getZoroSources(id) {
  try {
    const data = await fetch(`${process.env.ZORO_API}/`);

    if (!data) return null;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAnimeSources(id, provider, epid, epnum, subdub) {
  try {
    if (provider === "gogoanime") {
      const data = await getGogoSources(epid);
      return data;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
