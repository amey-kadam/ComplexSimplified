import { Github, Lock, FileText, Heart } from "lucide-react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t-2 border-yellow-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-8">
            <a href="#" className="text-orange-500 hover:text-red-500 transition-colors duration-300" aria-label="GitHub">
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-orange-500 hover:text-red-500 transition-colors duration-300" aria-label="Privacy">
              <span className="sr-only">Privacy</span>
              <Lock className="h-6 w-6" />
            </a>
            <a href="#" className="text-orange-500 hover:text-red-500 transition-colors duration-300" aria-label="Terms">
              <span className="sr-only">Terms</span>
              <FileText className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-6 text-center md:mt-0 flex items-center justify-center md:justify-end text-gray-600">
            <span>Made with</span> 
            <Heart className="h-4 w-4 mx-1 text-red-500 animate-pulse" /> 
            <span>&copy; {currentYear} CurioPal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
