import { Zap } from "lucide-react";

export default function HeaderSection() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
              Explain Like I'm Five
            </h1>
          </div>
          <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition">
            About
          </a>
        </div>
      </div>
    </header>
  );
}
