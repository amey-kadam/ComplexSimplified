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
    <Card className="bg-white rounded-xl shadow-lg p-3 mb-8 card-highlight">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
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
          </div>

          <div className="mb-8">
            <h3 className="block text-lg font-medium gradient-text mb-3">
              Choose explanation length:
            </h3>
            <div className="flex gap-4 flex-wrap">
              <label className="relative flex-1 min-w-[140px]">
                <input
                  type="radio"
                  name="explanationType"
                  value="short"
                  checked={explanationType === "short"}
                  onChange={() => setExplanationType("short")}
                  className="peer absolute opacity-0"
                />
                <div className="flex items-center justify-center p-4 border-2 rounded-lg peer-checked:border-yellow-400 peer-checked:bg-orange-50 peer-focus:ring-2 peer-focus:ring-orange-300 transition-all duration-300 cursor-pointer hover:shadow-md">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 mx-auto mb-2 text-orange-500"
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
                    <span className="block text-base font-medium">Short</span>
                    <span className="block text-sm text-gray-500">Quick summary</span>
                  </div>
                </div>
              </label>
              <label className="relative flex-1 min-w-[140px]">
                <input
                  type="radio"
                  name="explanationType"
                  value="long"
                  checked={explanationType === "long"}
                  onChange={() => setExplanationType("long")}
                  className="peer absolute opacity-0"
                />
                <div className="flex items-center justify-center p-4 border-2 rounded-lg peer-checked:border-yellow-400 peer-checked:bg-orange-50 peer-focus:ring-2 peer-focus:ring-orange-300 transition-all duration-300 cursor-pointer hover:shadow-md">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 mx-auto mb-2 text-orange-500"
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
                    <span className="block text-base font-medium">Long</span>
                    <span className="block text-sm text-gray-500">Detailed explanation</span>
                  </div>
                </div>
              </label>
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