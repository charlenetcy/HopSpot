import { ArrowRight, Clock3, MapPinned, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedDrafts } from "../store/itinerary-store";
import { ItineraryGrid } from "../components/itinerary/ItineraryGrid";

const highlights = [
  {
    title: "Area-first",
    detail: "Start with Orchard, Duxton, or any neighborhood.",
    icon: MapPinned,
  },
  {
    title: "Fast flow",
    detail: "Keep each stop close and easy to hop.",
    icon: Clock3,
  },
  {
    title: "Share",
    detail: "Publish it or keep it private.",
    icon: Share2,
  },
];

export function HomePage() {
  const featured = getFeaturedDrafts();

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-panel">
          <span className="eyebrow">HopSpot</span>
          <h1>Plan a better date route.</h1>
          <p className="muted" style={{ fontSize: "1.08rem", maxWidth: "36rem" }}>
            Search a neighborhood, add stops, and share the plan.
          </p>
          <div className="toolbar" style={{ marginTop: "1.5rem" }}>
            <Link className="button" to="/builder">
              Start planning <ArrowRight size={16} />
            </Link>
            <Link className="ghost-button" to="/discover">
              Discover
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="spotlight-grid">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <article key={highlight.title} className="card">
                  <Icon size={20} />
                  <h3>{highlight.title}</h3>
                  <p className="muted">{highlight.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: "2rem" }}>
        <div className="section-heading" style={{ marginBottom: "1rem" }}>
          <div>
            <h2 className="page-title" style={{ margin: 0 }}>
              Public routes
            </h2>
            <p className="muted">Browse what others made.</p>
          </div>
          <Link className="ghost-button" to="/discover">
            See all
          </Link>
        </div>
        <ItineraryGrid itineraries={featured} />
      </section>
    </main>
  );
}
