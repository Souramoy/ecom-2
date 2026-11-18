import { Star } from 'lucide-react';

export default function TestimonialCard({ review }) {
  return (
    <article className="testimonial-card">
      <div>
        <div
          className="testimonial-stars"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {Array.from({ length: review.rating }).map((_, idx) => (
            <Star key={idx} size={14} fill="currentColor" aria-hidden="true" />
          ))}
        </div>
        <p className="testimonial-quote" style={{ marginTop: '0.9rem' }}>
          “{review.quote}”
        </p>
      </div>

      <div className="testimonial-author">
        <span className="testimonial-name">
          {review.name} · {review.city}
        </span>
        <span className="testimonial-meta">Verified purchase: {review.product}</span>
      </div>
    </article>
  );
}
