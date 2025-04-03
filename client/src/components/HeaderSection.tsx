import { Zap } from "lucide-react";

export default function HeaderSection() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-heading font-bold text-xl sm:text-3xl gradient-text">
              CurioPal
            </h1>
          </div>
          <a href="#" className="text-sm font-medium px-4 py-2 rounded-full btn-bright">
            About
          </a>
        </div>
      </div>
    </header>
  );
}
