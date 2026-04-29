export default function ProviderBadge({ provider }) {
  const map = { 
    github: { label: "GH", color: "#58A6FF" }, 
    gitlab: { label: "GL", color: "#FC6D26" }, 
    url: { label: "URL", color: "#A78BFA" } 
  };
  const p = map[provider];
  if (!p) return null;
  return (
    <span style={{ 
      fontSize: 9, fontWeight: 700, color: p.color, 
      background: `${p.color}18`, border: `1px solid ${p.color}30`, 
      borderRadius: 4, padding: "1px 5px", fontFamily: "monospace", letterSpacing: "0.05em" 
    }}>
      {p.label}
    </span>
  );
}
