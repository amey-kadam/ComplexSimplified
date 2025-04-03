import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="text-red-500 h-5 w-5" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Something went wrong
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message || "We couldn't generate an explanation. Please try again or check your internet connection."}</p>
          </div>
          <div className="mt-4">
            <Button 
              variant="destructive"
              onClick={onRetry}
              className="bg-red-100 hover:bg-red-200 text-red-800"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
