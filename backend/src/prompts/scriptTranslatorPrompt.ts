/**
 * Master prompts for the Script Translator tool.
 *
 * ne->en: Preserve exact meaning, story tone, and narrative structure. No paraphrasing.
 * en->ne: Preserve exact meaning with correct Nepali grammar and natural phrasing.
 */

export type TranslationDirection = 'ne->en' | 'en->ne';

export function buildTranslatorPrompt(direction: TranslationDirection, script: string): string {
  if (direction === 'ne->en') {
    return `You are a professional script translator specialising in Nepali to English translation.

TASK:
Translate the Nepali script below into English.

RULES:
- Preserve the EXACT meaning of every sentence — do not paraphrase, summarise, or add anything.
- Preserve the story type, tone, and narrative structure (e.g. if it is a drama, keep it dramatic; if it is comedy, keep the wit).
- Preserve paragraph and line breaks exactly as they appear in the original.
- Translate proper nouns (names, places) phonetically unless a well-known English equivalent exists.
- Do NOT add any translator notes, headings, or commentary — output only the translated script.

SCRIPT:
${script}`;
  }

  // en->ne
  return `You are a professional script translator specialising in English to Nepali translation.

TASK:
Translate the English script below into Nepali.

RULES:
- Preserve the EXACT meaning of every sentence — do not paraphrase, summarise, or add anything.
- Preserve the story type, tone, and narrative structure (e.g. if it is a drama, keep it dramatic; if it is comedy, keep the wit).
- Use correct, natural Nepali grammar — avoid literal word-for-word constructions that sound unnatural in Nepali.
- Preserve paragraph and line breaks exactly as they appear in the original.
- Translate proper nouns (names, places) phonetically into Nepali script unless a standard Nepali equivalent is widely accepted.
- Do NOT add any translator notes, headings, or commentary — output only the translated script.

SCRIPT:
${script}`;
}
