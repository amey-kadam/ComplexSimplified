import { explanations, type Explanation, type InsertExplanation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  getExplanation(topic: string, type: string): Promise<Explanation | undefined>;
  saveExplanation(explanation: InsertExplanation): Promise<Explanation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private explanations: Map<string, Explanation>;
  currentId: number;
  currentExplanationId: number;

  constructor() {
    this.users = new Map();
    this.explanations = new Map();
    this.currentId = 1;
    this.currentExplanationId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getExplanation(topic: string, type: string): Promise<Explanation | undefined> {
    // Create a case-insensitive key for lookups
    const normalizedTopic = topic.toLowerCase().trim();
    const key = `${normalizedTopic}:${type}`;
    
    return this.explanations.get(key);
  }

  async saveExplanation(insertExplanation: InsertExplanation): Promise<Explanation> {
    const id = this.currentExplanationId++;
    const normalizedTopic = insertExplanation.topic.toLowerCase().trim();
    const key = `${normalizedTopic}:${insertExplanation.type}`;
    
    const explanation: Explanation = { 
      ...insertExplanation, 
      id,
      createdAt: new Date()
    };
    
    this.explanations.set(key, explanation);
    return explanation;
  }
}

export const storage = new MemStorage();
