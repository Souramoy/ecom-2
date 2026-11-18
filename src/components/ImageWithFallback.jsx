import { useState } from 'react';

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fallbackTitle,
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M3 16h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z" />
          <path d="M4 16l2.5-7 4 3 3-4.5 6.5 5.5v3" />
        </svg>
        <span>{fallbackTitle || alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
