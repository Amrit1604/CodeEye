import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AIPanel({ aiData, loading, projects, hours, setHours }) {
  const weakest = [...projects].sort((a, b) => a.health - b.health).slice(0, 3);
  const focusText =
    aiData?.focus_plan ??
    "Connect GitHub first. CodeEye will rank your repositories once real activity is available.";
  const alerts = aiData?.critical_alerts ?? [];

  return (
    <section className="panel ai-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">AI reasoning</p>
          <h2>Daily Focus</h2>
        </div>
        <label className="hours-control">
          <span>{hours}h</span>
          <input
            aria-label="Available hours"
            max="6"
            min="1"
            onChange={(event) => setHours(Number(event.target.value))}
            type="range"
            value={hours}
          />
        </label>
      </div>

      {loading ? (
        <div className="stack">
          <Skeleton
            height={96}
            baseColor="rgba(255,255,255,0.06)"
            highlightColor="rgba(255,255,255,0.11)"
            borderRadius={8}
          />
          <Skeleton
            count={3}
            height={70}
            baseColor="rgba(255,255,255,0.06)"
            highlightColor="rgba(255,255,255,0.11)"
            borderRadius={8}
          />
        </div>
      ) : (
        <>
          <div className="ai-summary">
            <div>
              <span className="alert-number">{weakest.length}</span>
              <p>tracked repos</p>
            </div>
            <p>{focusText}</p>
          </div>

          {weakest.length === 0 ? (
            <div className="empty-state">
              <strong>No AI priority list yet</strong>
              <p>Real GitHub repositories are required before CodeEye can rank work.</p>
            </div>
          ) : (
            <div className="focus-list">
              {weakest.map((project, index) => (
                <article className="focus-item" key={project.id}>
                  <span className={`rank-dot ${project.health < 50 ? "critical" : "high"}`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="focus-meta">
                      <strong>{project.name}</strong>
                      <span>{project.health}/100</span>
                    </div>
                    <p>
                      Review this repository first. It has {project.openIssues} open
                      issues and last activity was {project.lastCommit}.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {alerts.length > 0 && (
            <div className="alert-list">
              {alerts.map((alert) => (
                <p className="alert-row" key={alert}>
                  {alert}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
