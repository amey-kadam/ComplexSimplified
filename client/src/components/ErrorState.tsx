import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onTryAgain: () => void;
}

export default function ErrorState({ error, onTryAgain }: ErrorStateProps) {
  return (
    <Card className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            {error?.message || "We couldn't generate an explanation. This might be due to high traffic or a temporary issue."}
          </p>
          <Button 
            onClick={onTryAgain} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            <RefreshCcw className="h-4 w-4 mr-1.5" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
