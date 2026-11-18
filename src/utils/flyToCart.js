export function flyToCart(sourceElement, imageSrc) {
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const target = document.querySelector('[data-cart-target="true"]');
  if (!sourceElement || !target || !imageSrc) return;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  if (sourceRect.width === 0 || targetRect.width === 0) return;

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  const ghost = document.createElement('img');
  ghost.src = imageSrc;
  ghost.alt = '';
  ghost.setAttribute('aria-hidden', 'true');
  ghost.className = 'fly-cart-ghost';

  const size = 68;
  ghost.style.left = `${startX - size / 2}px`;
  ghost.style.top = `${startY - size / 2}px`;
  ghost.style.width = `${size}px`;
  ghost.style.height = `${size}px`;

  document.body.appendChild(ghost);

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const midX = deltaX * 0.45;
  const midY = Math.min(deltaY * 0.35, -75) - 45;

  const animation = ghost.animate(
    [
      {
        transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
        opacity: 0.96,
      },
      {
        transform: `translate3d(${midX}px, ${midY}px, 0) scale(0.72) rotate(-10deg)`,
        opacity: 0.92,
        offset: 0.48,
      },
      {
        transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.24) rotate(8deg)`,
        opacity: 0.15,
      },
    ],
    {
      duration: 540,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards',
    }
  );

  animation.onfinish = () => {
    ghost.remove();
    target.classList.remove('cart-bump');
    // Force reflow so rapid consecutive adds retrigger the bump
    void target.offsetWidth;
    target.classList.add('cart-bump');
    window.setTimeout(() => {
      target.classList.remove('cart-bump');
    }, 450);
  };
}
