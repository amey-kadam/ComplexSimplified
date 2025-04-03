import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Topic explanation schema
export const explanations = pgTable("explanations", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  shortExplanation: text("short_explanation").notNull(),
  longExplanation: text("long_explanation").notNull(),
  flashcards: text("flashcards").default("[]"), // JSON string of flashcards
  flowchart: text("flowchart").default(""), // Text-based flowchart
  illustration: text("illustration").default(""), // URL or base64 image for visual aid
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertExplanationSchema = createInsertSchema(explanations).pick({
  topic: true,
  shortExplanation: true,
  longExplanation: true,
  flashcards: true,
  flowchart: true,
  illustration: true,
});

// Request schema for generating explanations
export const generateExplanationSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(200, "Topic is too long"),
  explanationType: z.enum(["short", "long"]),
});

export type InsertExplanation = z.infer<typeof insertExplanationSchema>;
export type Explanation = typeof explanations.$inferSelect;
export type GenerateExplanationRequest = z.infer<typeof generateExplanationSchema>;

// Flashcard interface
export interface Flashcard {
  question: string;
  answer: string;
}

// Response schema for explanation API
export interface ExplanationResponse {
  topic: string;
  explanation: string;
  explanationType: "short" | "long";
  flashcards?: Flashcard[];
  flowchart?: string;
  illustration?: string; // URL or base64 encoded image
}
