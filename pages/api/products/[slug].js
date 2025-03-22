import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  const { slug } = req.query;
  const { method } = req;

  try {
    const { db } = await connectToDatabase();

    switch (method) {
      case "PUT":
        const updatedProduct = req.body;
        // Ensure images and videos are arrays
        updatedProduct.images = Array.isArray(updatedProduct.images)
          ? updatedProduct.images.filter((url) => url.trim() !== "")
          : [];
        updatedProduct.videos = Array.isArray(updatedProduct.videos)
          ? updatedProduct.videos.filter((url) => url.trim() !== "")
          : [];

        const result = await db.collection("products").updateOne(
          { slug },
          { $set: updatedProduct },
          { upsert: false }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product updated successfully" });

      default:
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}