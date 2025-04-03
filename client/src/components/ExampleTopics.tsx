import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, 
  Bitcoin, 
  Cpu, 
  Heart 
} from "lucide-react";

interface ExampleTopic {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface ExampleTopicsProps {
  onSelectTopic: (topic: string) => void;
}

export default function ExampleTopics({ onSelectTopic }: ExampleTopicsProps) {
  const { data: exampleTopics } = useQuery({
    queryKey: ["/api/example-topics"],
    staleTime: Infinity, // Example topics shouldn't change frequently
  });

  // Fallback topics if API fails or is slow
  const fallbackTopics: ExampleTopic[] = [
    { id: 1, name: "Climate Change", description: "What's happening to our planet?", icon: "ClimateIcon" },
    { id: 2, name: "Blockchain", description: "How does cryptocurrency work?", icon: "BlockchainIcon" },
    { id: 3, name: "Artificial Intelligence", description: "How do computers learn?", icon: "AIIcon" },
    { id: 4, name: "How Emotions Work", description: "Why do we feel different ways?", icon: "EmotionsIcon" }
  ];

  const topics = exampleTopics || fallbackTopics;
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ClimateIcon":
        return <FlaskConical className="h-5 w-5" />;
      case "BlockchainIcon":
        return <Bitcoin className="h-5 w-5" />;
      case "AIIcon":
        return <Cpu className="h-5 w-5" />;
      case "EmotionsIcon":
        return <Heart className="h-5 w-5" />;
      default:
        return <FlaskConical className="h-5 w-5" />;
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-md p-6 mb-8">
      <CardContent className="p-0">
        <h3 className="font-heading font-semibold text-lg mb-4">Example Topics</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
          {topics.map((topic) => (
            <Button
              key={topic.id}
              variant="outline"
              className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left h-auto"
              onClick={() => onSelectTopic(topic.name)}
            >
              <span className="w-10 h-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center text-primary">
                {getIcon(topic.icon)}
              </span>
              <div>
                <span className="block font-medium text-gray-900">{topic.name}</span>
                <span className="block text-sm text-gray-500">{topic.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
