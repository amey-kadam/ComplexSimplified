import OpenAI from "openai";
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import https from 'https';
import { Readable } from 'stream';

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || '' 
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generates a simplified explanation for a complex topic
 * @param topic The complex topic to explain
 * @param isLongExplanation Whether to generate a long or short explanation
 * @returns The simplified explanation
 */
export async function generateExplanation(
  topic: string, 
  isLongExplanation: boolean
): Promise<string> {
  try {
    const explanationType = isLongExplanation ? "detailed" : "brief";
    const maxTokens = isLongExplanation ? 1000 : 300;
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            `You are an expert at explaining complex topics in simple terms that a 5-year-old child could understand. 
            Use simple language, concrete examples, and engaging analogies.
            Avoid jargon, technical terms, and complex sentences.
            Make the explanation ${explanationType} and easy to follow.
            Keep your response focused only on explaining the topic in simple terms.
            Do not include any disclaimers, notes, or anything other than the explanation itself.`
        },
        {
          role: "user",
          content: `Explain this complex topic in simple terms that a 5-year-old would understand: ${topic}`
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Sorry, I couldn't generate an explanation.";
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Failed to generate explanation");
  }
}

/**
 * Downloads an image from a URL and converts it to a base64 string
 * @param url The URL of the image to download
 * @returns Promise with the base64 encoded image
 */
async function downloadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image, status code: ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          // Resize and optimize the image
          const optimizedImage = await sharp(buffer)
            .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
          
          const base64Image = optimizedImage.toString('base64');
          resolve(base64Image);
        } catch (error) {
          reject(error);
        }
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Generates an illustration for a topic using DALL-E
 * @param topic The topic to illustrate
 * @returns Promise with the base64 encoded image
 */
async function generateIllustration(topic: string): Promise<string> {
  try {
    const prompt = `Create a colorful, educational illustration for kids explaining "${topic}" in a simple way. Use bright colors, simple shapes, and a friendly style. Make it visually engaging and suitable for children.`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL returned from DALL-E");
    }

    // Download the image and convert to base64
    const base64Image = await downloadImageAsBase64(imageUrl);
    return base64Image;
  } catch (error) {
    console.error("Error generating illustration:", error);
    throw new Error("Failed to generate illustration");
  }
}

/**
 * Generates both short and long explanations for a topic in a single batch request
 * Along with flashcards, a flowchart, and an illustration
 * @param topic The complex topic to explain
 * @returns Object containing both short and long explanations, flashcards, flowchart, and illustration
 */
export async function generateBothExplanations(topic: string): Promise<{
  shortExplanation: string;
  longExplanation: string;
  flashcards: string;
  flowchart: string;
  illustration: string;
}> {
  try {
    // Step 1: Generate text content (explanations, flashcards, flowchart)
    let textContent: {
      shortExplanation: string;
      longExplanation: string;
      flashcards: string;
      flowchart: string;
    };
    
    const textResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: 
            `You are an expert at explaining complex topics in simple terms that anyone can understand. 
            Use simple language, concrete examples, and engaging analogies.
            Avoid jargon, technical terms, and complex sentences.
            
            You will provide FOUR components for the topic:
            1. A SHORT explanation (2-3 sentences, ~50 words)
            2. A LONG explanation (several paragraphs, ~300 words)
            3. FLASHCARDS (5 question-answer pairs to help learn the topic)
            4. A simple FLOWCHART (represented in text format with arrows -> and bullet points)
            
            Format your response as valid JSON with the fields:
            - "shortExplanation" (string)
            - "longExplanation" (string)
            - "flashcards" (array of objects with "question" and "answer" fields)
            - "flowchart" (string with a simple text-based flowchart)`
        },
        {
          role: "user",
          content: `Explain this complex topic in simple terms: ${topic}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = textResponse.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsedResponse = JSON.parse(content);
    textContent = {
      shortExplanation: parsedResponse.shortExplanation,
      longExplanation: parsedResponse.longExplanation,
      flashcards: JSON.stringify(parsedResponse.flashcards),
      flowchart: parsedResponse.flowchart
    };

    // Step 2: Generate illustration
    let illustration = "";
    try {
      illustration = await generateIllustration(topic);
    } catch (imageError) {
      console.error("Error generating illustration:", imageError);
      // Continue without illustration
    }
    
    // Return results
    return {
      ...textContent,
      illustration
    };
  } catch (error) {
    console.error("Error generating explanations:", error);
    throw new Error("Failed to generate explanations");
  }
}