import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  const { slug } = req.query;

  // Basic authentication check (you should enhance this based on your auth mechanism)
  const adminLoggedIn = req.headers["x-admin-session"] || "false"; // Example: Check a header
  if (adminLoggedIn !== "true") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "PUT") {
    try {
      const { name, rate, description, material, weight, dimensions, capacity, availability, images } = req.body;

      if (!name || !rate || !description || !availability || !images || !Array.isArray(images) || images.length === 0) {
        return res.status(400).json({ message: "Missing required fields or invalid images array" });
      }

      const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
      const invalidUrls = images.filter((url) => !urlPattern.test(url));
      if (invalidUrls.length > 0) {
        return res.status(400).json({ message: "Invalid image URLs: " + invalidUrls.join(", ") });
      }

      const newSlug = name.toLowerCase().replace(/\s+/g, "-");

      const { db } = await connectToDatabase();

      if (newSlug !== slug) {
        const existingProduct = await db.collection("products").findOne({ slug: newSlug });
        if (existingProduct) {
          return res.status(400).json({ message: "A product with this slug already exists" });
        }
      }

      const updatedProduct = {
        slug: newSlug,
        name,
        rate: parseFloat(rate), // Parse to number
        description,
        specs: {
          material: material || "Not specified",
          weight: weight || "Not specified",
          dimensions: dimensions || "Not specified",
          capacity: capacity || "Not specified",
        },
        availability: availability === "true",
        images,
        updatedAt: new Date(),
      };

      const result = await db.collection("products").updateOne(
        { slug },
        { $set: updatedProduct }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("products").deleteOne({ slug });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}