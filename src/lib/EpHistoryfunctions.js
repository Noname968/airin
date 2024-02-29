'use server'
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { connectMongo } from "@/mongodb/db";
import Watch from "@/mongodb/models/watch";
import { revalidatePath } from "next/cache";


export const getWatchHistory = async () => {
  try {
    await connectMongo();
    const session = await getAuthSession();
    if (!session) {
      return;
    }
    const history = await Watch.find({ userName: session.user.name });

    if (!history) {
      return [];
    }
    return JSON.parse(JSON.stringify(history));
  } catch (error) {
    console.error("Error fetching watch history", error);
  }
  revalidatePath("/");
};

export const createWatchEp = async (aniId, epNum) => {
  try {
    await connectMongo();
    const session = await getAuthSession();

    if (!session) {
      return;
    }

    // Check if a record with the same name and epId already exists
    const existingWatch = await Watch.findOne({
      userName: session?.user.name,
      aniId: aniId,
      epNum: epNum,
    });

    if (existingWatch) {
      return null;
    }

    // If no existing record found, create a new one
    const newwatch = await Watch.create({
      userName: session?.user.name,
      aniId: aniId,
      epNum: epNum,
    });

  } catch (error) {
    console.error("Oops! Something went wrong while creating the episode tracking:", error);
    return;
  }
};


export const getEpisode = async (aniId, epNum) => {
  try {
    await connectMongo();
    const session = await getAuthSession();
    if (!session) {
      return;
    }

    if (aniId && epNum) {
      const episode = await Watch.find({
        userName: session.user.name,
        aniId: aniId,
        epNum: epNum,
      });
      if (episode && episode.length > 0) {
        return JSON.parse(JSON.stringify(episode));
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return;
  }
};

export const updateEp = async ({aniId, aniTitle, epTitle, image, epId, epNum, timeWatched, duration, provider, nextepId, nextepNum, subtype}) => {
  try {
    await connectMongo();
    const session = await getAuthSession();

    if (!session) {
      return;
    }

    const updatedWatch = await Watch.findOneAndUpdate(
      {
        userName: session?.user.name,
        aniId: aniId,
        epNum: epNum,
      },
      {
        $set: {
          aniId: aniId || null,
          aniTitle: aniTitle || null,
          epTitle: epTitle || null,
          image: image || null,
          epId: epId || null,
          epNum: epNum || null,
          timeWatched: timeWatched || null,
          duration: duration || null,
          provider: provider || null,
          nextepId: nextepId || null,
          nextepNum: nextepNum || null,
          subtype: subtype || "sub",
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedWatch) {
      return;
    }

    return;
  } catch (error) {
    console.log('Error updating episode:', error);
    return;
  }
}

export const deleteEpisodes = async (data) => {
  try {
    await connectMongo();
    const session = await getAuthSession();

    if (!session) {
      return;
    }

    let deletedData;

    if (data.epId) {
      // Delete a specific document based on watchId
      deletedData = await Watch.findOneAndDelete({
        userName: session?.user.name,
        epId: data.epId
      });
    } else if (data.aniId) {
      // Delete all documents with a specific aniId
      deletedData = await Watch.deleteMany({
        userName: session?.user.name,
        aniId: data.aniId,
      });
    } else {
      return { message: "Invalid request, provide watchId or aniId" };
    }

    if (!deletedData) {
      return { message: "Data not found for deletion" };
    }

    // Fetch remaining data after deletion
    // const data = await Watch.find({ userName: session?.user.name });
    const remainingData = JSON.parse(JSON.stringify(await Watch.find({ userName: session?.user.name })))

    return { message: `Removed anime from history`, remainingData, deletedData }
  } catch (error) {
    console.log(error);
    return;
  }
}