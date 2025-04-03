import { explanations, type Explanation, type InsertExplanation } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, ilike } from "drizzle-orm";

export interface IStorage {
  // Get explanation by topic
  getExplanationByTopic(topic: string): Promise<Explanation | undefined>;
  
  // Store a new explanation
  createExplanation(explanation: InsertExplanation): Promise<Explanation>;
}

// Initialize the Postgres client
const queryClient = postgres(process.env.DATABASE_URL!);
// Initialize the Drizzle client
const db = drizzle(queryClient);

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
    
    const explanation: Explanation = { 
      ...insertExplanation, 
      id,
      createdAt 
    };
    
    this.explanations.set(id, explanation);
    return explanation;
  }
}

// Use PostgreSQL storage
export const storage = new PgStorage();
