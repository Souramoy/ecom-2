import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar.jsx';

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  resultCount,
  ...filterProps
}) {
  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Mobile product filters"
        aria-hidden={!isOpen}
      >
        <div className="mobile-drawer-header">
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>
            Filter Products
          </span>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ paddingBlock: '1rem', flex: 1 }}>
          <FilterSidebar {...filterProps} />
        </div>

        <div className="mobile-drawer-footer">
          <button type="button" className="btn btn-primary btn-full" onClick={onClose}>
            Show {resultCount} Result{resultCount === 1 ? '' : 's'}
          </button>
        </div>
      </aside>
    </>
  );
}
