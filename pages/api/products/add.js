import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const { db } = await connectToDatabase();

    const existingProduct = await db.collection("products").findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: "A product with this slug already exists" });
    }

    const newProduct = {
      slug,
      name,
      rate: parseFloat(rate),
      description,
      specs: {
        material: material || "Not specified",
        weight: weight || "Not specified",
        dimensions: dimensions || "Not specified",
        capacity: capacity || "Not specified",
      },
      availability: availability === "true",
      images,
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(newProduct);

    if (!result.insertedId) {
      return res.status(500).json({ message: "Failed to add product" });
    }

    return res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}