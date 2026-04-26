import AIPanel from "./components/AIPanel";
import ActivityFeed from "./components/ActivityFeed";
import ProjectList from "./components/ProjectList";
import ProviderSetup from "./components/ProviderSetup";
import VoiceDump from "./components/VoiceDump";

export default function App() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CodeEye</h1>
        <ProviderSetup />
      </header>
      <main className="grid gap-4 md:grid-cols-3">
        <ProjectList />
        <div className="space-y-4">
          <ActivityFeed />
          <VoiceDump />
        </div>
        <AIPanel />
      </main>
    </div>
  );
}
