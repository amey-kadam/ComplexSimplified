import { Card, CardContent } from "@/components/ui/card";

interface RelatedTopicsProps {
  topics: { title: string; description: string }[];
}

export default function RelatedTopics({ topics }: RelatedTopicsProps) {
  if (!topics || topics.length === 0) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((topic, index) => (
            <div 
              key={index} 
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              onClick={() => {
                // In a more advanced version, this could redirect to a new explanation
                // with the related topic. For now, it's just interactive UI.
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <h4 className="font-medium mb-1">{topic.title}</h4>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
