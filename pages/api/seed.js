import { connectToDatabase } from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await db.collection("users").insertOne({
      username: "admin",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error("Error seeding user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}