import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Discover", path: "/discover", icon: "🔍" },
    { name: "Library", path: "/library", icon: "📚" },
  ];

  return (
    <div className="h-screen w-16 md:w-64 flex flex-col bg-gradient-to-b from-orange-50 to-yellow-50 border-r shadow-sm fixed left-0 top-0 z-10">
      <div className="p-4 flex justify-center md:justify-start items-center">
        <span className="hidden md:inline-block text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
          CurioPal
        </span>
        <span className="md:hidden text-2xl font-bold">🧠</span>
      </div>
      
      <nav className="flex-1 pt-8">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <li key={item.name}>
                <Link href={item.path}>
                  <div
                    className={cn(
                      "flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-yellow-100 group cursor-pointer",
                      isActive ? "bg-yellow-300 text-gray-800" : "text-gray-700 hover:text-gray-800"
                    )}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="hidden md:inline-block font-medium">
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 ml-auto hidden md:block"></div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 hidden md:block">
        <div className="p-3 bg-yellow-100 rounded-lg">
          <p className="text-sm text-gray-700">
            Need help? Contact support@curiopal.com
          </p>
        </div>
      </div>
    </div>
  );
}