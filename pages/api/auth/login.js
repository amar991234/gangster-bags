import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_HASHED_PASSWORD = "$2b$10$8P28fpYKMXEiZpsD3ZpN1.a8FxRUx.VnTc3/oyj1b.PoolZyyw3Va"; // Hashed password for "admin123"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Verify username
    if (username !== ADMIN_USERNAME) {
      console.log(`Invalid username: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, ADMIN_HASHED_PASSWORD);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: ADMIN_USERNAME, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in a cookie
    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; Path=/; HttpOnly; Max-Age=3600; SameSite=Lax`
    );
    console.log("Login successful, token set:", token);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
