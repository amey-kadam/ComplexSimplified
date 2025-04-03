import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <Card className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Simplifying this topic...</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We're breaking down this complex topic into something a five-year-old would understand.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
