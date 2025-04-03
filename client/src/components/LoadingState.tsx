import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <Card className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center card-highlight">
      <CardContent className="p-0">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-20 h-20 border-4 border-yellow-300 border-t-orange-500 rounded-full animate-spin mb-6 shadow-md"></div>
          <h3 className="text-xl font-bold gradient-text mb-3">Simplifying this topic...</h3>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            We're breaking down this complex topic into something a five-year-old would understand.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
