import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {

  // ================== GET ==================
  if (req.method === "GET") {
    try {
      const members = await prisma.member.findMany({
        orderBy: { createdAt: "desc" }
      });
      return res.status(200).json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ================== POST ==================
  if (req.method === "POST") {
    try {
      const { name, nationalId, mobile, email, county, constituency, ward } = req.body;

      if (!name || !nationalId || !mobile || !email || !county || !constituency || !ward) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Load county.json
      const filePath = path.join(process.cwd(), "public", "county.json");
      const countyData = JSON.parse(fs.readFileSync(filePath, "utf8"));

      const selectedCounty = countyData.find(c => c.county_name === county);
      if (!selectedCounty) {
        return res.status(400).json({ error: "Invalid County" });
      }

      const selectedConstituency = selectedCounty.constituencies.find(
        c => c.constituency_name === constituency
      );
      if (!selectedConstituency) {
        return res.status(400).json({ error: "Invalid Constituency for selected County" });
      }

      if (!selectedConstituency.wards.includes(ward)) {
        return res.status(400).json({ error: "Invalid Ward for selected Constituency" });
      }

      // Uniqueness check
      const existingMember = await prisma.member.findUnique({
        where: { nationalId }
      });

      if (existingMember) {
        return res.status(400).json({ error: "Member with this National ID already exists" });
      }

      const newMember = await prisma.member.create({
        data: {
          name,
          nationalId,
          mobile,
          email,
          county,
          constituency,
          ward
        }
      });

      return res.status(201).json({
        message: "Member registered successfully",
        member: newMember
      });

    } catch (error) {
      console.error("Registration Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ================== PUT ==================
  if (req.method === "PUT") {
    try {
      const { id, name, nationalId, mobile, email, county, constituency, ward } = req.body;

      if (!id || !name || !nationalId || !mobile || !email || !county || !constituency || !ward) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const updatedMember = await prisma.member.update({
        where: { id },
        data: {
          name,
          nationalId,
          mobile,
          email,
          county,
          constituency,
          ward
        }
      });

      return res.status(200).json({
        message: "Member updated successfully",
        member: updatedMember
      });

    } catch (error) {
      console.error("Update Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ================== DELETE ==================
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "ID is required" });

      await prisma.member.delete({
        where: { id }
      });

      return res.status(200).json({ message: "Member deleted successfully" });

    } catch (error) {
      console.error("Delete Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
