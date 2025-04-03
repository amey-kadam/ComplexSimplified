import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, RefreshCcw, Info, Sparkles } from "lucide-react";
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
      <p key={idx} className="text-gray-700 text-lg mb-4 last:mb-0 leading-relaxed">
        {paragraph}
      </p>
    ));

  return (
    <Card className="bg-white rounded-xl shadow-lg mb-8 card-highlight overflow-hidden">
      <div className="border-b-2 border-yellow-300 px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Simplified
            </span>
            <h3 className="text-xl font-bold gradient-text">{result.topic}</h3>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
            {result.explanationType.charAt(0).toUpperCase() + result.explanationType.slice(1)} Explanation
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="prose prose-lg max-w-none">
          {formattedExplanation}
        </div>
      </div>

      <div className="bg-orange-50 px-6 py-5 rounded-b-xl border-t-2 border-yellow-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full gradient-bg flex items-center justify-center shadow-md">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 text-base text-gray-700">Explanation generated using AI</div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="inline-flex items-center text-gray-700 border-2 border-yellow-300 hover:bg-yellow-50 px-4 py-2 h-auto"
            >
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onTryAgain}
              className="inline-flex items-center btn-bright border-transparent px-4 py-2 h-auto"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
