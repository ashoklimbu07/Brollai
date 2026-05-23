import type { BrollStyle } from './brollTypes';

const SCRIPT_LIMITS: Record<string, { min: number; max: number }> = {
  '2d_nepal_theme': { min: 800, max: 2000 },
  'documentary':    { min: 1000, max: 2000 },
};

const DEFAULT_LIMITS = { min: 800, max: 1500 };

export function getScriptLimits(style?: BrollStyle): { min: number; max: number } {
  if (style && style in SCRIPT_LIMITS) return SCRIPT_LIMITS[style]!;
  return DEFAULT_LIMITS;
}

export function getScriptLengthError(length: number, style?: BrollStyle): string | null {
  if (!length) return 'Please enter a script first';
  const { min, max } = getScriptLimits(style);
  if (length < min || length > max) {
    return `Your script must be between ${min} and ${max} characters. Current length: ${length}.`;
  }
  return null;
}

