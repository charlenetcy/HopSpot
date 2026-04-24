import { useEffect } from "react";
import { useItineraryStore } from "../store/itinerary-store";

export function useRouteSync() {
  const stops = useItineraryStore((state) => state.stops);
  const transportMode = useItineraryStore((state) => state.transportMode);
  const recalculateRoute = useItineraryStore((state) => state.recalculateRoute);

  useEffect(() => {
    void recalculateRoute();
  }, [stops, transportMode, recalculateRoute]);
}
