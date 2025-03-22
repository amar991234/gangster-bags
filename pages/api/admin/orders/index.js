import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "GET") {
    const orders = await db.collection("orders").find({}).toArray();
    res.status(200).json(orders);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}