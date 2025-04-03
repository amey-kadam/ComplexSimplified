import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, RefreshCcw, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ExplanationResponse } from "@shared/schema";

interface ExplanationResultProps {
  result: ExplanationResponse;
  onTryAgain: () => void;
}

export default function ExplanationResult({ result, onTryAgain }: ExplanationResultProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(result.explanation).then(
      () => {
        toast({
          title: "Copied!",
          description: "Explanation copied to clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  // Format explanation with paragraph breaks
  const formattedExplanation = result.explanation
    .split("\n")
    .filter(paragraph => paragraph.trim() !== "")
    .map((paragraph, idx) => (
      <p key={idx} className="text-gray-700 mb-3 last:mb-0">
        {paragraph}
      </p>
    ));

  return (
    <Card className="bg-white rounded-xl shadow-md mb-8">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-1">
              Simplified
            </span>
            <h3 className="text-lg font-medium text-gray-900">{result.topic}</h3>
          </div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {result.explanationType.charAt(0).toUpperCase() + result.explanationType.slice(1)} Explanation
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="prose prose-primary max-w-none">
          {formattedExplanation}
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="h-4 w-4 text-primary" />
            </div>
            <div className="ml-2 text-sm text-gray-500">Explanation generated using AI</div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="inline-flex items-center text-gray-700"
            >
              <ClipboardCopy className="h-4 w-4 mr-1.5" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onTryAgain}
              className="inline-flex items-center text-primary bg-primary/10 hover:bg-primary/20 border-transparent"
            >
              <RefreshCcw className="h-4 w-4 mr-1.5" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
