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

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ExplanationResponse | null>(null);
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
    mutate({ topic: formTopic, explanationType, options });
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
      
      mutate({ 
        topic, 
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

  return (
    <div className="pb-10">
      {/* Intro Section */}
      <section className="mb-8 text-center">
        <h1 className="font-bold text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Simplify Complex Topics
        </h1>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Enter any complex topic, and CurioPal will explain it in simple, easy-to-understand terms.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-full">
            <span className="text-xl mr-2">⚡</span>
            <span className="text-sm font-medium">Simple explanations</span>
          </div>
          <div className="flex items-center bg-orange-100 px-4 py-2 rounded-full">
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
