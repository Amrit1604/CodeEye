import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const activityLabels = {
  alert: "!",
  commit: "<>",
  issue: "#",
};

export default function ActivityFeed({ loading, activities, selectedProject }) {
  return (
    <section className="panel activity-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Normalized events</p>
          <h2>Activity Feed</h2>
        </div>
        <span className="status-chip">{selectedProject.name}</span>
      </div>

      {loading ? (
        <Skeleton
          count={5}
          height={54}
          baseColor="rgba(255,255,255,0.06)"
          highlightColor="rgba(255,255,255,0.11)"
          borderRadius={8}
        />
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <article className={`activity-item type-${activity.type}`} key={activity.id}>
              <span className="activity-icon">{activityLabels[activity.type] ?? "*"}</span>
              <div>
                <div className="activity-meta">
                  <strong>{activity.project}</strong>
                  <span>{activity.time}</span>
                </div>
                <p>{activity.message}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
