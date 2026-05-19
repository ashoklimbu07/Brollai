import { useEffect, useState } from 'react';

const INPUT_KEY = 'scriptwriter:text';
const OUTPUT_KEY = 'scriptwriter:translatedText';

function useSessionState(key: string, initial = ''): [string, (v: string) => void] {
  const [value, setValue] = useState<string>(() => {
    try {
      return sessionStorage.getItem(key) ?? initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // ignore quota / private-mode errors
    }
  }, [key, value]);

  return [value, setValue];
}

export function useScriptInput() {
  return useSessionState(INPUT_KEY);
}

export function useTranslatedOutput() {
  return useSessionState(OUTPUT_KEY);
}
