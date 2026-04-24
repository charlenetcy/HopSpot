import { Footprints, Car, Bike } from "lucide-react";
import { formatDuration } from "../../lib/coords";
import type { TransportMode } from "../../types/itinerary";

const modeIcon = {
  walking: Footprints,
  driving: Car,
  cycling: Bike,
};

interface EtaBadgeProps {
  durationSeconds: number;
  mode: TransportMode;
}

export function EtaBadge({ durationSeconds, mode }: EtaBadgeProps) {
  const Icon = modeIcon[mode];
  return (
    <div className="eta-badge">
      <Icon size={16} />
      <span>{formatDuration(durationSeconds)}</span>
    </div>
  );
}
