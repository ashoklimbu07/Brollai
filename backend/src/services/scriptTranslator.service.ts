import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildTranslatorPrompt, type TranslationDirection } from '../prompts/scriptTranslatorPrompt.js';

const TRANSLATOR_API_KEY = process.env.GEMINI_API_KEY_TRANSLATOR?.trim() || '';
// Use a lightweight flash model — translation doesn't need the heavy model
const TRANSLATOR_MODEL = process.env.TRANSLATOR_MODEL?.trim() || 'gemini-2.5-flash-lite';

export const scriptTranslatorService = {
  translate: async (
    script: string,
    direction: TranslationDirection,
    signal?: AbortSignal,
  ): Promise<string> => {
    if (!TRANSLATOR_API_KEY) {
      throw new Error('Translator API key is not configured (GEMINI_API_KEY_TRANSLATOR).');
    }

    const genAI = new GoogleGenerativeAI(TRANSLATOR_API_KEY);
    const model = genAI.getGenerativeModel({ model: TRANSLATOR_MODEL });

    const prompt = buildTranslatorPrompt(direction, script);

    // Abort support: race the Gemini call against the signal
    const generatePromise = model.generateContent(prompt);

    if (signal) {
      await Promise.race([
        generatePromise,
        new Promise<never>((_, reject) => {
          if (signal.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            return;
          }
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
            once: true,
          });
        }),
      ]);
    }

    const result = await generatePromise;
    const translated = result.response.text().trim();

    if (!translated) {
      throw new Error('Translator returned an empty response. Please try again.');
    }

    return translated;
  },
};
