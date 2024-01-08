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

export function ProvidersMap(episodeData,setConsumetProvider,defaultProvider,setdefaultProvider,subtype){
  const getConsumet = episodeData?.find((i) => i?.consumet === true);
  let allProvider = episodeData;

  if (getConsumet) {
    allProvider = episodeData?.filter((i) => {
      if (i?.providerId === "gogoanime" && i?.consumet !== true) {
        return null;
      }
      return i;
    });
    // console.log(getConsumet?.episodes[subtype])
    setConsumetProvider(getConsumet?.episodes[subtype]);
  }

  if (subtype === "dub") {
    allProvider = allProvider?.filter((i) => Array.isArray(i?.episodes) && i?.episodes?.some((epi) => epi?.hasDub === true) || i.consumet===true);
  }

  if (allProvider?.length > 0) {
    const dprovider = allProvider?.find(
      (x) => x.providerId === "gogoanime" || x.providerId === "zoro"
    );
    if(!defaultProvider){
      setdefaultProvider(dprovider?.providerId || allProvider[0].providerId);
    }
  }

  return allProvider;
}
