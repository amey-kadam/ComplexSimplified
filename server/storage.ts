import { explanations, type Explanation, type InsertExplanation } from "@shared/schema";
import { eq, ilike } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // Get explanation by topic
  getExplanationByTopic(topic: string): Promise<Explanation | undefined>;
  
  // Store a new explanation
  createExplanation(explanation: InsertExplanation): Promise<Explanation>;
}

export class PgStorage implements IStorage {
  async getExplanationByTopic(topic: string): Promise<Explanation | undefined> {
    // Case-insensitive search for the topic using ILIKE pattern
    const normalizedTopic = topic.trim();
    
    const results = await db.select()
      .from(explanations)
      .where(ilike(explanations.topic, `%${normalizedTopic}%`))
      .limit(1);
      
    return results[0];
  }
  
  async createExplanation(insertExplanation: InsertExplanation): Promise<Explanation> {
    const result = await db.insert(explanations)
      .values(insertExplanation)
      .returning();
    
    return result[0];
  }
}

// Keep MemStorage for fallback or testing
export class MemStorage implements IStorage {
  private explanations: Map<number, Explanation>;
  private currentId: number;
  
  constructor() {
    this.explanations = new Map();
    this.currentId = 1;
  }
  
  async getExplanationByTopic(topic: string): Promise<Explanation | undefined> {
    // Case-insensitive search for the topic
    const normalizedTopic = topic.trim().toLowerCase();
    
    return Array.from(this.explanations.values()).find(
      (explanation) => explanation.topic.toLowerCase() === normalizedTopic
    );
  }
  
  async createExplanation(insertExplanation: InsertExplanation): Promise<Explanation> {
    const id = this.currentId++;
    const createdAt = new Date();
    
    // Create a properly typed explanation object
    const explanation: Explanation = { 
      id,
      topic: insertExplanation.topic,
      shortExplanation: insertExplanation.shortExplanation,
      longExplanation: insertExplanation.longExplanation,
      flashcards: insertExplanation.flashcards || "[]",
      flowchart: insertExplanation.flowchart || "",
      illustration: insertExplanation.illustration || "",
      createdAt
    };
    
    this.explanations.set(id, explanation);
    return explanation;
  }
}

// Use PostgreSQL storage
export const storage = new PgStorage();
