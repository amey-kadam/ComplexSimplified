import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function EmptyState() {
  return (
    <Card className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="h-12 w-12 text-primary animate-bounce-limited" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to simplify!</h3>
          <p className="text-gray-500 max-w-md">
            Enter any complex topic above and we'll transform it into a child-friendly explanation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
