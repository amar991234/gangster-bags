import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    return res.status(200).json({ message: "Database connection successful", collections });
  } catch (error) {
    console.error("Error connecting to database:", error);
    return res.status(500).json({ message: "Error connecting to database", error: error.message });
  }
}