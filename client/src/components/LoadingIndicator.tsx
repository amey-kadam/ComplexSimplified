import { Card, CardContent } from "@/components/ui/card";

export default function LoadingIndicator() {
  return (
    <Card className="mb-8">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 text-primary animate-bounce">
            <i className="fas fa-brain text-5xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">Simplifying your topic...</h3>
          <p className="text-gray-600 mb-4">Making it easy enough for a 5-year-old to understand.</p>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
