import { Link } from "react-router-dom";
import { formatDistance, formatDuration } from "../../lib/coords";
import type { SavedItinerary } from "../../types/itinerary";

interface ItineraryCardProps {
  itinerary: SavedItinerary;
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
  const totalDuration = itinerary.legs.reduce(
    (sum, leg) => sum + leg.durationSeconds,
    0,
  );
  const totalDistance = itinerary.legs.reduce(
    (sum, leg) => sum + leg.distanceMeters,
    0,
  );

  return (
    <Link to={`/share/${itinerary.id}`} className="itinerary-card">
      <div className="row-between">
        <div className="pill">
          {itinerary.coverEmoji} {itinerary.areaLabel}
        </div>
        <div className="muted">@{itinerary.username}</div>
      </div>
      <h3>{itinerary.title}</h3>
      <p className="muted">{itinerary.description}</p>
      <div className="summary-row">
        <span>{itinerary.stops.length} stops</span>
        <span>{formatDuration(totalDuration)}</span>
        <span>{formatDistance(totalDistance)}</span>
      </div>
    </Link>
  );
}
