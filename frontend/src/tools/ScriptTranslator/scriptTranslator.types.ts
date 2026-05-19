export type TranslationDirection = 'ne->en' | 'en->ne';

export const TRANSLATION_TEMPLATES: {
  id: TranslationDirection;
  from: string;
  to: string;
}[] = [
  { id: 'ne->en', from: 'Nepali', to: 'English' },
  { id: 'en->ne', from: 'English', to: 'Nepali' },
];

export const MAX_CHARS = 2000;
