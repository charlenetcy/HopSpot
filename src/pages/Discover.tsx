import { useMemo, useState } from "react";
import { ItineraryGrid } from "../components/itinerary/ItineraryGrid";
import { discoverItineraries } from "../lib/mock-data";
import { useItineraryStore } from "../store/itinerary-store";

export function DiscoverPage() {
  const [area, setArea] = useState("");
  const [mode, setMode] = useState("all");
  const savedItineraries = useItineraryStore((state) => state.savedItineraries);
  const combined = [...savedItineraries, ...discoverItineraries];

  const filtered = useMemo(
    () =>
      combined.filter((itinerary) => {
        const matchesArea =
          !area ||
          itinerary.areaLabel.toLowerCase().includes(area.toLowerCase()) ||
          itinerary.title.toLowerCase().includes(area.toLowerCase());
        const matchesMode = mode === "all" || itinerary.transportMode === mode;
        return matchesArea && matchesMode;
      }),
    [area, combined, mode],
  );

  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <div className="section-heading" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>
            Discover
          </h1>
          <p className="muted">
            A public feed of KOL and community-made itineraries, filtered by area and travel mode.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="meta-grid">
          <input
            className="input"
            placeholder="Filter by area"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          />
          <select
            className="select"
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="all">All modes</option>
            <option value="walking">Walking</option>
            <option value="driving">Driving</option>
            <option value="cycling">Cycling</option>
          </select>
        </div>
      </div>

      <ItineraryGrid itineraries={filtered} />
    </main>
  );
}
