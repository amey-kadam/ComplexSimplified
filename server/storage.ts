import { explanations, type Explanation, type InsertExplanation } from "@shared/schema";

export interface IStorage {
  // Get explanation by topic
  getExplanationByTopic(topic: string): Promise<Explanation | undefined>;
  
  // Store a new explanation
  createExplanation(explanation: InsertExplanation): Promise<Explanation>;
}

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

export const storage = new MemStorage();
