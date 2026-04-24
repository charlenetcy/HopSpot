import { Clock3, GripVertical, Trash2 } from "lucide-react";
import type { Stop } from "../../types/itinerary";

interface StopCardProps {
  index: number;
  stop: Stop;
  onChange: (patch: Partial<Stop>) => void;
  onRemove: () => void;
}

export function StopCard({ index, stop, onChange, onRemove }: StopCardProps) {
  return (
    <article className="stop-card">
      <div className="stop-header">
        <div>
          <strong>
            {index + 1}. {stop.emoji} {stop.name}
          </strong>
          <div className="muted">{stop.address}</div>
        </div>
        <div className="inline-actions">
          <span className="pill">
            <GripVertical size={14} /> Drag
          </span>
          <button className="ghost-button" type="button" onClick={onRemove}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="meta-grid">
        <label>
          <div className="muted">Emoji tag</div>
          <input
            className="input"
            value={stop.emoji}
            maxLength={2}
            onChange={(event) => onChange({ emoji: event.target.value })}
          />
        </label>
        <label>
          <div className="muted">Arrive by</div>
          <div style={{ position: "relative" }}>
            <Clock3
              size={15}
              style={{ position: "absolute", top: 15, left: 16, opacity: 0.55 }}
            />
            <input
              className="input"
              type="time"
              style={{ paddingLeft: "2.6rem" }}
              value={stop.arriveBy}
              onChange={(event) => onChange({ arriveBy: event.target.value })}
            />
          </div>
        </label>
      </div>

      <label>
        <div className="muted">Personal note</div>
        <textarea
          className="textarea"
          maxLength={200}
          placeholder="What makes this stop worth the detour?"
          value={stop.note}
          onChange={(event) => onChange({ note: event.target.value })}
        />
      </label>
    </article>
  );
}
