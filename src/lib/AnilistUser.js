import { notifications } from "./anilistqueries";

export const Usernotifications = async (token, currentPage=1) => {
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
        }, { next: { revalidate: 0 } });

        const data = await response.json();
        return data.data.Page;
    } catch (error) {
        console.error('Error fetching notifications from AniList:', error);
    }
}