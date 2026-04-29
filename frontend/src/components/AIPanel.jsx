import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fullAiText } from "../data/mock";

const urgencyClass = {
  critical: "critical",
  high: "high",
  low: "low",
};

export default function AIPanel({ loading, focusPlan, projects, hours, setHours }) {
  const criticalCount = projects.filter((project) => project.health < 50).length;

  return (
    <section className="panel ai-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Groq reasoning</p>
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
              <span className="alert-number">{criticalCount}</span>
              <p>critical project</p>
            </div>
            <p>{fullAiText}</p>
          </div>

          <div className="focus-list">
            {focusPlan.map((item) => (
              <article className="focus-item" key={item.rank}>
                <span className={`rank-dot ${urgencyClass[item.urgency]}`}>
                  {item.rank}
                </span>
                <div>
                  <div className="focus-meta">
                    <strong>{item.project}</strong>
                    <span>{item.minutes ? `${item.minutes} min` : "skip"}</span>
                  </div>
                  <p>{item.action}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="health-bars">
            {projects.map((project) => (
              <div className="health-row" key={project.id}>
                <span>{project.name}</span>
                <div>
                  <i style={{ width: `${project.health}%` }} />
                </div>
                <strong>{project.health}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
