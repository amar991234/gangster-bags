import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Your MongoDB connection string
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db("gangsterbags"); // Your database name
  return { db, client };
}