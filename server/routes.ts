import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBothExplanations } from "./openai";
import { generateExplanationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate an explanation
  app.post("/api/explain", async (req, res) => {
    try {
      // Validate request body
      const validatedBody = generateExplanationSchema.parse(req.body);
      const { topic, explanationType, includeFlashcards, includeFlowchart, includeIllustration } = validatedBody;
      
      // Check cache first
      const cachedExplanation = await storage.getExplanationByTopic(topic);
      
      if (cachedExplanation) {
        // Parse flashcards from JSON string
        const flashcards = cachedExplanation.flashcards 
          ? JSON.parse(cachedExplanation.flashcards) 
          : [];
          
        // Return cached explanation if available
        const response: any = {
          topic: cachedExplanation.topic,
          explanation: explanationType === "short" 
            ? cachedExplanation.shortExplanation 
            : cachedExplanation.longExplanation,
          explanationType
        };
        
        // Only include selected features
        if (includeFlashcards) {
          response.flashcards = flashcards;
        }
        
        if (includeFlowchart) {
          response.flowchart = cachedExplanation.flowchart;
        }
        
        if (includeIllustration) {
          response.illustration = cachedExplanation.illustration;
        }
        
        return res.json(response);
      }
      
      // Generate new explanations with optional flashcards, flowchart, and illustration
      const { shortExplanation, longExplanation, flashcards, flowchart, illustration } = await generateBothExplanations(
        topic,
        includeFlashcards,
        includeFlowchart,
        includeIllustration
      );
      
      // Store both explanations with flashcards, flowchart, and illustration in storage
      await storage.createExplanation({
        topic,
        shortExplanation,
        longExplanation,
        flashcards,
        flowchart,
        illustration
      });
      
      // Return the requested explanation type along with selected features
      const response: any = {
        topic,
        explanation: explanationType === "short" ? shortExplanation : longExplanation,
        explanationType
      };
      
      // Only include selected features
      if (includeFlashcards) {
        response.flashcards = JSON.parse(flashcards);
      }
      
      if (includeFlowchart) {
        response.flowchart = flowchart;
      }
      
      if (includeIllustration) {
        response.illustration = illustration;
      }
      
      res.json(response);
      
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: validationError.message 
        });
      }
      
      console.error("Error generating explanation:", error);
      res.status(500).json({ 
        message: "Failed to generate explanation. Please try again later." 
      });
    }
  });

  // Example topics
  app.get("/api/example-topics", (_req, res) => {
    const exampleTopics = [
      { id: 1, name: "Climate Change", description: "What's happening to our planet?", icon: "ClimateIcon" },
      { id: 2, name: "Blockchain", description: "How does cryptocurrency work?", icon: "BlockchainIcon" },
      { id: 3, name: "Artificial Intelligence", description: "How do computers learn?", icon: "AIIcon" },
      { id: 4, name: "How Emotions Work", description: "Why do we feel different ways?", icon: "EmotionsIcon" }
    ];
    
    res.json(exampleTopics);
  });

  const httpServer = createServer(app);
  return httpServer;
}
