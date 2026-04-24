import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapCanvas } from "../components/map/MapCanvas";
import { discoverItineraries } from "../lib/mock-data";
import { formatDuration } from "../lib/coords";
import { useItineraryStore } from "../store/itinerary-store";
import type { SavedItinerary } from "../types/itinerary";

function buildShareText(itinerary: SavedItinerary) {
  return [
    `${itinerary.coverEmoji} ${itinerary.title}`,
    [itinerary.areaLabel, itinerary.transportMode, `${itinerary.stops.length} stops`]
      .filter(Boolean)
      .join(" · "),
    itinerary.description,
    "",
    ...itinerary.stops.map((stop, index) =>
      `${index + 1}. ${stop.emoji} ${stop.name}${stop.arriveBy ? ` (${stop.arriveBy})` : ""}`,
    ),
  ]
    .filter(Boolean)
    .join("\n");
}

export function SharePage() {
  const params = useParams();
  const [shareLabel, setShareLabel] = useState("Copy summary");
  const [jsonLabel, setJsonLabel] = useState("Copy JSON");
  const getItineraryById = useItineraryStore((state) => state.getItineraryById);
  const itinerary =
    (params.itineraryId ? getItineraryById(params.itineraryId) : undefined) ||
    discoverItineraries[0];
  const shareText = useMemo(() => buildShareText(itinerary), [itinerary]);
  const itineraryJson = useMemo(() => JSON.stringify(itinerary, null, 2), [itinerary]);

  async function copySummary() {
    await navigator.clipboard.writeText(shareText);
    setShareLabel("Copied");
    window.setTimeout(() => setShareLabel("Copy summary"), 1400);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(itineraryJson);
    setJsonLabel("Copied");
    window.setTimeout(() => setJsonLabel("Copy JSON"), 1400);
  }

  return (
    <main className="container">
      <section className="share-layout">
        <MapCanvas
          title={itinerary.title}
          region={itinerary.areaLabel}
          stops={itinerary.stops}
          legs={itinerary.legs}
          routeGeometry={itinerary.routeGeometry}
        />
        <section className="builder-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{itinerary.coverEmoji} Share view</span>
              <h1 className="page-title" style={{ margin: "0.8rem 0 0.4rem" }}>
                {itinerary.title}
              </h1>
              <p className="muted">{itinerary.description}</p>
            </div>
          </div>

          <div className="summary-row">
            <span className="pill">{itinerary.areaLabel}</span>
            <span className="pill">{itinerary.transportMode}</span>
            <span className="pill">by @{itinerary.username}</span>
          </div>

          <div className="stop-list">
            {itinerary.stops.map((stop, index) => (
              <article key={stop.stopId} className="stop-card">
                <div className="row-between">
                  <strong>
                    {index + 1}. {stop.emoji} {stop.name}
                  </strong>
                  {index > 0 ? (
                    <span className="eta-badge">
                      {formatDuration(itinerary.legs[index - 1]?.durationSeconds ?? 0)}
                    </span>
                  ) : (
                    <span className="pill">Start</span>
                  )}
                </div>
                <div className="muted">{stop.address}</div>
                <div>{stop.note || "A curated stop with room for your own note."}</div>
                <div className="summary-row">
                  <span>Arrive by {stop.arriveBy || "flexible"}</span>
                  <span>Stay {stop.estimatedStayMins} mins</span>
                </div>
              </article>
            ))}
          </div>

          <div className="summary-row">
            <Link className="button" to="/builder">
              Clone itinerary
            </Link>
            <button type="button" className="ghost-button" onClick={() => void copySummary()}>
              {shareLabel}
            </button>
            <button type="button" className="ghost-button" onClick={() => void copyJson()}>
              {jsonLabel}
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
