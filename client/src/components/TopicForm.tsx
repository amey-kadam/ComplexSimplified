import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TopicFormProps {
  initialTopic?: string;
  onSubmit: (topic: string, explanationType: "short" | "long", options: TopicOptions) => void;
}

interface TopicOptions {
  includeFlashcards: boolean;
  includeFlowchart: boolean;
  includeIllustration: boolean;
}

export default function TopicForm({ initialTopic = "", onSubmit }: TopicFormProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [explanationType, setExplanationType] = useState<"short" | "long">("short");
  const [includeFlashcards, setIncludeFlashcards] = useState(true);
  const [includeFlowchart, setIncludeFlowchart] = useState(true);
  const [includeIllustration, setIncludeIllustration] = useState(true);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to explain",
        variant: "destructive",
      });
      return;
    }
    
    const options: TopicOptions = {
      includeFlashcards,
      includeFlowchart,
      includeIllustration
    };
    
    onSubmit(topic, explanationType, options);
  };

  return (
    <Card className="bg-yellow-300 rounded-xl shadow-lg p-3 mb-8 card-highlight">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="topic" className="block text-lg font-medium gradient-text mb-2">
              What topic would you like explained?
            </Label>
            <div className="relative">
              <Input
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Quantum physics, Climate change, Blockchain..."
                className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:border-orange-400 focus:ring-orange-300 text-lg"
                required
              />
            </div>
            
            <div className="flex gap-3 mt-2 justify-start">
              <label className="relative inline-block">
                <input
                  type="radio"
                  name="explanationType"
                  value="short"
                  checked={explanationType === "short"}
                  onChange={() => setExplanationType("short")}
                  className="peer absolute opacity-0"
                />
                <div className="flex items-center px-4 py-3 text-sm border-2 rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 text-white peer-checked:from-red-600 peer-checked:to-yellow-600 peer-checked:shadow-lg peer-checked:scale-105 peer-focus:ring-2 peer-focus:ring-red-300 transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.02] transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-white animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                  <div>
                    <span className="font-bold text-white text-base">Short</span>
                    <span className="block text-xs text-white">Quick summary</span>
                  </div>
                </div>
              </label>
              <label className="relative inline-block">
                <input
                  type="radio"
                  name="explanationType"
                  value="long"
                  checked={explanationType === "long"}
                  onChange={() => setExplanationType("long")}
                  className="peer absolute opacity-0"
                />
                <div className="flex items-center px-4 py-3 text-sm border-2 rounded-lg bg-gradient-to-r from-yellow-500 to-red-500 text-white peer-checked:from-yellow-600 peer-checked:to-red-600 peer-checked:shadow-lg peer-checked:scale-105 peer-focus:ring-2 peer-focus:ring-red-300 transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.02] transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-white animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <div>
                    <span className="font-bold text-white text-base">Long</span>
                    <span className="block text-xs text-white">Detailed explanation</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex flex-col space-y-3 mt-4">
              <h4 className="text-lg font-medium gradient-text mb-1">
                Include in Your Results:
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include-flashcards"
                  className="w-4 h-4 text-orange-500 border-2 border-yellow-300 rounded-sm focus:ring-orange-300"
                  checked={includeFlashcards}
                  onChange={(e) => setIncludeFlashcards(e.target.checked)}
                />
                <label htmlFor="include-flashcards" className="flex items-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="font-medium">Flashcards</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include-flowchart"
                  className="w-4 h-4 text-orange-500 border-2 border-yellow-300 rounded-sm focus:ring-orange-300"
                  checked={includeFlowchart}
                  onChange={(e) => setIncludeFlowchart(e.target.checked)}
                />
                <label htmlFor="include-flowchart" className="flex items-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                  <span className="font-medium">Flowchart</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="include-illustration"
                  className="w-4 h-4 text-orange-500 border-2 border-yellow-300 rounded-sm focus:ring-orange-300"
                  checked={includeIllustration}
                  onChange={(e) => setIncludeIllustration(e.target.checked)}
                />
                <label htmlFor="include-illustration" className="flex items-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">Illustration</span>
                </label>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-bright text-white font-medium py-7 text-lg rounded-xl"
          >
            Explain This Topic
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}