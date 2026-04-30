import { useRef } from "react";

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const startX = useRef(null);
  const startY = useRef(null);

  function handleTouchStart(e) {
    const touch = e.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  }

  function handleTouchEnd(e) {
    if (startX.current === null || startY.current === null) return;

    const touch = e.changedTouches[0];

    const diffX = startX.current - touch.clientX;
    const diffY = startY.current - touch.clientY;

    if (Math.abs(diffX) < threshold) return;
    if (Math.abs(diffX) < Math.abs(diffY)) return;

    if (diffX > 0) onSwipeLeft?.();
    else onSwipeRight?.();

    startX.current = null;
    startY.current = null;
  }

  return { handleTouchStart, handleTouchEnd };
}
