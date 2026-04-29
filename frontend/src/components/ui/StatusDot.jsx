export default function StatusDot({ status }) {
  const colors = { healthy: "#00E5A0", slow: "#F5A623", down: "#FF4757" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%", background: colors[status],
        boxShadow: `0 0 6px ${colors[status]}`,
        animation: status === "down" ? "pulse-red 1.2s infinite" : status === "slow" ? "pulse-amber 2s infinite" : "none"
      }} />
      <span style={{ fontSize: 11, color: colors[status], fontWeight: 500, textTransform: "capitalize", fontFamily: "monospace" }}>{status}</span>
    </span>
  );
}
