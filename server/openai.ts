import OpenAI from "openai";
import { RelatedTopic } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || '' 
});

/**
 * Generate a simplified explanation for a complex topic
 */
export async function explainTopic(topic: string, type: "short" | "long"): Promise<string> {
  try {
    const prompt = type === "short"
      ? `Explain ${topic} to a 5-year-old child in 1-2 simple sentences.`
      : `Explain ${topic} to a 5-year-old child in 4-5 simple paragraphs. Use examples a child would understand and keep each paragraph short.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at simplifying complex topics for young children. Use simple words, engaging examples, and avoid technical terms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: type === "short" ? 100 : 500,
    });

    return response.choices[0].message.content || "I couldn't create an explanation for that topic.";
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Failed to generate explanation");
  }
}

/**
 * Generate related topics for a given topic
 */
export async function generateRelatedTopics(topic: string): Promise<RelatedTopic[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at identifying related concepts and topics. Provide 4 related topics for the given subject that would be suitable for a 5-year-old to learn next. Each related topic should have a title and a short description. Response should be in JSON format."
        },
        {
          role: "user",
          content: `Generate 4 related topics for "${topic}" that would be easy for a 5-year-old to understand next. Each should have a title (max 30 chars) and a short description (max 60 chars). Return as JSON array with "title" and "description" fields.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return [];
    }

    const parsed = JSON.parse(content);
    if (Array.isArray(parsed.topics)) {
      return parsed.topics.slice(0, 4).map((topic: any) => ({
        title: topic.title.slice(0, 30),
        description: topic.description.slice(0, 60)
      }));
    } else if (Array.isArray(parsed)) {
      return parsed.slice(0, 4).map((topic: any) => ({
        title: topic.title.slice(0, 30),
        description: topic.description.slice(0, 60)
      }));
    }

    return [];
  } catch (error) {
    console.error("Error generating related topics:", error);
    return [];
  }
}
