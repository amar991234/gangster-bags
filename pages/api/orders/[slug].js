import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { slug } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const order = await db.collection("orders").findOne({ productSlug: slug });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}