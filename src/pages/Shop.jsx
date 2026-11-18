import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { products } from '../data/products.js';
import ProductGrid from '../components/ProductGrid.jsx';
import FilterSidebar, { PRICE_RANGES } from '../components/FilterSidebar.jsx';
import MobileFilterDrawer from '../components/MobileFilterDrawer.jsx';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const initialCategory = searchParams.get('category');
  const initialGender = searchParams.get('gender');
  const initialSort = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('q') || '';

  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    genders: initialGender ? [initialGender] : [],
    sizes: [],
    colors: [],
    priceRange: null,
    minRating: 0,
  });

  const [sortBy, setSortBy] = useState(initialSort);

  // Sync URL query parameters when user clicks navbar links
  useEffect(() => {
    const cat = searchParams.get('category');
    const gen = searchParams.get('gender');
    const srt = searchParams.get('sort') || 'featured';

    setFilters((prev) => ({
      ...prev,
      categories: cat ? [cat] : [],
      genders: gen ? [gen] : [],
    }));
    setSortBy(srt);
  }, [searchParams]);

  const availableColors = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!map.has(c.name)) {
          map.set(c.name, c);
        }
      });
    });
    return Array.from(map.values());
  }, []);

  const toggleItem = (key, value) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value],
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      genders: [],
      sizes: [],
      colors: [],
      priceRange: null,
      minRating: 0,
    });
    setSortBy('featured');
    if (searchParams.toString()) {
      setSearchParams({});
    }
  };

  const activeFilterCount =
    filters.categories.length +
    filters.genders.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.priceRange ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.genders.length > 0) {
      list = list.filter(
        (p) => filters.genders.includes(p.gender) || p.gender === 'Unisex'
      );
    }

    if (filters.sizes.length > 0) {
      list = list.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    }

    if (filters.colors.length > 0) {
      list = list.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c.name))
      );
    }

    if (filters.priceRange) {
      const range = PRICE_RANGES.find((r) => r.id === filters.priceRange);
      if (range) {
        list = list.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }

    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rated':
        list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default:
        list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
        break;
    }

    return list;
  }, [filters, sortBy, searchQuery]);

  const pageTitle = useMemo(() => {
    if (searchQuery) return `Search: “${searchQuery}”`;
    if (filters.categories.length === 1) return filters.categories[0];
    if (filters.genders.length === 1) return `${filters.genders[0]}’s Footwear`;
    if (sortBy === 'newest') return 'New Arrivals';
    return 'All Footwear';
  }, [searchQuery, filters.categories, filters.genders, sortBy]);

  const filterProps = {
    filters,
    availableColors,
    onToggleCategory: (val) => toggleItem('categories', val),
    onToggleGender: (val) => toggleItem('genders', val),
    onToggleSize: (val) => toggleItem('sizes', val),
    onToggleColor: (val) => toggleItem('colors', val),
    onSetPriceRange: (val) => setFilters((prev) => ({ ...prev, priceRange: val })),
    onSetMinRating: (val) => setFilters((prev) => ({ ...prev, minRating: val })),
    onClearAll: clearAllFilters,
    activeFilterCount,
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Shop</span>
            {filters.categories.length === 1 && (
              <>
                <span aria-hidden="true">/</span>
                <span>{filters.categories[0]}</span>
              </>
            )}
          </nav>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1 className="section-title">{pageTitle}</h1>
              <p className="section-subtitle">
                Engineered silhouettes crafted for comfort, durability, and clean architectural form.
              </p>
            </div>
            <span
              className="tabular-nums"
              style={{ fontSize: '0.88rem', fontWeight: 600, color: '#777777' }}
            >
              {filteredProducts.length} Product{filteredProducts.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </section>

      <div className="container shop-layout">
        <aside className="filter-sidebar" aria-label="Product filters">
          <FilterSidebar {...filterProps} />
        </aside>

        <div>
          <div className="shop-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm mobile-filter-trigger"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={clearAllFilters}
                >
                  <X size={14} aria-hidden="true" />
                  Clear All Filters
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <label
                htmlFor="shop-sort"
                style={{ fontSize: '0.84rem', color: '#777777', fontWeight: 500 }}
              >
                Sort by
              </label>
              <select
                id="shop-sort"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rated">Best Rated</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700 }}>
                No matching pairs found
              </h2>
              <p style={{ color: '#777777', maxWidth: '42ch' }}>
                Try widening your size, price, or category filters to explore more silhouettes.
              </p>
              <button type="button" className="btn btn-primary" onClick={clearAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} columns={3} />
          )}
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        resultCount={filteredProducts.length}
        {...filterProps}
      />
    </>
  );
}
