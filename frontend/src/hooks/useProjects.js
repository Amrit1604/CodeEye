import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

const DAY_MS = 24 * 60 * 60 * 1000;

function readOAuthTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (params.get("provider") === "github" && token) {
    window.localStorage.setItem("codeeye.githubToken", token);
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }

  return window.localStorage.getItem("codeeye.githubToken");
}

function recencyLabel(value) {
  if (!value) return "No activity yet";

  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / DAY_MS));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function scoreProject(project) {
  if (!project.last_activity_at) return 30;

  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(project.last_activity_at).getTime()) / DAY_MS)
  );
  const recency = days <= 2 ? 40 : days <= 7 ? 25 : days <= 14 ? 10 : 0;
  const issueCount = project.open_issues_count ?? 0;
  const issues = issueCount === 0 ? 30 : issueCount <= 3 ? 20 : issueCount <= 7 ? 10 : 0;

  return recency + issues + 20;
}

function normalizeProject(project) {
  const health = scoreProject(project);

  return {
    id: project.id ?? project.provider_id,
    name: project.name,
    provider: project.provider ?? project.provider_type ?? "github",
    health,
    lastCommit: recencyLabel(project.last_activity_at),
    openIssues: project.open_issues_count ?? 0,
    deployment: { status: "unknown", responseTime: null },
    language: project.url ? new URL(project.url).hostname : "Repository",
    commits7d: 0,
    url: project.url,
  };
}

export default function useProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(readOAuthTokenFromUrl() ?? "");
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const endpoint = token ? "/providers/github/projects" : "/projects";
        const response = await api.get(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!ignore) {
          setItems((response.data.items ?? []).map(normalizeProject));
        }
      } catch (err) {
        if (!ignore) {
          setItems([]);
          const status = err.response?.status;
          if (status === 401) {
            window.localStorage.removeItem("codeeye.githubToken");
          }

          const apiDetail = err.response?.data?.detail;
          const authMessage =
            status === 401 ? "GitHub connection expired. Reconnect GitHub." : "";
          const networkMessage = err.request
            ? "Could not reach the backend API. Check that FastAPI is running on port 8000."
            : "";

          setError(
            apiDetail ||
              authMessage ||
              networkMessage ||
              "Could not load projects from the backend."
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      ignore = true;
    };
  }, [token]);

  return useMemo(
    () => ({ items, loading, error, connected: Boolean(token) }),
    [items, loading, error, token]
  );
}
