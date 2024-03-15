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
        const img = episodeImages[episodeNum].img || episodeImages[episodeNum].image;
        const title = episodeImages[episodeNum]?.title?.en || episodeImages[episodeNum].title;
        const description = episodeImages[episodeNum].description || episodeImages[episodeNum].overview || episodeImages[episodeNum].summary;
        Object.assign(episode, { img, title, description });
      }
    }
  }

  return episodeData;
}

export function ProvidersMap(episodeData, defaultProvider = null, setDefaultProvider = () => {}) {
  let dProvider = episodeData.filter((i) => i?.consumet === true);
  let suboptions = [];
  let dubLength = 0;

  if (dProvider?.length > 0) {
    const episodes = dProvider[0].episodes;
    if (episodes) {
      suboptions = Object.keys(episodes);
      dubLength = Math.floor(Math.max(...Object.values(episodes?.dub || []).map(e => e.number)));
    }
  }

  if (!defaultProvider) {
    setDefaultProvider(dProvider[0]?.providerId || episodeData[0]?.providerId);
  }
  if (suboptions.length === 0 || (suboptions.length === 1 && suboptions[0] === 'dub')) {
    suboptions = ['sub'];
  }  
  return { suboptions, dubLength };
}