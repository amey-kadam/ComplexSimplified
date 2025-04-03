import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, RefreshCcw, Info, Sparkles, Book, PenTool, ArrowRight, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { ExplanationResponse, Flashcard } from "@shared/schema";

interface ExplanationResultProps {
  result: ExplanationResponse;
  onTryAgain: () => void;
}

export default function ExplanationResult({ result, onTryAgain }: ExplanationResultProps) {
  const { toast } = useToast();
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);

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

  const nextFlashcard = () => {
    if (result.flashcards && activeFlashcardIndex < result.flashcards.length - 1) {
      setActiveFlashcardIndex(activeFlashcardIndex + 1);
      setShowFlashcardAnswer(false);
    }
  };

  const prevFlashcard = () => {
    if (activeFlashcardIndex > 0) {
      setActiveFlashcardIndex(activeFlashcardIndex - 1);
      setShowFlashcardAnswer(false);
    }
  };

  const toggleFlashcardAnswer = () => {
    setShowFlashcardAnswer(!showFlashcardAnswer);
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
    
  // Format flowchart with line breaks
  const formattedFlowchart = result.flowchart
    ? result.flowchart
        .split("\n")
        .filter(line => line.trim() !== "")
        .map((line, idx) => {
          // Add arrow icons to lines with arrows
          const formattedLine = line.includes("->")
            ? line.replace(/->/g, ' <span class="inline-block mx-1">➡️</span> ')
            : line;
            
          return (
            <p key={idx} className="text-gray-700 text-lg mb-3 last:mb-0 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
            </p>
          );
        })
    : [<p key="no-flowchart" className="text-gray-700 text-lg">No flowchart available.</p>];

  return (
    <Card className="bg-blue-400 rounded-xl shadow-lg mb-8 card-highlight overflow-hidden">
      <div className="border-b-2 border-blue-600 px-6 py-5 bg-blue-500">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-700 text-white mb-2">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Simplified
            </span>
            <h3 className="text-xl font-bold gradient-text">{result.topic}</h3>
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-300 text-blue-900 border-2 border-blue-500">
            {result.explanationType.charAt(0).toUpperCase() + result.explanationType.slice(1)} Explanation
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="explanation" className="mb-4">
          <TabsList className="grid w-full grid-cols-4 bg-blue-300">
            <TabsTrigger value="explanation" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Explanation
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white">
              <Book className="h-4 w-4 mr-2" />
              Flashcards
            </TabsTrigger>
            <TabsTrigger value="flowchart" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white">
              <ArrowRight className="h-4 w-4 mr-2" />
              Flowchart
            </TabsTrigger>
            <TabsTrigger value="illustration" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white">
              <ImageIcon className="h-4 w-4 mr-2" />
              Illustration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explanation" className="mt-5">
            <div className="bg-blue-400 rounded-xl shadow-md p-6 border-2 border-blue-600">
              <h3 className="text-xl font-bold mb-4 gradient-text">Explanation</h3>
              <div className="prose prose-lg max-w-none">
                {formattedExplanation}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="flashcards" className="mt-5">
            {result.flashcards && result.flashcards.length > 0 ? (
              <div className="flex flex-col">
                <div className="bg-blue-400 rounded-xl shadow-md p-6 min-h-[200px] border-2 border-blue-600 flex flex-col justify-between">
                  <div className="text-center mb-5">
                    <span className="text-sm text-gray-600 mb-2 block">
                      Flashcard {activeFlashcardIndex + 1} of {result.flashcards.length}
                    </span>
                    <h3 className="text-xl font-bold mb-6">{result.flashcards[activeFlashcardIndex].question}</h3>
                    
                    {showFlashcardAnswer ? (
                      <div className="bg-blue-300 p-4 rounded-lg border border-blue-500 text-lg">
                        {result.flashcards[activeFlashcardIndex].answer}
                      </div>
                    ) : (
                      <Button 
                        onClick={toggleFlashcardAnswer}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold border-2 border-blue-700 shadow-md rounded-md transition-all duration-300"
                      >
                        Show Answer
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline" 
                      onClick={prevFlashcard} 
                      disabled={activeFlashcardIndex === 0}
                      className="border-2 border-blue-500 text-gray-700 hover:bg-blue-300"
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={nextFlashcard} 
                      disabled={activeFlashcardIndex === result.flashcards.length - 1}
                      className="border-2 border-blue-500 text-gray-700 hover:bg-blue-300"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-blue-300 rounded-lg border-2 border-blue-500">
                <PenTool className="h-12 w-12 mx-auto text-blue-700 mb-3" />
                <p className="text-gray-700 font-semibold">No flashcards available for this topic.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="flowchart" className="mt-5">
            <div className="bg-blue-400 rounded-xl shadow-md p-6 border-2 border-blue-600">
              <h3 className="text-xl font-bold mb-4 gradient-text">Learning Flowchart</h3>
              <div className="prose prose-lg max-w-none">
                {formattedFlowchart}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="illustration" className="mt-5">
            <div className="bg-blue-400 rounded-xl shadow-md p-6 border-2 border-blue-600">
              <h3 className="text-xl font-bold mb-4 gradient-text">Visual Illustration</h3>
              {result.illustration ? (
                <div className="flex justify-center">
                  <div className="rounded-lg overflow-hidden shadow-lg border-4 border-blue-600">
                    <img 
                      src={`data:image/jpeg;base64,${result.illustration}`} 
                      alt={`Illustration of ${result.topic}`}
                      className="max-w-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-blue-300 rounded-lg border-2 border-blue-500">
                  <ImageIcon className="h-12 w-12 mx-auto text-blue-700 mb-3" />
                  <p className="text-gray-700 font-semibold">No illustration available for this topic.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-blue-500 px-6 py-5 rounded-b-xl border-t-2 border-blue-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full gradient-bg flex items-center justify-center shadow-md">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3 text-base text-white">Explanation generated using AI</div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="inline-flex items-center text-white border-2 border-blue-300 hover:bg-blue-600 px-4 py-2 h-auto"
            >
              <ClipboardCopy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onTryAgain}
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold border-2 border-blue-300 px-4 py-2 h-auto shadow-md rounded-md"
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
