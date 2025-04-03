import { useState } from "react";
import TopicForm from "@/components/TopicForm";
import ExampleTopics from "@/components/ExampleTopics";
import ExplanationResult from "@/components/ExplanationResult";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ExplanationResponse } from "@shared/schema";

interface TopicOptions {
  includeFlashcards: boolean;
  includeFlowchart: boolean;
  includeIllustration: boolean;
}

type KnowledgeLevel = "beginner" | "intermediate" | "advanced" | "expert";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>("beginner");
  const { toast } = useToast();
  
  // Explanation generation mutation
  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: async ({ 
      topic, 
      explanationType,
      options
    }: { 
      topic: string; 
      explanationType: "short" | "long";
      options: TopicOptions;
    }) => {
      const response = await apiRequest("POST", "/api/explain", {
        topic,
        explanationType,
        includeFlashcards: options.includeFlashcards,
        includeFlowchart: options.includeFlowchart,
        includeIllustration: options.includeIllustration
      });
      return response.json() as Promise<ExplanationResponse>;
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error) => {
      console.error("Error generating explanation:", error);
      toast({
        title: "Error",
        description: "Failed to generate explanation. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (formTopic: string, explanationType: "short" | "long", options: TopicOptions) => {
    setTopic(formTopic);
    // Add the knowledge level to the topic string to customize the explanation 
    const topicWithKnowledgeLevel = `${formTopic} (explain for ${knowledgeLevel})`;
    
    mutate({ topic: topicWithKnowledgeLevel, explanationType, options });
  };
  
  const handleTryAgain = () => {
    reset();
    if (topic && result) {
      // Default options when trying again
      const defaultOptions: TopicOptions = {
        includeFlashcards: true,
        includeFlowchart: true,
        includeIllustration: true
      };
      
      // Use the original topic but add knowledge level instruction
      const topicWithKnowledgeLevel = `${topic} (explain for ${knowledgeLevel})`;
      
      mutate({ 
        topic: topicWithKnowledgeLevel, 
        explanationType: result.explanationType,
        options: defaultOptions
      });
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setTopic("");
  };
  
  const handleExampleSelect = (exampleTopic: string) => {
    setTopic(exampleTopic);
  };
  
  const handleKnowledgeLevelChange = (level: KnowledgeLevel) => {
    setKnowledgeLevel(level);
    setResult(null); // Clear previous results when changing knowledge level
  };

  return (
    <div className="pb-10">
      {/* Intro Section */}
      <section className="mb-8 text-center py-6 px-4 bg-yellow-300 rounded-xl border-2 border-yellow-500 shadow-md max-w-4xl mx-auto">
        <h1 className="font-bold text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent animate-pulse">
          Simplify Complex Topics
        </h1>
        <p className="text-gray-800 font-medium mb-3 max-w-lg mx-auto">
          Enter any complex topic, and CurioPal will explain it in simple, easy-to-understand terms.
        </p>
        
        {/* Knowledge Level Selector */}
        <div className="max-w-xl mx-auto mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-1 rounded-xl shadow-md">
            <div className="flex justify-between bg-yellow-100 rounded-lg p-1 border border-yellow-400">
              <button 
                onClick={() => handleKnowledgeLevelChange("beginner")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  knowledgeLevel === "beginner" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-yellow-200"
                }`}
              >
                5-Year-Old
              </button>
              <button 
                onClick={() => handleKnowledgeLevelChange("intermediate")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  knowledgeLevel === "intermediate" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-yellow-200"
                }`}
              >
                &lt;15 Years
              </button>
              <button 
                onClick={() => handleKnowledgeLevelChange("advanced")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  knowledgeLevel === "advanced" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-yellow-200"
                }`}
              >
                &lt;25 Years
              </button>
              <button 
                onClick={() => handleKnowledgeLevelChange("expert")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  knowledgeLevel === "expert" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-yellow-200"
                }`}
              >
                50+ Years
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            Select an age level to determine the complexity of the explanation
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <div className="flex items-center bg-yellow-400 px-4 py-2 rounded-full border-2 border-yellow-500 shadow-md">
            <span className="text-xl mr-2">⚡</span>
            <span className="text-sm font-medium">Simple explanations</span>
          </div>
          <div className="flex items-center bg-yellow-300 px-4 py-2 rounded-full border-2 border-yellow-500 shadow-md">
            <span className="text-xl mr-2">📚</span>
            <span className="text-sm font-medium">Short & long options</span>
          </div>
        </div>
      </section>
      
      {/* Form Input Card */}
      <TopicForm 
        initialTopic={topic} 
        onSubmit={handleSubmit} 
      />
      
      {/* Loading, Error, Result States */}
      {isPending && <LoadingState />}
      {isError && !isPending && (
        <ErrorState 
          error={error as Error} 
          onTryAgain={handleTryAgain} 
        />
      )}
      {!isPending && !isError && result && (
        <ExplanationResult 
          result={result} 
          onTryAgain={handleReset}
        />
      )}
      {!isPending && !isError && !result && <EmptyState />}
      
      {/* Example Topics */}
      <ExampleTopics onSelectTopic={handleExampleSelect} />
    </div>
  );
}
