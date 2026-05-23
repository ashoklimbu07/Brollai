import { GoogleGenerativeAI } from '@google/generative-ai';
import { CONFIG } from '../config.js';
import { getMasterAnalyzerSystemPrompt, getMasterAnalyzerUserPrompt } from '../prompts/masterAnalyzerPrompt.js';
import {
  get2dAnimationMasterAnalyzerSystemPrompt,
  get2dAnimationMasterAnalyzerUserPrompt,
} from '../prompts/masterAnalyzer2dAnimationPrompt.js';
import {
  getNepalThemeMasterAnalyzerSystemPrompt,
  getNepalThemeMasterAnalyzerUserPrompt,
} from '../prompts/masterAnalyzerNepalThemePrompt.js';
import {
  getDocumentaryMasterAnalyzerSystemPrompt,
  getDocumentaryMasterAnalyzerUserPrompt,
} from '../prompts/masterAnalyzerDocumentaryPrompt.js';
import type { MasterAnalyzerResult, SceneChunk } from '../types.js';
import { safeParseJSON } from '../utils/safeParseJSON.js';

function normalizeChunks(raw: SceneChunk[], sceneCount: number): SceneChunk[] {
  const withNumericIds = raw.map((c) => ({
    ...c,
    id: typeof c.id === 'string' ? Number(c.id) : c.id,
  }));
  const sorted = [...withNumericIds].sort((a, b) => a.id - b.id);
  if (sorted.length !== sceneCount) {
    throw new Error(`Master analyzer returned ${sorted.length} chunks, expected ${sceneCount}`);
  }
  for (let i = 0; i < sceneCount; i += 1) {
    const chunk = sorted[i]!;
    const expectedId = i + 1;
    if (chunk.id !== expectedId) {
      throw new Error(`Chunk id mismatch at index ${i}: got ${chunk.id}, expected ${expectedId}`);
    }
  }
  return sorted;
}

export async function runMasterAnalyzer(
  script: string,
  apiKeys: string[],
  sceneCount: number,
  style: string,
): Promise<MasterAnalyzerResult> {
  if (apiKeys.length === 0) {
    throw new Error('runMasterAnalyzer: no analyzer API keys provided');
  }

  let lastError: unknown;
  let attemptCount = 0;

  // Total attempts = MAX_RETRIES per key, rotating across all keys.
  // E.g. 2 keys × 3 retries = up to 6 attempts: k1, k2, k1, k2, k1, k2
  const totalAttempts = CONFIG.MAX_RETRIES * apiKeys.length;

  while (attemptCount < totalAttempts) {
    // Pick the key for this attempt (round-robin)
    const keyIndex = attemptCount % apiKeys.length;
    const apiKey   = apiKeys[keyIndex]!;
    attemptCount  += 1;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Documentary and Nepal theme seeds are verbose — use higher token limit to avoid truncation.
      const maxOutputTokens = style === '2d_nepal_theme' || style === 'documentary' ? 16000 : 8192;
      const model = genAI.getGenerativeModel({
        model: CONFIG.ANALYZER_MODEL,
        generationConfig: {
          maxOutputTokens,
          temperature: CONFIG.TEMPERATURE,
        },
      });

      const systemPrompt =
        style === '2d_nepal_theme'
          ? getNepalThemeMasterAnalyzerSystemPrompt()
          : style === '2d_animation'
            ? get2dAnimationMasterAnalyzerSystemPrompt()
            : style === 'documentary'
              ? getDocumentaryMasterAnalyzerSystemPrompt()
              : getMasterAnalyzerSystemPrompt();

      const userPrompt =
        style === '2d_nepal_theme'
          ? getNepalThemeMasterAnalyzerUserPrompt(script, sceneCount)
          : style === '2d_animation'
            ? get2dAnimationMasterAnalyzerUserPrompt(script, sceneCount)
            : style === 'documentary'
              ? getDocumentaryMasterAnalyzerUserPrompt(script, sceneCount)
              : getMasterAnalyzerUserPrompt(script, sceneCount);

      const result = await model.generateContent([
        { text: systemPrompt },
        { text: userPrompt },
      ]);
      const rawText = result.response.text();
      const parsed = safeParseJSON<MasterAnalyzerResult>(rawText);

      if (!parsed.context_card || !Array.isArray(parsed.chunks)) {
        throw new Error('Master analyzer JSON must include context_card and chunks array');
      }

      const chunks = normalizeChunks(parsed.chunks, sceneCount);
      console.log(
        `Master analyzer complete — key[${keyIndex + 1}/${apiKeys.length}] attempt ${attemptCount}: ` +
        `context card + ${chunks.length} chunks`,
      );
      return { context_card: parsed.context_card, chunks };

    } catch (error) {
      lastError = error;
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(
        `Master analyzer attempt ${attemptCount}/${totalAttempts} failed (key[${keyIndex + 1}]): ${msg}`,
      );
      // Continue to next attempt with the next key
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError ?? 'Unknown error');
  throw new Error(`Master analyzer failed after ${totalAttempts} attempts across ${apiKeys.length} key(s): ${message}`);
}
