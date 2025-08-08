import { uuid } from "drizzle-orm/gel-core";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Define a "users" table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export the schema type
export type User = typeof users.$inferSelect; // For SELECT queries
export type NewUser = typeof users.$inferInsert; // For INSERT queries
