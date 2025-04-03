import React from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-yellow-300">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64 p-4">
        {children}
      </main>
    </div>
  );
}