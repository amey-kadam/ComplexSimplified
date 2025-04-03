import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping original)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Related topic interface
export interface RelatedTopic {
  title: string;
  description: string;
}

// Explanation schema
export const explanations = pgTable("explanations", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  type: text("type").notNull(), // "short" or "long"
  explanation: text("explanation").notNull(),
  relatedTopics: text("related_topics").notNull(), // JSON stringified array
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertExplanationSchema = createInsertSchema(explanations).omit({
  id: true,
  createdAt: true,
});

export type InsertExplanation = {
  topic: string;
  type: string;
  explanation: string;
  relatedTopics: RelatedTopic[];
};

export type Explanation = {
  id: number;
  topic: string;
  type: string;
  explanation: string;
  relatedTopics: RelatedTopic[];
  createdAt: Date;
};
