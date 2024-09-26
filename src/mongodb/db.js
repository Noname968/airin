import { MongoClient } from "mongodb";
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI ?? "";
const options = {};

let client;
let clientPromise;

// Function to connect to MongoDB
const connectToMongo = () => {
  if (!uri) {
    console.warn("Please add your MongoDB URI to .env");
    return null;
  }
  
  try {
    // Create a new MongoClient
    const client = new MongoClient(uri, options);
    // Connect to the client and return the promise
    return client.connect();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    return null;
  }
};

// Initialize MongoDB connections based on the environment
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = connectToMongo();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, do not use a global variable.
  clientPromise = connectToMongo();
}

export const connectMongo = async () => {
  if (!uri) {
    console.warn("MongoDB URI is not configured. Database functions will be unavailable.");
    return;
  }
  try {
    // Use Mongoose to connect if preferred, this can be a fallback or the main method if using Mongoose.
    await mongoose.connect(uri);
  } catch (err) {
    console.error("Failed to connect with mongoose to MongoDB:", err);
  }
};

export default clientPromise;