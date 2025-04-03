import { ExplanationType } from "@/pages/Home";

export interface ExplainResponse {
  explanation: string;
  relatedTopics: { title: string; description: string }[];
}

export async function explainTopic(topic: string, type: ExplanationType): Promise<ExplainResponse> {
  const response = await fetch('/api/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, type }),
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  
  return await response.json();
}
