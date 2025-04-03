import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onTryAgain: () => void;
}

export default function ErrorState({ error, onTryAgain }: ErrorStateProps) {
  return (
    <Card className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center card-highlight">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-md">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-red-500 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6 text-lg">
            {error?.message || "We couldn't generate an explanation. This might be due to high traffic or a temporary issue."}
          </p>
          <Button 
            onClick={onTryAgain} 
            className="inline-flex items-center px-6 py-3 border-2 border-yellow-300 text-base font-medium rounded-xl text-white btn-bright hover:shadow-lg"
          >
            <RefreshCcw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
