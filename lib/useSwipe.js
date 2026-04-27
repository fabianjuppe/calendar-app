import { useRef } from "react";

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const touchStartX = useRef(null);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - event.changedTouches[0].clientX;
    if (Math.abs(diff) < threshold) return;
    if (diff > 0) onSwipeLeft?.();
    else onSwipeRight?.();
    touchStartX.current = null;
  }

  return { handleTouchStart, handleTouchEnd };
}
