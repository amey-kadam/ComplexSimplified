import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function EmptyState() {
  return (
    <Card className="bg-white rounded-xl shadow-md p-6 mb-8 text-center card-highlight">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Lightbulb className="h-12 w-12 text-white animate-bounce-limited" />
          </div>
          <h3 className="text-xl font-bold gradient-text mb-3">Ready to Simplify!</h3>
          <p className="text-gray-600 max-w-md text-lg">
            Enter any complex topic above and we'll transform it into a child-friendly explanation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
