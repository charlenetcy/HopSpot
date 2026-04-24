import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { usePlaceSearch } from "../../hooks/use-place-search";
import { suggestAreas } from "../../lib/areas";
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
  addedPlaceIds?: string[];
}

export function StopSearch({
  region,
  onRegionChange,
  onAddStop,
  onResultsChange,
  addedPlaceIds = [],
}: StopSearchProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<GrabCategory | undefined>("cafe");
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);
  const { results, isLoading } = usePlaceSearch(query, category, region);
  const areaSuggestions = useMemo(() => suggestAreas(region), [region]);

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
        onFocus={() => setShowAreaSuggestions(true)}
        onBlur={() => {
          window.setTimeout(() => setShowAreaSuggestions(false), 120);
        }}
      />

      {showAreaSuggestions && areaSuggestions.length > 0 ? (
        <div className="results-list area-results">
          {areaSuggestions.map((area) => (
            <button
              key={area.name}
              type="button"
              className="search-result area-result"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onRegionChange(area.name);
                setShowAreaSuggestions(false);
              }}
            >
              <div className="row-between">
                <strong>{area.name}</strong>
                <span className="pill">Area</span>
              </div>
            </button>
          ))}
        </div>
      ) : null}

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
        {results.map((result) => {
          const isAdded = addedPlaceIds.includes(result.id);
          return (
          <button
            type="button"
            className="search-result"
            key={result.id}
            onClick={() => onAddStop(createStop(result))}
            disabled={isAdded}
            style={{
              opacity: isAdded ? 0.64 : 1,
              cursor: isAdded ? "default" : "pointer",
            }}
          >
            <div className="row-between">
              <div>
                <strong>
                  {categoryEmoji[result.category]} {result.name}
                </strong>
                <div className="muted">{result.address}</div>
              </div>
              <span className="pill">
                <Plus size={14} /> {isAdded ? "Added" : "Add"}
              </span>
            </div>
          </button>
          );
        })}
      </div>
    </section>
  );
}
