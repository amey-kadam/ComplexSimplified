import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, 
  Bitcoin, 
  Cpu, 
  Heart,
  Sparkles
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
  // Use default fallback topics
  const fallbackTopics: ExampleTopic[] = [
    { id: 1, name: "Climate Change", description: "What's happening to our planet?", icon: "ClimateIcon" },
    { id: 2, name: "Blockchain", description: "How does cryptocurrency work?", icon: "BlockchainIcon" },
    { id: 3, name: "Artificial Intelligence", description: "How do computers learn?", icon: "AIIcon" },
    { id: 4, name: "How Emotions Work", description: "Why do we feel different ways?", icon: "EmotionsIcon" }
  ];

  // Use hook for API data but provide default value of fallback topics
  const { data: topics = fallbackTopics } = useQuery<ExampleTopic[]>({
    queryKey: ["/api/example-topics"],
    staleTime: Infinity, // Example topics shouldn't change frequently
  });
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ClimateIcon":
        return <FlaskConical className="h-6 w-6" />;
      case "BlockchainIcon":
        return <Bitcoin className="h-6 w-6" />;
      case "AIIcon":
        return <Cpu className="h-6 w-6" />;
      case "EmotionsIcon":
        return <Heart className="h-6 w-6" />;
      default:
        return <FlaskConical className="h-6 w-6" />;
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg p-6 mb-8 card-highlight">
      <CardContent className="p-0">
        <div className="flex items-center mb-5">
          <Sparkles className="h-6 w-6 text-orange-500 mr-2" />
          <h3 className="font-heading font-bold text-xl gradient-text">Trending Topics</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          {topics.map((topic: ExampleTopic) => (
            <Button
              key={topic.id}
              variant="outline"
              className="flex items-center space-x-3 p-4 border-2 border-orange-100 rounded-xl hover:bg-orange-50 hover:border-yellow-300 transition-all duration-300 text-left h-auto shadow-sm hover:shadow-md"
              onClick={() => onSelectTopic(topic.name)}
            >
              <span className="w-12 h-12 flex-shrink-0 rounded-full gradient-bg flex items-center justify-center text-white shadow-md">
                {getIcon(topic.icon)}
              </span>
              <div>
                <span className="block font-bold text-gray-900 text-lg">{topic.name}</span>
                <span className="block text-gray-600">{topic.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
