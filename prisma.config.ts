import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use your Neon database URL from .env
    url: process.env.DATABASE_URL,
  
  },
});
