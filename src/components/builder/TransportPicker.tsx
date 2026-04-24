import type { TransportMode } from "../../types/itinerary";

const options: Array<{ value: TransportMode; label: string }> = [
  { value: "walking", label: "Walk" },
  { value: "driving", label: "Drive" },
  { value: "cycling", label: "Cycle" },
];

interface TransportPickerProps {
  value: TransportMode;
  onChange: (mode: TransportMode) => void;
}

export function TransportPicker({ value, onChange }: TransportPickerProps) {
  return (
    <div className="pill-row">
      {options.map((option) => (
        <button
          key={option.value}
          className={`pill ${value === option.value ? "active" : ""}`}
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
