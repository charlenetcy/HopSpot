import { useParams } from "react-router-dom";
import { ItineraryGrid } from "../components/itinerary/ItineraryGrid";
import { discoverItineraries } from "../lib/mock-data";
import { useItineraryStore } from "../store/itinerary-store";

export function ProfilePage() {
  const params = useParams();
  const username = params.username ?? "charlene";
  const savedItineraries = useItineraryStore((state) => state.savedItineraries);
  const itineraries = [...savedItineraries, ...discoverItineraries].filter(
    (itinerary) => itinerary.username === username || username === "charlene",
  );

  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <div className="hero-panel" style={{ marginBottom: "1rem" }}>
        <span className="eyebrow">KOL-ready profile</span>
        <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>
          @{username}
        </h1>
        <p className="muted">
          Public itineraries, follow state, and private drafts can all hang off this route once
          Supabase auth is connected.
        </p>
      </div>
      <ItineraryGrid itineraries={itineraries.length ? itineraries : discoverItineraries} />
    </main>
  );
}
