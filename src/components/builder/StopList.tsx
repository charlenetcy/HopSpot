import { EtaBadge } from "./EtaBadge";
import { StopCard } from "./StopCard";
import type { RouteLeg } from "../../types/grabmaps";
import type { Stop, TransportMode } from "../../types/itinerary";

interface StopListProps {
  stops: Stop[];
  legs: RouteLeg[];
  transportMode: TransportMode;
  onMove: (fromIndex: number, toIndex: number) => void;
  onChange: (stopId: string, patch: Partial<Stop>) => void;
  onRemove: (stopId: string) => void;
}

export function StopList({
  stops,
  legs,
  transportMode,
  onMove,
  onChange,
  onRemove,
}: StopListProps) {
  return (
    <div className="stop-list">
      {stops.map((stop, index) => (
        <div key={stop.stopId}>
          {index > 0 && (
            <div className="row-between" style={{ marginBottom: "0.75rem" }}>
              <EtaBadge
                durationSeconds={legs[index - 1]?.durationSeconds ?? 0}
                mode={transportMode}
              />
              <div className="inline-actions">
                {index > 0 ? (
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => onMove(index, index - 1)}
                  >
                    Move up
                  </button>
                ) : null}
                {index < stops.length - 1 ? (
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => onMove(index, index + 1)}
                  >
                    Move down
                  </button>
                ) : null}
              </div>
            </div>
          )}
          <StopCard
            index={index}
            stop={stop}
            onChange={(patch) => onChange(stop.stopId, patch)}
            onRemove={() => onRemove(stop.stopId)}
          />
        </div>
      ))}
    </div>
  );
}
