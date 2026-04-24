import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Sparkles } from "lucide-react";
import { StopSearch } from "../components/builder/StopSearch";
import { StopList } from "../components/builder/StopList";
import { TransportPicker } from "../components/builder/TransportPicker";
import { SaveModal } from "../components/builder/SaveModal";
import { MapCanvas } from "../components/map/MapCanvas";
import { useRouteSync } from "../hooks/use-route";
import { formatDistance, formatDuration } from "../lib/coords";
import { useItineraryStore } from "../store/itinerary-store";
import type { GrabPlace } from "../types/grabmaps";
import type { Stop } from "../types/itinerary";

export function BuilderPage() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("Orchard");
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [previewPlaces, setPreviewPlaces] = useState<GrabPlace[]>([]);

  const stops = useItineraryStore((state) => state.stops);
  const legs = useItineraryStore((state) => state.legs);
  const transportMode = useItineraryStore((state) => state.transportMode);
  const addStop = useItineraryStore((state) => state.addStop);
  const updateStop = useItineraryStore((state) => state.updateStop);
  const removeStop = useItineraryStore((state) => state.removeStop);
  const moveStop = useItineraryStore((state) => state.moveStop);
  const setTransportMode = useItineraryStore((state) => state.setTransportMode);
  const saveItinerary = useItineraryStore((state) => state.saveItinerary);

  useRouteSync();

  const totals = useMemo(() => {
    const duration = legs.reduce((sum, leg) => sum + leg.durationSeconds, 0);
    const distance = legs.reduce((sum, leg) => sum + leg.distanceMeters, 0);
    return { duration, distance };
  }, [legs]);

  const handleAddStop = (stop: Stop) => {
    addStop(stop);
    if (!region) {
      setRegion(stop.region);
    }
  };

  return (
    <main className="container">
      <section className="builder-layout">
        <MapCanvas
          title="Plan"
          region={region}
          stops={stops}
          legs={legs}
          previewPlaces={previewPlaces}
        />

        <section className="builder-panel">
          <div className="section-heading">
            <div>
              <strong>Plan</strong>
              <div className="muted">Search, add, save.</div>
            </div>
            <span className="pill">
              <Sparkles size={14} /> {stops.length > 0 ? "Draft" : "Ready"}
            </span>
          </div>

          <StopSearch
            region={region}
            onRegionChange={setRegion}
            onAddStop={handleAddStop}
            onResultsChange={setPreviewPlaces}
          />

          <div className="section-heading">
            <strong>Mode</strong>
            <span className="muted">Auto updates</span>
          </div>
          <TransportPicker value={transportMode} onChange={setTransportMode} />

          <div className="section-heading">
            <strong>Stops</strong>
            <span className="muted">{stops.length}</span>
          </div>

          {stops.length === 0 ? (
            <div className="card">
              <strong>No stops yet.</strong>
              <p className="muted">Add a place to start.</p>
            </div>
          ) : (
            <StopList
              stops={stops}
              legs={legs}
              transportMode={transportMode}
              onMove={moveStop}
              onChange={updateStop}
              onRemove={removeStop}
            />
          )}

          <div className="card">
            <div className="summary-row">
              <span>{stops.length} stops</span>
              <span>{formatDistance(totals.distance)}</span>
              <span>{formatDuration(totals.duration || 0)}</span>
            </div>
            <button
              type="button"
              className="button"
              style={{ width: "100%", marginTop: "1rem" }}
              onClick={() => setIsSaveOpen(true)}
              disabled={stops.length === 0}
            >
              <Save size={16} /> Save itinerary
            </button>
          </div>
        </section>
      </section>

      <SaveModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        onSave={(meta) => {
          const itinerary = saveItinerary(meta);
          navigate(`/share/${itinerary.id}`);
        }}
      />
    </main>
  );
}
