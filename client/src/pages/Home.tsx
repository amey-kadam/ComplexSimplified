import { useState } from "react";
import HeaderSection from "@/components/HeaderSection";
import FooterSection from "@/components/FooterSection";
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

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ExplanationResponse | null>(null);
  const { toast } = useToast();
  
  // Explanation generation mutation
  const { mutate, isPending, isError, error, reset } = useMutation({
    mutationFn: async ({ 
      topic, 
      explanationType 
    }: { 
      topic: string; 
      explanationType: "short" | "long"; 
    }) => {
      const response = await apiRequest("POST", "/api/explain", {
        topic,
        explanationType,
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
  
  const handleSubmit = (formTopic: string, explanationType: "short" | "long") => {
    setTopic(formTopic);
    mutate({ topic: formTopic, explanationType });
  };
  
  const handleTryAgain = () => {
    reset();
    if (topic && result) {
      mutate({ 
        topic, 
        explanationType: result.explanationType 
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
    <div className="min-h-screen bg-[#F9FAFB] text-foreground flex flex-col">
      <HeaderSection />
      
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Intro Section */}
          <section className="mb-8 text-center">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl mb-3 text-foreground">
              Simplify Complex Topics
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Enter any complex topic, and CurioPal will explain it in simple, easy-to-understand terms.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-2">
              <div className="flex items-center bg-purple-100 px-4 py-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Simple explanations</span>
              </div>
              <div className="flex items-center bg-pink-100 px-4 py-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
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
      </main>
      
      <FooterSection />
    </div>
  );
}
