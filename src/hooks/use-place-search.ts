import { useEffect, useState } from "react";
import { searchPlaces } from "../lib/grabmaps-client";
import type { GrabCategory, GrabPlace } from "../types/grabmaps";

export function usePlaceSearch(
  query: string,
  category?: GrabCategory,
  region?: string,
) {
  const [results, setResults] = useState<GrabPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchPlaces(query, category, region);
        setResults(data);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [query, category, region]);

  return { results, isLoading };
}
