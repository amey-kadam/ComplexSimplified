import OpenAI from "openai";

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
 * Generates both short and long explanations for a topic in a single batch request
 * Along with flashcards and a flowchart
 * @param topic The complex topic to explain
 * @returns Object containing both short and long explanations, flashcards, and flowchart
 */
export async function generateBothExplanations(topic: string): Promise<{
  shortExplanation: string;
  longExplanation: string;
  flashcards: string;
  flowchart: string;
}> {
  try {
    const response = await openai.chat.completions.create({
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

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const parsedResponse = JSON.parse(content);
    return {
      shortExplanation: parsedResponse.shortExplanation,
      longExplanation: parsedResponse.longExplanation,
      flashcards: JSON.stringify(parsedResponse.flashcards),
      flowchart: parsedResponse.flowchart
    };
  } catch (error) {
    console.error("Error generating explanations:", error);
    throw new Error("Failed to generate explanations");
  }
}
