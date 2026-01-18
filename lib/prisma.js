// lib/prisma.js
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Required for Neon WebSocket support (especially in dev/Next.js)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env.local or .env");
}

// Simple version: let adapter handle pooling (works for most cases)
const adapter = new PrismaNeon({ connectionString });

// Alternative with explicit Pool (better for high concurrency):
// const { Pool } = require("@neondatabase/serverless");
// const pool = new Pool({ connectionString });
// const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis;  // ← no "as ..." needed in JS

let prisma = globalForPrisma.prisma;

if (!prisma) {
  prisma = new PrismaClient({
    adapter,
    // Optional: log queries in dev
    // log: process.env.NODE_ENV === "development" ? ["query"] : undefined,
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };