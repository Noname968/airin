// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb"
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
const options = {}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  console.log("Please add your MongoDB URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}


export const connectMongo = async () => mongoose.connect(uri);

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client 
export default clientPromise