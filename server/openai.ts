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
    
    // Check if the topic contains age group information
    let ageGroup = "kids"; // Default to kids
    let cleanTopic = topic;
    
    if (topic.includes("explain for")) {
      if (topic.includes("5-8 year olds")) {
        ageGroup = "kids";
      } else if (topic.includes("9-12 year olds")) {
        ageGroup = "preteen";
      } else if (topic.includes("13-17 year olds")) {
        ageGroup = "teen";
      } else if (topic.includes("adults")) {
        ageGroup = "adult";
      }
      
      // Remove the age group instruction from the topic
      cleanTopic = topic.split("(explain for")[0].trim();
    }
    
    // Customize system prompt based on age group
    let systemContent = "";
    if (ageGroup === "kids") {
      systemContent = `You are an expert at explaining complex topics in simple terms that a 5-8 year old child could understand. 
        Use very simple language, concrete examples, colorful analogies, and relate to everyday experiences a young child would understand.
        Avoid all jargon, technical terms, and complex sentences.
        Make the explanation ${explanationType}, engaging, and easy to follow.`;
    } else if (ageGroup === "preteen") {
      systemContent = `You are an expert at explaining complex topics in simple terms that a 9-12 year old pre-teen could understand. 
        Use straightforward language, relatable examples, and analogies that connect to school subjects and common pre-teen interests.
        Minimize jargon, define any technical terms used, and keep sentences moderately complex.
        Make the explanation ${explanationType}, interesting, and educational.`;
    } else if (ageGroup === "teen") {
      systemContent = `You are an expert at explaining complex topics in terms that a 13-17 year old teenager could understand. 
        Use age-appropriate language with some technical terms (defined when introduced), examples relevant to high school curriculum, and analogies that connect to teen interests and current events.
        You can use more complex sentence structures but maintain clarity.
        Make the explanation ${explanationType}, engaging, and intellectually stimulating.`;
    } else { // adult
      systemContent = `You are an expert at explaining complex topics in clear terms that an adult without specialized knowledge could understand. 
        Use plain language but don't oversimplify, provide relevant examples and meaningful analogies.
        You can use some field-specific terminology (with brief definitions) and varied sentence structures.
        Make the explanation ${explanationType}, informative, and intellectually satisfying.`;
    }
    
    // Add common instructions for all age groups
    systemContent += `
      Keep your response focused only on explaining the topic.
      Do not include any disclaimers, notes, or anything other than the explanation itself.`;
    
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: systemContent
        },
        {
          role: "user",
          content: `Explain this topic: ${cleanTopic}`
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
 * @param knowledgeLevel The target knowledge level (beginner, intermediate, advanced, expert)
 * @returns Promise with the base64 encoded image
 */
async function generateIllustration(topic: string, knowledgeLevel: string = "beginner"): Promise<string> {
  try {
    let prompt = "";
    
    if (knowledgeLevel === "beginner") {
      prompt = `Create a colorful, educational illustration for beginners (ages 5-10) explaining "${topic}" in a simple way. Use bright colors, simple shapes, and a friendly style with cartoon-like characters. Make it visually engaging with minimal text and suitable for young learners or complete beginners to the topic.`;
    } else if (knowledgeLevel === "intermediate") {
      prompt = `Create an educational illustration for intermediate learners (ages 11-16) explaining "${topic}". Use a clear, engaging style with more detailed diagrams than for beginners. Include properly labeled components and make it suitable for students with basic knowledge of the subject. Balance visual appeal with informational content.`;
    } else if (knowledgeLevel === "advanced") {
      prompt = `Create an educational illustration for advanced learners (ages 17-25) explaining "${topic}". Use a sophisticated graphic style with detailed, accurate diagrams, comprehensive labels, and a design that would appeal to college students or people with good prior knowledge. Include relevant theoretical elements and practical applications.`;
    } else { // expert
      prompt = `Create a professional-grade illustration explaining "${topic}" for experts or specialists. Use a technical, precise design with comprehensive diagrams, detailed labels, and a clean, sophisticated aesthetic. Focus on accuracy, nuance, and depth of information. Include advanced concepts, edge cases, and technical details that would be relevant to professionals in the field.`;
    }
    
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
 * Along with optional flashcards, flowchart, and illustration
 * @param topic The complex topic to explain
 * @param includeFlashcards Whether to include flashcards (defaults to true)
 * @param includeFlowchart Whether to include a flowchart (defaults to true)
 * @param includeIllustration Whether to include an illustration (defaults to true)
 * @returns Object containing both short and long explanations and optional flashcards, flowchart, and illustration
 */
export async function generateBothExplanations(
  topic: string,
  includeFlashcards: boolean = true,
  includeFlowchart: boolean = true,
  includeIllustration: boolean = true
): Promise<{
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
    
    // Check if the topic contains knowledge level information
    let knowledgeLevel = "beginner"; // Default to beginner
    let cleanTopic = topic;
    
    if (topic.includes("explain for")) {
      if (topic.includes("beginners") || topic.includes("5-10 year olds")) {
        knowledgeLevel = "beginner";
      } else if (topic.includes("intermediate") || topic.includes("11-16 year olds")) {
        knowledgeLevel = "intermediate";
      } else if (topic.includes("advanced") || topic.includes("17-25 year olds")) {
        knowledgeLevel = "advanced";
      } else if (topic.includes("expert") || topic.includes("adults") || topic.includes("professionals")) {
        knowledgeLevel = "expert";
      }
      
      // Remove the knowledge level instruction from the topic
      cleanTopic = topic.split("(explain for")[0].trim();
    }
    
    // Customize system prompt based on knowledge level
    let systemContent = "";
    if (knowledgeLevel === "beginner") {
      systemContent = `You are an expert at explaining complex topics for complete beginners (equivalent to ages 5-10). 
            Use very simple language, concrete examples, colorful analogies, and relate to everyday experiences anyone can understand.
            Avoid all jargon and technical terms. Assume no prior knowledge of the subject.
            Focus on making the concept engaging and approachable with a sense of wonder.`;
    } else if (knowledgeLevel === "intermediate") {
      systemContent = `You are an expert at explaining complex topics for people with basic knowledge (equivalent to ages 11-16). 
            Use straightforward language with some field-specific terms (always defined when introduced).
            Include relatable examples, clear analogies, and build on foundational concepts most people understand.
            Explain how and why things work at a deeper level than beginner explanations.`;
    } else if (knowledgeLevel === "advanced") {
      systemContent = `You are an expert at explaining complex topics for people with solid knowledge (equivalent to ages 17-25). 
            Use more sophisticated language with appropriate terminology (briefly explained if specialized).
            Include detailed examples, nuanced explanations, and make connections to related concepts.
            Don't oversimplify and include more theoretical background where relevant.`;
    } else { // expert
      systemContent = `You are an expert at explaining complex topics for knowledgeable audiences (professionals or enthusiasts).
            Use field-appropriate language and technical terms with precision. Assume solid background knowledge.
            Include in-depth analysis, cutting-edge perspectives, and sophisticated connections between concepts.
            Don't shy away from complexity but ensure explanations remain clear and well-structured.
            Focus on nuance, edge cases, and advanced applications of the concept.`;
    }
    
    // Add common instructions for content to generate
    systemContent += `
            
            You will provide the following components for the topic:
            1. A SHORT explanation (2-3 sentences, ~50 words)
            2. A LONG explanation (several paragraphs, ~300 words)`;
            
    if (includeFlashcards) {
      systemContent += `\n            3. FLASHCARDS (5 question-answer pairs to help learn the topic)`;
    }
    
    if (includeFlowchart) {
      systemContent += `\n            4. A simple FLOWCHART (represented in text format with arrows -> and bullet points)`;
    }
    
    systemContent += `\n\nFormat your response as valid JSON with the fields:
            - "shortExplanation" (string)
            - "longExplanation" (string)`;
            
    if (includeFlashcards) {
      systemContent += `\n            - "flashcards" (array of objects with "question" and "answer" fields)`;
    }
    
    if (includeFlowchart) {
      systemContent += `\n            - "flowchart" (string with a simple text-based flowchart)`;
    }
    
    const textResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: systemContent
        },
        {
          role: "user",
          content: `Explain this complex topic in simple terms: ${cleanTopic}`
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
      flashcards: includeFlashcards && parsedResponse.flashcards 
        ? JSON.stringify(parsedResponse.flashcards) 
        : "[]",
      flowchart: includeFlowchart && parsedResponse.flowchart 
        ? parsedResponse.flowchart 
        : ""
    };

    // Step 2: Generate illustration if requested
    let illustration = "";
    if (includeIllustration) {
      try {
        illustration = await generateIllustration(cleanTopic, knowledgeLevel);
      } catch (imageError) {
        console.error("Error generating illustration:", imageError);
        // Continue without illustration
      }
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