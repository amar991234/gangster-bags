import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { redirect } = req.query;
  if (!redirect) {
    return res.status(400).json({ message: "Redirect URL is required" });
  }

  try {
    const {
      productSlug,
      productName,
      productRate,
      status,
      createdAt,
      customerName,
      customerPhone,
      customerEmail,
      payment,
    } = req.body;

    if (!productSlug || !productName || !productRate || !customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { db } = await connectToDatabase();

    const orderData = {
      productSlug,
      productName,
      productRate: parseFloat(productRate), // Parse to number
      status: status || "Pending",
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      },
      paymentMethod: payment || "cod",
    };

    console.log("Saving order:", orderData);

    const result = await db.collection("orders").insertOne(orderData);

    console.log("Order save result:", result);

    if (!result.insertedId) {
      return res.status(500).json({ message: "Failed to save order" });
    }

    res.redirect(302, `${redirect}?orderId=${result.insertedId}`);
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ message: "Error saving order", error: error.message });
  }
}