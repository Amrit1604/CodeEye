export const projects = [
  {
    id: 1,
    name: "Jobie",
    provider: "github",
    health: 62,
    lastCommit: "5 days ago",
    openIssues: 3,
    deployment: { url: "jobie.railway.app", status: "slow", responseTime: 2340 },
    language: "TypeScript",
    commits7d: 2,
  },
  {
    id: 2,
    name: "InsureInfo",
    provider: "gitlab",
    health: 21,
    lastCommit: "8 days ago",
    openIssues: 1,
    deployment: { url: "insureinfo.vercel.app", status: "down", responseTime: null },
    language: "Python",
    commits7d: 0,
  },
  {
    id: 3,
    name: "UConnect",
    provider: "github",
    health: 91,
    lastCommit: "2 days ago",
    openIssues: 0,
    deployment: { url: "uconnect.up.railway.app", status: "healthy", responseTime: 340 },
    language: "JavaScript",
    commits7d: 7,
  },
  {
    id: 4,
    name: "PotionMaster",
    provider: "url",
    health: 78,
    lastCommit: "3 days ago",
    openIssues: 2,
    deployment: { url: "potionmaster.onrender.com", status: "healthy", responseTime: 810 },
    language: "Java",
    commits7d: 4,
  },
];

export const activityFeed = [
  {
    id: 1,
    project: "UConnect",
    type: "commit",
    message: "fix: resolve socket disconnect on mobile",
    time: "2h ago",
  },
  {
    id: 2,
    project: "Jobie",
    type: "issue",
    message: "Issue #12 opened: JWT token expiry not handled",
    time: "5h ago",
  },
  {
    id: 3,
    project: "InsureInfo",
    type: "alert",
    message: "Health check failed: 503 Service Unavailable",
    time: "6h ago",
  },
  {
    id: 4,
    project: "PotionMaster",
    type: "commit",
    message: "feat: add potion crafting inventory system",
    time: "1d ago",
  },
  {
    id: 5,
    project: "Jobie",
    type: "commit",
    message: "refactor: clean up auth middleware",
    time: "5d ago",
  },
];

export const focusPlan = [
  {
    rank: 1,
    project: "InsureInfo",
    action: "Check deployment logs. The app has returned 503 for 6 hours.",
    minutes: 30,
    urgency: "critical",
  },
  {
    rank: 2,
    project: "Jobie",
    action: "Fix JWT token expiry bug from issue #12 before more auth work.",
    minutes: 45,
    urgency: "high",
  },
  {
    rank: 3,
    project: "UConnect",
    action: "Healthy. Skip today unless you have extra time.",
    minutes: 0,
    urgency: "low",
  },
];

export const fullAiText =
  "InsureInfo is returning 503 errors and has no commits in 8 days. Start there, then move to Jobie's JWT expiry issue. UConnect is healthy, so leave it alone today.";
