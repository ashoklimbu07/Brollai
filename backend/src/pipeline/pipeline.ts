import { CONFIG } from '../config.js';
import type { PipelineResult } from '../types.js';
import { ApiKeyPool } from './apiKeyPool.js';
import { runBatchGenerator } from './batchGenerator.js';
import { runMasterAnalyzer } from './masterAnalyzer.js';

export async function runPipeline(
  script: string,
  sceneCount: number,
  style: string,
  signal?: AbortSignal,
): Promise<PipelineResult> {
  const throwIfAborted = (signal?: AbortSignal) => {
    if (signal?.aborted) {
      const err = new Error('Cancelled') as Error & { name: string };
      err.name = 'AbortError';
      throw err;
    }
  };

  throwIfAborted(signal);

  if (sceneCount < 25 || sceneCount > 35) {
    throw new Error('sceneCount must be between 25 and 35 inclusive.');
  }

  const analyzerConfigured = CONFIG.ANALYZER_API_KEYS.length > 0;
  const analyzerKeySummary = CONFIG.ANALYZER_API_KEYS
    .map((k, i) => `key${i + 1}=...${k.slice(-4)}`)
    .join(', ');
  console.log(
    `Pipeline key status -> analyzerKeys=${CONFIG.ANALYZER_API_KEYS.length} [${analyzerKeySummary}] pooledKeys=${CONFIG.API_KEYS.length}`,
  );

  if (CONFIG.API_KEYS.length !== 5) {
    throw new Error(
      `Exactly 5 API keys are required (found ${CONFIG.API_KEYS.length}). Set GEMINI_KEY_1..5 or GEMINI_API_KEY_BROLL1..5 in backend/.env.`,
    );
  }
  if (!CONFIG.ANALYZER_API_KEYS.length) {
    throw new Error('Missing ANALYZER_GEMINI_KEY. Configure at least one dedicated analyzer key in environment.');
  }

  const pool = new ApiKeyPool(CONFIG.API_KEYS);

  let apiCallCount = 0;

  const { context_card: contextCard, chunks: mergedChunks } = await runMasterAnalyzer(
    script,
    CONFIG.ANALYZER_API_KEYS,
    sceneCount,
    style,
  );
  throwIfAborted(signal);
  apiCallCount = 1;

  const batchParams = signal
    ? { allChunks: mergedChunks, pool, style, signal }
    : { allChunks: mergedChunks, pool, style };
  const scenes = await runBatchGenerator(batchParams);
  throwIfAborted(signal);
  const batchCalls = Math.ceil(sceneCount / CONFIG.BATCH_SIZE);
  apiCallCount += batchCalls;

  return {
    context_card: contextCard,
    chunks: mergedChunks,
    scenes,
    total_api_calls: apiCallCount,
    scene_count: sceneCount,
  };
}
