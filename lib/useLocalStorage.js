import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {
      localStorage.removeItem(key);
    }
    setMounted(true);
  }, [key]);

  useEffect(() => {
    if (mounted) localStorage.setItem(key, JSON.stringify(value));
  }, [mounted, key, value]);

  return [value, setValue];
}
