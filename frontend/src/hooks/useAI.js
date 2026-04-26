import { useEffect, useState } from "react";

import api from "../api/client";

export default function useAI(hours = 2) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get(`/ai/focus?hours=${hours}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, [hours]);

  return { data };
}