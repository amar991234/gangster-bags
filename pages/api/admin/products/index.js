import { connectToDatabase } from "../../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Authentication check
  const adminLoggedIn = req.headers["x-admin-session"] || "false";
  if (adminLoggedIn !== "true") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { db } = await connectToDatabase();
    const products = await db.collection("products").find({}).toArray();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}