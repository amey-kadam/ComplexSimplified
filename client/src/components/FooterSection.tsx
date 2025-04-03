import { Github, Lock, FileText } from "lucide-react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-600" aria-label="GitHub">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600" aria-label="Privacy">
              <span className="sr-only">Privacy</span>
              <Lock className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-600" aria-label="Terms">
              <span className="sr-only">Terms</span>
              <FileText className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 md:mt-0">
            &copy; {currentYear} Explain Like I'm Five. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
