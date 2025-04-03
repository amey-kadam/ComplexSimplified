import { useState } from "react";
import Header from "@/components/Header";
import TopicForm from "@/components/TopicForm";
import LoadingIndicator from "@/components/LoadingIndicator";
import ExplanationResult from "@/components/ExplanationResult";
import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";

export type ExplanationType = "short" | "long";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [explanationType, setExplanationType] = useState<ExplanationType>("short");
  const [relatedTopics, setRelatedTopics] = useState<{ title: string; description: string }[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleRetry = () => {
    setError(null);
    handleSubmit(topic, explanationType);
  };

  const handleSubmit = async (topicInput: string, type: ExplanationType) => {
    setTopic(topicInput);
    setExplanationType(type);
    setIsLoading(true);
    setError(null);
    setShowResult(false);
    
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topicInput, type }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      setExplanation(data.explanation);
      setRelatedTopics(data.relatedTopics);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTopic = () => {
    setShowResult(false);
    setTopic("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-6 md:py-10 max-w-3xl flex-grow">
        <section className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">Explain Complex Topics Simply</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter any complex topic and get an explanation so simple, even a 5-year-old would understand.
            Choose between a short or detailed explanation based on your needs.
          </p>
        </section>
        
        <TopicForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          initialTopic={topic}
        />
        
        {isLoading && <LoadingIndicator />}
        
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        
        {showResult && !isLoading && !error && (
          <ExplanationResult 
            topic={topic}
            explanation={explanation}
            explanationType={explanationType}
            relatedTopics={relatedTopics}
            onNewTopic={handleNewTopic}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}
