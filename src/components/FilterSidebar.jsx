const CATEGORIES = ['Sneakers', 'Running', 'Casual', 'Sports'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const SIZES = [5, 6, 7, 8, 9, 10, 11];
const PRICE_RANGES = [
  { id: 'under-5000', label: 'Under ₹5,000', min: 0, max: 4999 },
  { id: '5000-7000', label: '₹5,000 – ₹7,000', min: 5000, max: 7000 },
  { id: 'above-7000', label: 'Above ₹7,000', min: 7001, max: Infinity },
];
const RATINGS = [
  { label: '4.8 & above', value: 4.8 },
  { label: '4.5 & above', value: 4.5 },
];

export default function FilterSidebar({
  filters,
  availableColors,
  onToggleCategory,
  onToggleGender,
  onToggleSize,
  onToggleColor,
  onSetPriceRange,
  onSetMinRating,
  onClearAll,
  activeFilterCount,
}) {
  return (
    <div className="filter-panel-content">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '1rem',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'underline',
              color: 'var(--color-text-secondary)',
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div className="filter-group">
        <h3 className="filter-title">Category</h3>
        <div className="filter-options">
          {CATEGORIES.map((category) => (
            <label key={category} className="filter-check-label">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onToggleCategory(category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="filter-group">
        <h3 className="filter-title">Gender</h3>
        <div className="filter-options">
          {GENDERS.map((gender) => (
            <label key={gender} className="filter-check-label">
              <input
                type="checkbox"
                checked={filters.genders.includes(gender)}
                onChange={() => onToggleGender(gender)}
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Shoe Size */}
      <div className="filter-group">
        <h3 className="filter-title">Shoe Size (UK)</h3>
        <div className="size-filter-grid">
          {SIZES.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                className={`size-btn ${active ? 'active' : ''}`}
                onClick={() => onToggleSize(size)}
                aria-pressed={active}
              >
                UK {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color */}
      <div className="filter-group">
        <h3 className="filter-title">Color</h3>
        <div className="color-swatch-grid">
          {availableColors.map((color) => {
            const active = filters.colors.includes(color.name);
            return (
              <button
                key={color.name}
                type="button"
                className={`color-swatch-btn ${active ? 'active' : ''}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Filter by color ${color.name}`}
                aria-pressed={active}
                onClick={() => onToggleColor(color.name)}
              />
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h3 className="filter-title">Price Range</h3>
        <div className="filter-options">
          {PRICE_RANGES.map((range) => {
            const checked = filters.priceRange === range.id;
            return (
              <label key={range.id} className="filter-check-label">
                <input
                  type="radio"
                  name="priceRange"
                  checked={checked}
                  onChange={() =>
                    onSetPriceRange(checked ? null : range.id)
                  }
                  onClick={() => {
                    if (checked) onSetPriceRange(null);
                  }}
                />
                <span>{range.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating */}
      <div className="filter-group" style={{ borderBottom: 'none' }}>
        <h3 className="filter-title">Customer Rating</h3>
        <div className="filter-options">
          {RATINGS.map((rating) => {
            const checked = filters.minRating === rating.value;
            return (
              <label key={rating.value} className="filter-check-label">
                <input
                  type="radio"
                  name="minRating"
                  checked={checked}
                  onChange={() =>
                    onSetMinRating(checked ? 0 : rating.value)
                  }
                  onClick={() => {
                    if (checked) onSetMinRating(0);
                  }}
                />
                <span>{rating.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { PRICE_RANGES };
