'use client';

import { useEffect, useState, useRef } from 'react';

interface Options<T> {
  validate?: (value: unknown) => value is T;
}

export function useWindowStorage<T>(
  key: string,
  initialValue: T,
  options: Options<T> = {}
) {
  const { validate } = options;
  const [value, setValue] = useState<T>(initialValue);
  const isLoaded = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!validate || validate(parsed)) {
          setValue(parsed as T);
        }
      }
    } catch (e) {
      console.warn('Ошибка чтения localStorage:', e);
    } finally {
      isLoaded.current = true;
    }
  }, [key]);

  useEffect(() => {
    if (!isLoaded.current) return;

    try {
      const currentStr = JSON.stringify(value);
      const storedStr = localStorage.getItem(key);

      if (value && typeof value === 'object' && 'projects' in value) {
        const typedValue = value as unknown as { projects: unknown[] };
        if (typedValue.projects.length === 0 && storedStr && storedStr.includes('"projects":[{"')) {
          console.log('Предотвращена перезапись непустого localStorage пустым массивом');
          return;
        }
      }

      if (currentStr !== storedStr) {
        localStorage.setItem(key, currentStr);
      }
    } catch (e) {
      console.warn('Ошибка сохранения в localStorage:', e);
    }
  }, [key, value]);

  return [value, setValue] as const;
}