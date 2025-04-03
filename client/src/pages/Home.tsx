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

type AgeGroup = "kids" | "preteen" | "teen" | "adult";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("kids");
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
    // Add the age group to the topic string to customize the explanation for the selected age group
    const topicWithAgeGroup = `${formTopic} (explain for ${ageGroup === "kids" ? "5-8 year olds" : 
      ageGroup === "preteen" ? "9-12 year olds" : 
      ageGroup === "teen" ? "13-17 year olds" : 
      "adults"})`;
    
    mutate({ topic: topicWithAgeGroup, explanationType, options });
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
      
      // Use the original topic but add age group instruction
      const topicWithAgeGroup = `${topic} (explain for ${ageGroup === "kids" ? "5-8 year olds" : 
        ageGroup === "preteen" ? "9-12 year olds" : 
        ageGroup === "teen" ? "13-17 year olds" : 
        "adults"})`;
      
      mutate({ 
        topic: topicWithAgeGroup, 
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
  
  const handleAgeGroupChange = (group: AgeGroup) => {
    setAgeGroup(group);
    setResult(null); // Clear previous results when changing age group
  };

  return (
    <div className="pb-10">
      {/* Intro Section */}
      <section className="mb-8 text-center">
        <h1 className="font-bold text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Simplify Complex Topics
        </h1>
        <p className="text-gray-600 mb-3 max-w-lg mx-auto">
          Enter any complex topic, and CurioPal will explain it in simple, easy-to-understand terms.
        </p>
        
        {/* Age Group Selector */}
        <div className="max-w-md mx-auto mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-1 rounded-xl shadow-md">
            <div className="flex justify-between bg-white rounded-lg p-1">
              <button 
                onClick={() => handleAgeGroupChange("kids")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  ageGroup === "kids" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Kids (5-8)
              </button>
              <button 
                onClick={() => handleAgeGroupChange("preteen")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  ageGroup === "preteen" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Pre-teen (9-12)
              </button>
              <button 
                onClick={() => handleAgeGroupChange("teen")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  ageGroup === "teen" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Teen (13-17)
              </button>
              <button 
                onClick={() => handleAgeGroupChange("adult")}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 ${
                  ageGroup === "adult" 
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Adult (18+)
              </button>
            </div>
          </div>
        </div>
        
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
