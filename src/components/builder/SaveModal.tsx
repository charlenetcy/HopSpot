import { useState } from "react";
import type { ItineraryMeta } from "../../types/itinerary";
import { defaultMeta } from "../../store/itinerary-store";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meta: ItineraryMeta) => void;
}

export function SaveModal({ isOpen, onClose, onSave }: SaveModalProps) {
  const [meta, setMeta] = useState<ItineraryMeta>(defaultMeta);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="save-modal" role="dialog" aria-modal="true">
      <div className="form-card">
        <div className="section-heading">
          <div>
            <strong>Save itinerary</strong>
            <div className="muted">
              This is ready to connect to Supabase persistence.
            </div>
          </div>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="results-list" style={{ marginTop: "1rem" }}>
          <input
            className="input"
            placeholder="Title"
            value={meta.title}
            onChange={(event) =>
              setMeta((current) => ({ ...current, title: event.target.value }))
            }
          />
          <textarea
            className="textarea"
            placeholder="Description"
            value={meta.description}
            onChange={(event) =>
              setMeta((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
          <div className="meta-grid">
            <input
              className="input"
              placeholder="Area label"
              value={meta.areaLabel}
              onChange={(event) =>
                setMeta((current) => ({
                  ...current,
                  areaLabel: event.target.value,
                }))
              }
            />
            <input
              className="input"
              placeholder="Cover emoji"
              value={meta.coverEmoji}
              onChange={(event) =>
                setMeta((current) => ({
                  ...current,
                  coverEmoji: event.target.value,
                }))
              }
            />
          </div>
          <label className="pill-row">
            <input
              type="checkbox"
              checked={meta.isPublic}
              onChange={(event) =>
                setMeta((current) => ({
                  ...current,
                  isPublic: event.target.checked,
                }))
              }
            />
            <span>Publish publicly</span>
          </label>
          <button
            type="button"
            className="button"
            onClick={() => {
              onSave(meta);
              onClose();
            }}
          >
            Save draft
          </button>
        </div>
      </div>
    </div>
  );
}
