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
          <p className="text-gray-600 max-w-md mx-auto mb-3 text-lg">
            {"We couldn't generate an explanation. This might be due to a temporary issue."}
          </p>
          {error?.message && error.message.includes("API key") && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
              <p className="font-bold">API Key Issue</p>
              <p>There appears to be an issue with the OpenAI API key. Please try again or contact support if the problem persists.</p>
            </div>
          )}
          <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm bg-gray-50 p-3 rounded">
            <strong>Technical details:</strong> {error?.message || "Unknown error"}
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
