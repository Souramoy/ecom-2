import { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className="announcement-bar" role="region" aria-label="Store promotion">
      <div className="announcement-inner">
        <span>FREE SHIPPING ON ORDERS OVER ₹2,999</span>
      </div>
      <button
        type="button"
        className="announcement-close"
        onClick={() => setVisible(false)}
        aria-label="Dismiss promotional announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}
