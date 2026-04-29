import { useEffect, useState } from "react";
import AIPanel from "./components/AIPanel";
import ActivityFeed from "./components/ActivityFeed";
import ProjectList from "./components/ProjectList";
import ProviderSetup from "./components/ProviderSetup";
import VoiceDump from "./components/VoiceDump";
import useAI from "./hooks/useAI";
import useProjects from "./hooks/useProjects";

export default function App() {
  const { items: projects, loading, error, connected } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [hours, setHours] = useState(2);
  const { data: aiData } = useAI(hours);

  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0];

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">AI dev operations brain</p>
          <h1>CodeEye</h1>
        </div>
        <ProviderSetup connected={connected} />
      </header>

      <main className="dashboard-grid">
        <ProjectList
          error={error}
          loading={loading}
          projects={projects}
          selectedProjectId={selectedProject?.id ?? ""}
          onSelectProject={setSelectedProjectId}
        />
        <div className="center-column">
          <ActivityFeed
            loading={loading}
            projects={projects}
            selectedProject={selectedProject}
          />
          <VoiceDump />
        </div>
        <AIPanel
          aiData={aiData}
          loading={loading}
          projects={projects}
          hours={hours}
          setHours={setHours}
        />
      </main>
    </div>
  );
}
