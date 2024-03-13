import { notifications, playeranimeinfo, userlists, userprofile } from "./anilistqueries";
import { toast } from 'sonner';

const GraphQlClient = async (token, query, variables) => {
    try {
        const response = await fetch("https://graphql.anilist.co/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json',
                ...(token && { Authorization: "Bearer " + token }),
            },
            body: JSON.stringify({ query, variables }),
        });
        return response.json();
    } catch (error) {
        console.log("An error occurred, please try again later")
    }
};


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
        },);
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
                ...(token && { Authorization: "Bearer " + token }),
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

export const getUserLists = async (token, id) => {
    const res = await GraphQlClient(token, userlists, { id });
    return res?.data?.Media?.mediaListEntry;
};

export const saveProgress = async (token, id, progress) => {
    const updatelistprogress = `
    mutation($mediaId: Int, $progress: Int, $progressVolumes: Int) {
      SaveMediaListEntry(mediaId: $mediaId, progress: $progress, progressVolumes: $progressVolumes) {
        id
        mediaId
        progress
        status
      }
    }
  `;
  const variables = {
    mediaId : id,
    progress: progress,
    progressVolumes: 0
  }
  try {
    const res = await GraphQlClient(token, updatelistprogress, variables);
    toast.success("Progress saved successfully");
  } catch (error) {
    console.log("An error occurred while updating list");
    toast.error("An error occurred while updating list");
  }
}

export const UserProfile = async (token, username) => {
    const res = await GraphQlClient(token, userprofile, { username });
    return res.data.MediaListCollection;
}