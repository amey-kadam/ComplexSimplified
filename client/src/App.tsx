import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Layout from "@/components/Layout";

// Create stub pages for our sidebar navigation
const DiscoverPage = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Discover</h1>
    <p className="text-lg text-gray-700">
      Explore new and interesting topics to learn about.
      This page is under construction.
    </p>
  </div>
);

const LibraryPage = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold mb-6">Your Library</h1>
    <p className="text-lg text-gray-700">
      Access your saved explanations and favorite topics.
      This page is under construction.
    </p>
  </div>
);

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/discover" component={DiscoverPage} />
        <Route path="/library" component={LibraryPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
