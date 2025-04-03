import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TopicFormProps {
  initialTopic?: string;
  onSubmit: (topic: string, explanationType: "short" | "long") => void;
}

export default function TopicForm({ initialTopic = "", onSubmit }: TopicFormProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [explanationType, setExplanationType] = useState<"short" | "long">("short");
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
    
    onSubmit(topic, explanationType);
  };

  return (
    <Card className="bg-white rounded-xl shadow-md p-2 mb-8">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <Label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              What topic would you like explained?
            </Label>
            <div className="relative">
              <Input
                id="topic"
                name="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Quantum physics, Climate change, Blockchain..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="block text-sm font-medium text-gray-700 mb-2">
              Choose explanation length:
            </h3>
            <div className="flex gap-3 flex-wrap">
              <label className="relative flex-1 min-w-[120px]">
                <input
                  type="radio"
                  name="explanationType"
                  value="short"
                  checked={explanationType === "short"}
                  onChange={() => setExplanationType("short")}
                  className="peer absolute opacity-0"
                />
                <div className="flex items-center justify-center p-3 border-2 rounded-lg peer-checked:border-primary peer-checked:bg-primary/5 peer-focus:ring-2 peer-focus:ring-primary/30 transition cursor-pointer">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mx-auto mb-1 text-primary"
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
                    <span className="block text-sm font-medium">Short</span>
                    <span className="block text-xs text-gray-500">Quick summary</span>
                  </div>
                </div>
              </label>
              <label className="relative flex-1 min-w-[120px]">
                <input
                  type="radio"
                  name="explanationType"
                  value="long"
                  checked={explanationType === "long"}
                  onChange={() => setExplanationType("long")}
                  className="peer absolute opacity-0"
                />
                <div className="flex items-center justify-center p-3 border-2 rounded-lg peer-checked:border-primary peer-checked:bg-primary/5 peer-focus:ring-2 peer-focus:ring-primary/30 transition cursor-pointer">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mx-auto mb-1 text-primary"
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
                    <span className="block text-sm font-medium">Long</span>
                    <span className="block text-xs text-gray-500">Detailed explanation</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6"
          >
            Explain This Topic
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
