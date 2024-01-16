export async function CombineEpisodeMeta(episodeData, imageData) {
  const episodeImages = {};

  imageData.forEach((image) => {
    episodeImages[image.number || image.episode] = image;
  });

  for (const providerEpisodes of episodeData) {
    const episodesArray = Array.isArray(providerEpisodes.episodes)
      ? providerEpisodes.episodes
      : [...(providerEpisodes.episodes.sub || []), ...(providerEpisodes.episodes.dub || [])];

    for (const episode of episodesArray) {
      const episodeNum = episode.number;

      if (episodeImages[episodeNum]) {
        const { img, title, description } = episodeImages[episodeNum];
        Object.assign(episode, { img, title, description });
      }
    }
  }

  return episodeData;
}

export function ProvidersMap(episodeData, defaultProvider, setdefaultProvider) {
  const getConsumet = episodeData?.find((i) => i?.consumet === true);
  let subProviders = episodeData;

  if (getConsumet) {
    subProviders = episodeData?.filter((i) => {
      if (i?.providerId === "gogoanime" && i?.consumet !== true) {
        return null;
      }
      return i;
    });
  }

  const dubProviders = subProviders?.filter((i) =>
   (Array.isArray(i?.episodes) && i?.episodes?.some((epi) => epi?.hasDub === true) ||
    i.consumet === true && i?.episodes?.dub.length > 0));

  if (subProviders?.length > 0) {
    const dprovider = subProviders?.find(
      (x) => x.providerId === "gogoanime" || x.providerId === "zoro"
    );

    if (!defaultProvider) {
      setdefaultProvider(dprovider?.providerId || subProviders[0].providerId);
    }
  }

  return { subProviders, dubProviders };
}

