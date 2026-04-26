import { useEffect, useState } from "react";

import api from "../api/client";

export default function useProjects() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/projects").then((res) => setItems(res.data.items ?? [])).catch(() => setItems([]));
  }, []);

  return { items };
}