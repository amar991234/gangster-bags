export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    try {
      res.setHeader(
        "Set-Cookie",
        `authToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`
      );
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }