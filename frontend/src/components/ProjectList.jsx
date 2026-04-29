import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import HealthRing from "./ui/HealthRing";
import ProviderBadge from "./ui/ProviderBadge";
import StatusDot from "./ui/StatusDot";

export default function ProjectList({
  error,
  loading,
  projects,
  selectedProjectId,
  onSelectProject,
}) {
  return (
    <section className="panel project-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live projects</p>
          <h2>Priority Radar</h2>
        </div>
        <span className="count-pill">{projects.length}</span>
      </div>

      {loading ? (
        <div className="stack">
          <Skeleton
            count={4}
            height={92}
            baseColor="rgba(255,255,255,0.06)"
            highlightColor="rgba(255,255,255,0.11)"
            borderRadius={8}
          />
        </div>
      ) : error ? (
        <div className="empty-state">
          <strong>Could not load projects</strong>
          <p>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <strong>No connected projects yet</strong>
          <p>Connect GitHub to load your real repositories here.</p>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => {
            const selected = project.id === selectedProjectId;
            return (
              <button
                className={`project-card ${selected ? "is-selected" : ""}`}
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                type="button"
              >
                <div className="project-card-main">
                  <HealthRing score={project.health} />
                  <div className="project-copy">
                    <div className="project-title-row">
                      <h3>{project.name}</h3>
                      <ProviderBadge provider={project.provider} />
                    </div>
                    <p>{project.language}</p>
                    <StatusDot status={project.deployment.status} />
                  </div>
                </div>
                <div className="project-metrics">
                  <span>{project.lastCommit}</span>
                  <span>{project.openIssues} issues</span>
                  <span>{project.commits7d} commits</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
