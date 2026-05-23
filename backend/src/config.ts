import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brollGeneratorConfig } from './prompts/brollmasterprompt.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });
dotenv.config();

const DEFAULT_SCENE_COUNT = Number(process.env.SCENE_COUNT ?? 30);

// Comma-separated admin emails in .env: ADMIN_EMAILS=you@gmail.com,other@gmail.com
export const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

// Tool output limits per tier. -1 = unlimited.
export const TIER_LIMITS: Record<string, number> = {
    free:  3,
    pro:   20,
    ultra: -1,
    admin: -1,
};
const readPoolKey = (index: number): string | undefined => {
  const primary = process.env[`GEMINI_KEY_${index}` as keyof NodeJS.ProcessEnv]?.trim();
  if (primary) return primary;
  const fallback = process.env[`GEMINI_API_KEY_BROLL${index}` as keyof NodeJS.ProcessEnv]?.trim();
  return fallback || undefined;
};

// Fallback model used when a style-specific env var is not set
const DEFAULT_MODEL = 'gemini-2.5-flash';

export const CONFIG = {
  SCENE_COUNT: DEFAULT_SCENE_COUNT,
  /** Final B-roll generation: scenes per Gemini call (fixed at 5). */
  BATCH_SIZE: brollGeneratorConfig.batchSize,
  MAX_RETRIES: 3,
  BATCH_DELAY_MS: brollGeneratorConfig.batchDelayMs,
  TEMPERATURE: brollGeneratorConfig.temperature,
  ANALYZER_API_KEY: process.env.ANALYZER_GEMINI_KEY?.trim() || '',
  API_KEYS: [1, 2, 3, 4, 5].map(readPoolKey).filter((key): key is string => Boolean(key)),

  // Per-style models — set in .env, fall back to DEFAULT_MODEL
  TRANSPARENT_SKELETON_MODEL: process.env.TRANSPARENT_SKELETON_MODEL?.trim() || DEFAULT_MODEL,
  TWO_D_ANIMATION_MODEL:       process.env.TWO_D_ANIMATION_MODEL?.trim()       || DEFAULT_MODEL,
  TWO_D_NEPAL_THEME_MODEL:     process.env.TWO_D_NEPAL_THEME_MODEL?.trim()     || DEFAULT_MODEL,
  ANALYZER_MODEL:              process.env.ANALYZER_MODEL?.trim()              || DEFAULT_MODEL,
};
