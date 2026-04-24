import { ItineraryCard } from "./ItineraryCard";
import type { SavedItinerary } from "../../types/itinerary";

interface ItineraryGridProps {
  itineraries: SavedItinerary[];
}

export function ItineraryGrid({ itineraries }: ItineraryGridProps) {
  return (
    <div className="card-grid">
      {itineraries.map((itinerary) => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}
