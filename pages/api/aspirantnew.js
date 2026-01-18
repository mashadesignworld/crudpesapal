import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  // Helper to send JSON error responses consistently
  const sendError = (status, message) => {
    return res.status(status).json({ error: message });
  };

  try {
    switch (method) {
      // ────────────────────────────────────────────────
      // GET - List all aspirants
      // ────────────────────────────────────────────────
      case "GET": {
        const aspirants = await prisma.aspirant.findMany({
          orderBy: { createdAt: "desc" },
        });

        // Disable caching so UI always gets fresh data after mutations
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        return res.status(200).json(aspirants);
      }

      // ────────────────────────────────────────────────
      // POST - Create new aspirant
      // ────────────────────────────────────────────────
      case "POST": {
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

        // Basic validation
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
          return sendError(400, "All fields are required");
        }

        // Load and validate location data
        const filePath = path.join(process.cwd(), "public", "county.json");

        let countyData;
        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          countyData = JSON.parse(fileContent);
        } catch (fsError) {
          console.error("Failed to read county.json:", fsError);
          return sendError(500, "Server error: Unable to load county data");
        }

        const selectedCounty = countyData.find((c) => c.county_name === county);
        if (!selectedCounty) {
          return sendError(400, "Invalid County");
        }

        const selectedConstituency = selectedCounty.constituencies.find(
          (c) => c.constituency_name === constituency
        );
        if (!selectedConstituency) {
          return sendError(400, "Invalid Constituency for selected County");
        }

        if (!selectedConstituency.wards.includes(ward)) {
          return sendError(400, "Invalid Ward for selected Constituency");
        }

        // Check for duplicate national ID
        const existing = await prisma.aspirant.findUnique({
          where: { nationalId },
        });
        if (existing) {
          return sendError(400, "Aspirant with this National ID already exists");
        }

        // Create
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
      }

      // ────────────────────────────────────────────────
      // PUT / PATCH - Update aspirant
      // ────────────────────────────────────────────────
      case "PUT":
      case "PATCH": {
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
          return sendError(400, "All fields including id are required");
        }

        const updated = await prisma.aspirant.update({
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
          aspirant: updated,
        });
      }

      // ────────────────────────────────────────────────
      // DELETE - Remove aspirant
      // ────────────────────────────────────────────────
      case "DELETE": {
        const { id } = req.query;

        if (!id) {
          return sendError(400, "Missing id parameter");
        }

        await prisma.aspirant.delete({
          where: { id },
        });

        return res.status(200).json({ message: "Aspirant deleted successfully" });
      }

      // ────────────────────────────────────────────────
      // Unsupported method
      // ────────────────────────────────────────────────
      default:
        return sendError(405, "Method Not Allowed");
    }
  } catch (error) {
    console.error(`API Error [${method}]:`, error);

    // Prisma known errors can be more specific if needed
    if (error.code === "P2025") {
      // Record not found
      return sendError(404, "Aspirant not found");
    }

    return sendError(500, "Internal Server Error");
  }
}