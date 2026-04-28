import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setValue(JSON.parse(saved));
    setMounted(true);
  }, [key]);

  useEffect(() => {
    if (mounted) localStorage.setItem(key, JSON.stringify(value));
  }, [mounted, key, value]);

  return [value, setValue];
}
