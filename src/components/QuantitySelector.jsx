import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  label = 'Quantity',
}) {
  return (
    <div className="qty-selector" role="group" aria-label={label}>
      <button
        type="button"
        className="qty-btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="qty-value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="qty-btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
