import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Database url must be provided");
}

export default defineConfig({
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  schema: "./src/drizzle/schema.ts",
  casing: "snake_case",
  verbose: true,
  strict: false,
  dbCredentials: {
    url: DATABASE_URL,
  },
});
