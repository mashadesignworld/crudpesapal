import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  // ===================== GET =====================
  if (req.method === "GET") {
    try {
      const aspirants = await prisma.aspirant.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(aspirants);
    } catch (error) {
      console.error("Error fetching aspirants:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ===================== POST =====================
  if (req.method === "POST") {
    try {
      const {
        name,
        nationalId,
        mobile,
        email,
        county,
        constituency,
        ward,
        position,
      } = req.body;

      if (
        !name ||
        !nationalId ||
        !mobile ||
        !email ||
        !position ||
        !county ||
        !constituency ||
        !ward
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Load county data
      const filePath = path.join(process.cwd(), "public", "county.json");
      const countyData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      const selectedCounty = countyData.find(
        (c) => c.county_name === county
      );
      if (!selectedCounty) {
        return res.status(400).json({ error: "Invalid County" });
      }

      const selectedConstituency = selectedCounty.constituencies.find(
        (c) => c.constituency_name === constituency
      );
      if (!selectedConstituency) {
        return res.status(400).json({
          error: "Invalid Constituency for selected County",
        });
      }

      if (!selectedConstituency.wards.includes(ward)) {
        return res.status(400).json({
          error: "Invalid Ward for selected Constituency",
        });
      }

      // Check uniqueness (Prisma)
      const existingAspirant = await prisma.aspirant.findUnique({
        where: { nationalId },
      });

      if (existingAspirant) {
        return res.status(400).json({
          error: "Aspirant with this National ID already exists",
        });
      }

      const newAspirant = await prisma.aspirant.create({
        data: {
          name,
          nationalId,
          mobile,
          email,
          county,
          constituency,
          ward,
          position,
        },
      });

      return res.status(201).json({
        message: "Aspirant registered successfully",
        aspirant: newAspirant,
      });
    } catch (error) {
      console.error("Registration Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ===================== PUT / PATCH =====================
  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const {
        id,
        name,
        nationalId,
        mobile,
        email,
        county,
        constituency,
        ward,
        position,
      } = req.body;

      if (
        !id ||
        !name ||
        !nationalId ||
        !mobile ||
        !email ||
        !position ||
        !county ||
        !constituency ||
        !ward
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const updatedAspirant = await prisma.aspirant.update({
        where: { id },
        data: {
          name,
          nationalId,
          mobile,
          email,
          county,
          constituency,
          ward,
          position,
        },
      });

      return res.status(200).json({
        message: "Aspirant updated successfully",
        aspirant: updatedAspirant,
      });
    } catch (error) {
      console.error("Update Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
