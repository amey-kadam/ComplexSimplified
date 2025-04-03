import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import RelatedTopics from "./RelatedTopics";
import { ExplanationType } from "@/pages/Home";

interface ExplanationResultProps {
  topic: string;
  explanation: string;
  explanationType: ExplanationType;
  relatedTopics: { title: string; description: string }[];
  onNewTopic: () => void;
}

export default function ExplanationResult({
  topic,
  explanation,
  explanationType,
  relatedTopics,
  onNewTopic
}: ExplanationResultProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(explanation);
      toast({
        title: "Copied!",
        description: "Explanation copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <section>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-primary text-lg">
                <i className="fas fa-child"></i>
              </span>
              <h3 className="text-lg font-semibold">
                {explanationType === "short" ? "Short Explanation" : "Detailed Explanation"}
              </h3>
            </div>
            <span className="text-xs text-gray-500">For a 5-year-old</span>
          </div>
          
          <div className="prose max-w-none">
            {explanation.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 text-lg leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleCopy}
            >
              <i className="fas fa-copy"></i>
              <span>Copy Explanation</span>
            </Button>
            
            <Button
              className="flex-1 gap-2"
              onClick={onNewTopic}
            >
              <i className="fas fa-plus"></i>
              <span>New Topic</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {relatedTopics.length > 0 && (
        <RelatedTopics topics={relatedTopics} />
      )}
    </section>
  );
}
