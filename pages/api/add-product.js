import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { productId, name, productionDate, expiryDate, medicalInfo } = req.body;

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("products").insertOne({
        productId,
        name,
        productionDate,
        expiryDate,
        medicalInfo,
        addedAt: new Date(),
      });

      return res.status(200).json({ success: true, message: "Product added successfully!" });
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ success: false, message: "Error adding product" });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
