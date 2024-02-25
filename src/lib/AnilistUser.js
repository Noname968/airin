import { notifications, playeranimeinfo } from "./anilistqueries";

export const Usernotifications = async (token, currentPage) => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                query: notifications,
                variables: {
                    page: currentPage,
                    perPage: 15,
                },
            }),
        }, );
        const data = await response.json();
        // console.log(data)
        return data.data.Page;
    } catch (error) {
        console.error('Error fetching notifications from AniList:', error);
    }
}


export const WatchPageInfo = async (token, animeid) => {
    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token && {Authorization: "Bearer " + token}),
            },
            body: JSON.stringify({
                query: playeranimeinfo,
                variables: {
                    id: animeid,
                },
            }),
        }, { next: { revalidate: 3600 } });

        const data = await response.json();
        return data.data.Media;
    } catch (error) {
        console.error('Error fetching data from AniList:', error);
    }
}