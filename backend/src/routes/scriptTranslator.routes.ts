import { Router } from 'express';
import type { Request, Response } from 'express';
import { scriptTranslatorService } from '../services/scriptTranslator.service.js';
import { persistGenerationHistory } from '../services/history.service.js';
import type { TranslationDirection } from '../prompts/scriptTranslatorPrompt.js';

const router = Router();

const VALID_DIRECTIONS: TranslationDirection[] = ['ne->en', 'en->ne'];
const MAX_SCRIPT_CHARS = 2000;

// POST /api/script-translator/translate
router.post('/translate', async (req: Request, res: Response) => {
  const abortController = new AbortController();
  const { signal } = abortController;

  res.on('close', () => {
    if (!res.writableEnded) {
      console.log('🛑 Script translator: client disconnected, aborting');
      abortController.abort();
    }
  });

  try {
    const { script, direction } = req.body as { script?: string; direction?: string };

    if (!script || typeof script !== 'string' || script.trim().length === 0) {
      res.status(400).json({ error: 'script is required and must be a non-empty string.' });
      return;
    }

    if (script.trim().length > MAX_SCRIPT_CHARS) {
      res.status(400).json({ error: `script must not exceed ${MAX_SCRIPT_CHARS} characters.` });
      return;
    }

    if (!direction || !VALID_DIRECTIONS.includes(direction as TranslationDirection)) {
      res.status(400).json({ error: 'direction must be "ne->en" or "en->ne".' });
      return;
    }

    console.log(`🌐 Translating script [${direction}], length: ${script.trim().length}`);

    const translatedText = await scriptTranslatorService.translate(
      script.trim(),
      direction as TranslationDirection,
      signal,
    );

    const payload = { success: true, direction, translatedText };

    // Persist to generation history (same pattern as other tools)
    await persistGenerationHistory({
      req,
      sourceTool: 'script-translator.translate',
      input: { script: script.trim(), direction },
      output: payload,
      combinedOutput: translatedText,
      outputFormats: ['text'],
      files: [
        {
          name: `script-${direction}.txt`,
          mimeType: 'text/plain',
          content: translatedText,
        },
      ],
      metadata: { direction, inputChars: script.trim().length, outputChars: translatedText.length },
    });

    res.json(payload);
  } catch (error) {
    if (signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
      try {
        res.status(499).json({ error: 'Cancelled' });
      } catch {
        // connection already closed
      }
      return;
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Script translator error:', message);
    res.status(500).json({ error: 'Translation failed.', details: message });
  }
});

export const scriptTranslatorRoutes = router;
