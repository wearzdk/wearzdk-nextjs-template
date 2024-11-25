import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const getStorageValue = (): T => {
    try {
      // nextjs
      if (typeof window === 'undefined') return defaultValue;
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  };

  const [value, setValue] = useState<T>(getStorageValue);

  useEffect(() => {
    try {
      // nextjs
      if (typeof window === 'undefined') return;
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
