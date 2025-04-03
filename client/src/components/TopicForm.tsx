import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ExplanationType } from "@/pages/Home";

interface TopicFormProps {
  onSubmit: (topic: string, type: ExplanationType) => void;
  isLoading: boolean;
  initialTopic: string;
}

export default function TopicForm({ onSubmit, isLoading, initialTopic }: TopicFormProps) {
  const [topic, setTopic] = useState(initialTopic);
  const [explanationType, setExplanationType] = useState<ExplanationType>("short");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic, explanationType);
    }
  };

  const toggleExplanationType = (type: ExplanationType) => {
    setExplanationType(type);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              What topic would you like explained?
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Quantum Physics, Blockchain, Climate Change..."
              className="w-full px-4 py-3 rounded-lg"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like it explained?
            </Label>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-1">
              <Button
                type="button"
                variant={explanationType === "short" ? "default" : "outline"}
                className={`flex-1 gap-2 ${explanationType === "short" ? "bg-primary text-white" : ""}`}
                onClick={() => toggleExplanationType("short")}
                disabled={isLoading}
              >
                <i className="fas fa-clock text-lg"></i>
                <span className="font-medium">Short Explanation</span>
              </Button>
              
              <Button
                type="button"
                variant={explanationType === "long" ? "default" : "outline"}
                className={`flex-1 gap-2 ${explanationType === "long" ? "bg-primary text-white" : ""}`}
                onClick={() => toggleExplanationType("long")}
                disabled={isLoading}
              >
                <i className="fas fa-book-open text-lg"></i>
                <span className="font-medium">Detailed Explanation</span>
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              {explanationType === "short" 
                ? "Short explanation provides a brief 1-2 sentence overview."
                : "Detailed explanation breaks down the topic with examples a child would understand."}
            </p>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-3 px-4"
            disabled={isLoading || !topic.trim()}
          >
            Explain This Simply
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
