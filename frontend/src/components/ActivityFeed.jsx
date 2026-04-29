import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ActivityFeed({ loading, projects, selectedProject }) {
  const recentProjects = [...projects]
    .sort((a, b) => b.health - a.health)
    .slice(0, 5);

  return (
    <section className="panel activity-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Backend data</p>
          <h2>Repository Signals</h2>
        </div>
        <span className="status-chip">{selectedProject?.name ?? "No project"}</span>
      </div>

      {loading ? (
        <Skeleton
          count={5}
          height={54}
          baseColor="rgba(255,255,255,0.06)"
          highlightColor="rgba(255,255,255,0.11)"
          borderRadius={8}
        />
      ) : recentProjects.length === 0 ? (
        <div className="empty-state">
          <strong>No repository signals yet</strong>
          <p>After GitHub connects, repo recency and issue pressure appear here.</p>
        </div>
      ) : (
        <div className="activity-list">
          {recentProjects.map((project) => (
            <article className="activity-item" key={project.id}>
              <span className="activity-icon">{project.health}</span>
              <div>
                <div className="activity-meta">
                  <strong>{project.name}</strong>
                  <span>{project.lastCommit}</span>
                </div>
                <p>
                  {project.openIssues} open issues. Health score is calculated from
                  GitHub activity and issue pressure.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
