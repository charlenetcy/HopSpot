import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { usePlaceSearch } from "../../hooks/use-place-search";
import type { GrabCategory, GrabPlace } from "../../types/grabmaps";
import type { Stop } from "../../types/itinerary";
import { categoryEmoji } from "../../types/itinerary";

const categories: GrabCategory[] = [
  "cafe",
  "bar",
  "restaurant",
  "park",
  "shop",
  "activity",
];

function createStop(place: GrabPlace): Stop {
  return {
    ...place,
    stopId: `${place.id}-${crypto.randomUUID()}`,
    emoji: categoryEmoji[place.category],
    note: "",
    arriveBy: "",
    estimatedStayMins: 60,
  };
}

interface StopSearchProps {
  region: string;
  onRegionChange: (region: string) => void;
  onAddStop: (stop: Stop) => void;
  onResultsChange?: (results: GrabPlace[]) => void;
}

export function StopSearch({
  region,
  onRegionChange,
  onAddStop,
  onResultsChange,
}: StopSearchProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GrabCategory | undefined>("cafe");
  const { results, isLoading } = usePlaceSearch(query, category, region);

  const label = useMemo(() => {
    if (isLoading) {
      return "Searching...";
    }
    if (results.length === 0 && query.trim()) {
      return "No matches";
    }
    return `${results.length} result${results.length === 1 ? "" : "s"}`;
  }, [isLoading, results.length, query]);

  useEffect(() => {
    onResultsChange?.(results);
  }, [onResultsChange, results]);

  return (
    <section className="search-shell">
      <strong>Search</strong>

      <input
        className="input"
        placeholder="Area"
        value={region}
        onChange={(event) => onRegionChange(event.target.value)}
      />

      <div style={{ position: "relative" }}>
        <Search
          size={16}
          style={{ position: "absolute", top: 15, left: 16, opacity: 0.55 }}
        />
        <input
          className="input"
          style={{ paddingLeft: "2.7rem" }}
          placeholder="Cafe, bar, park..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="pill-row">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={`pill ${item === category ? "active" : ""}`}
            onClick={() => setCategory(item)}
          >
            {categoryEmoji[item]} {item}
          </button>
        ))}
      </div>

      <div className="muted">{label}</div>
      <div className="results-list">
        {results.map((result) => (
          <button
            type="button"
            className="search-result"
            key={result.id}
            onClick={() => onAddStop(createStop(result))}
          >
            <div className="row-between">
              <div>
                <strong>
                  {categoryEmoji[result.category]} {result.name}
                </strong>
                <div className="muted">{result.address}</div>
              </div>
              <span className="pill">
                <Plus size={14} /> Add
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
