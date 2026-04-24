import { Link, useParams } from "react-router-dom";
import { MapCanvas } from "../components/map/MapCanvas";
import { discoverItineraries } from "../lib/mock-data";
import { formatDuration } from "../lib/coords";
import { useItineraryStore } from "../store/itinerary-store";

export function SharePage() {
  const params = useParams();
  const getItineraryById = useItineraryStore((state) => state.getItineraryById);
  const itinerary =
    (params.itineraryId ? getItineraryById(params.itineraryId) : undefined) ||
    discoverItineraries[0];

  return (
    <main className="container">
      <section className="share-layout">
        <MapCanvas
          title={itinerary.title}
          region={itinerary.areaLabel}
          stops={itinerary.stops}
          legs={itinerary.legs}
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
            <button type="button" className="ghost-button">
              Copy share link
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
