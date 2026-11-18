import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback.jsx';

export default function CategoryCard({ category }) {
  const cardRef = useRef(null);

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--tilt-x', `${((0.5 - py) * 8).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${((px - 0.5) * 8).toFixed(2)}deg`);
    el.style.setProperty('--sheen-x', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--sheen-y', `${(py * 100).toFixed(1)}%`);
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <Link
      ref={cardRef}
      to={`/shop?category=${encodeURIComponent(category.slug)}`}
      className="category-card tilt-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ position: 'relative' }}
    >
      <div className="tilt-sheen" aria-hidden="true" />
      <div className="category-media">
        <ImageWithFallback src={category.image} alt={category.name} />
      </div>
      <div className="category-body">
        <h3 className="category-title">{category.name}</h3>
        <p className="category-desc">{category.description}</p>
        <span className="category-cta">
          Shop Now <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
