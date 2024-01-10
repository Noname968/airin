import { trending, animeinfo, advancedsearch } from "./anilistqueries";


export const RecentEpisodes = async () => {
    try {
        const res = await fetch(`https://consumet-anime-api.vercel.app/meta/anilist/recent-episodes`, { next: { revalidate: 0 } });
        return res.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const TrendingAnilist = async () => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: trending,
                variables: {
                    page: 1,
                    perPage: 15,
                },
            }),
        }, { next: { revalidate: 0 } });

        const data = await response.json();
        return data.data.Page.media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const AnimeInfoAnilist = async (animeid) => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: animeinfo,
                variables: {
                    id: animeid,
                },
            }),
        }, { next: { revalidate: 0 } });

        const data = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}

export const AdvancedSearch = async (searchvalue, selectedYear, seasonvalue, formatvalue, genrevalue, sortbyvalue, currentPage) => {
    const types = {};

    for (const item of genrevalue) {
        const { type, value } = item;

        if (types[type]) {
            types[type].push(value);
        } else {
            types[type] = [value];
        }
    }

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                query: advancedsearch,
                variables: {
                    ...(searchvalue && {
                        search: searchvalue,
                        ...(!sortbyvalue && { sort: "SEARCH_MATCH" }),
                    }),
                    type: "ANIME",
                    ...(selectedYear && { seasonYear: selectedYear }),
                    ...(seasonvalue && { season: seasonvalue }),
                    ...(formatvalue && { format: formatvalue }),
                    ...(sortbyvalue && { sort: sortbyvalue }),
                    ...(types && { ...types }),
                    // ...(airingvalue && { status: airingvalue }),
                    ...(currentPage && { page: currentPage }),
                },
            }),
        });

        const data = await response.json();
        return data.data.Page;
    } catch (error) {
        console.error('Error fetching search data from AniList:', error);
    }
};
