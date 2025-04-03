import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { explainTopic, generateRelatedTopics } from "./openai";
import { z } from "zod";

// Define the schema for the explain request
const explainRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  type: z.enum(["short", "long"])
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Endpoint to explain a topic
  app.post('/api/explain', async (req, res) => {
    try {
      // Validate request body
      const validatedData = explainRequestSchema.parse(req.body);
      const { topic, type } = validatedData;
      
      // Check cache first
      const cachedExplanation = await storage.getExplanation(topic, type);
      
      if (cachedExplanation) {
        return res.json({
          explanation: cachedExplanation.explanation,
          relatedTopics: cachedExplanation.relatedTopics
        });
      }
      
      // Generate explanation using OpenAI
      const explanation = await explainTopic(topic, type);
      
      // Generate related topics
      const relatedTopics = await generateRelatedTopics(topic);
      
      // Cache the results
      await storage.saveExplanation({
        topic,
        type,
        explanation,
        relatedTopics
      });
      
      res.json({
        explanation,
        relatedTopics
      });
    } catch (error) {
      console.error('Error explaining topic:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to generate explanation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
