import { useEffect, useState } from "react";
import AIPanel from "./components/AIPanel";
import ActivityFeed from "./components/ActivityFeed";
import ProjectList from "./components/ProjectList";
import ProviderSetup from "./components/ProviderSetup";
import VoiceDump from "./components/VoiceDump";
import { activityFeed, focusPlan, projects } from "./data/mock";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[1].id);
  const [hours, setHours] = useState(2);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0];

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">AI dev operations brain</p>
          <h1>CodeEye</h1>
        </div>
        <ProviderSetup />
      </header>

      <main className="dashboard-grid">
        <ProjectList
          loading={loading}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
        <div className="center-column">
          <ActivityFeed
            loading={loading}
            activities={activityFeed}
            selectedProject={selectedProject}
          />
          <VoiceDump />
        </div>
        <AIPanel
          loading={loading}
          focusPlan={focusPlan}
          projects={projects}
          hours={hours}
          setHours={setHours}
        />
      </main>
    </div>
  );
}
