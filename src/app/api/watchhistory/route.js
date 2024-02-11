import { NextResponse } from "next/server";
import { getAuthSession } from "../auth/[...nextauth]/route";
import { connectMongo } from "@/mongodb/db";
import Watch from "@/mongodb/models/watch";

export const GET = async (req) => {
  const url = new URL(req.url);
  const epId = url.searchParams.get('epId');
    try {
        await connectMongo();
        const session = await getAuthSession();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if(epId){
          const episode = await Watch.find({ 
            userName: session.user.name,
            epId: epId
          })
          if (episode && episode.length > 0) {
            return NextResponse.json(episode);
        }
        
        }
        const history = await Watch.find({ userName: session.user.name });
        if (!history) {
            return NextResponse.json([]);
        }

        return NextResponse.json(history);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
};


export const POST = async (request) => {
    const data = await request.json();
  
    try {
      await connectMongo();
      const session = await getAuthSession();
  
      if (!session) {
        return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
      }
  
      // Check if a record with the same name and epId already exists
      const existingWatch = await Watch.findOne({
        userName: data.name,
        epId: data.epId
      });
  
      if (existingWatch) {
        return NextResponse.json(
          { message: "Episode already exists" },
          { status: 409 } // Conflict status code
        );
      }
  
      // If no existing record found, create a new one
      const newwatch = await Watch.create({
        userName: data.name,
        epId: data.epId
      });
  
      await newwatch.save();
      return NextResponse.json(
        { message: "Episode Saved Successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
  
  
  export const PUT = async (request) => {
    const data = await request.json();
  
    try {
      await connectMongo();
      const session = await getAuthSession();
  
      if (!session) {
        return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
      }
  
      const updatedWatch = await Watch.findOneAndUpdate(
        { 
            userName: data.userName,
            epId: data.epId
        },
        {
          $set: {
            aniId: data.aniId || null,
            aniTitle: data.aniTitle || null,
            epTitle: data.epTitle || null,
            image: data.image || null,
            epId: data.epId || null,
            epNum: data.epNum || null,
            timeWatched: data.timeWatched || null,
            duration: data.duration || null,
            provider: data.provider || null,
            nextepId: data.nextepId || null,
            nextepNum: data.nextepNum || null,
            subtype: data.subtype || "sub",
          },
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedWatch) {
        return NextResponse.json({ message: "Episode not found" }, { status: 404 });
      }
  
      return NextResponse.json(
        { message: "Episode Updated Successfully", updatedWatch },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
  

  export const DELETE = async (request) => {
    const data = await request.json();
  
    try {
      await connectMongo();
      const session = await getAuthSession();
  
      if (!session) {
        return NextResponse.json({ message: "UnAuthorized" }, { status: 404 });
      }
  
      if (data.watchId) {
        // Delete a specific document based on watchId
        const deletedWatch = await Watch.findOneAndDelete({
          userName: data.name,
          epId: data.epId
        });
  
        if (!deletedWatch) {
          return NextResponse.json({ message: "Episode data not found" }, { status: 404 });
        }
  
        return NextResponse.json(
          { message: "Episode Deleted Successfully", deletedWatch },
          { status: 200 }
        );
      } else if (data.aniId) {
        // Delete all documents with a specific aniId
        const deletedWatches = await Watch.deleteMany({
          userName: data.name,
          aniId: data.aniId,
        });
  
        if (deletedWatches.deletedCount === 0) {
          return NextResponse.json({ message: "No Episodes found" }, { status: 404 });
        }
  
        return NextResponse.json(
          { message: "Episode Deleted Successfully", deletedCount: deletedWatches.deletedCount },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Invalid request, provide watchId or aniId" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  };
  