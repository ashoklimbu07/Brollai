export const tickerItems = [
  'B-Roll Generator',
  'Scene Analyzer',
  'Script Translator',
  'Manual Story Builder',
  'AI Prompt Toolkit',
  'Generation History',
  'Short-Form Content',
  'Built for Creators',
];

export const stats = [
  { value: '5', label: 'AI-Powered Tools' },
  { value: '3x', label: 'Faster Content Prep' },
  { value: '$0', label: 'To Start' },
  { value: '∞', label: 'Ideas. One Platform.' },
];

export const steps = [
  {
    number: '01',
    icon: '✍️',
    title: 'Describe Your Idea',
    description:
      'Type a topic, paste a script, or drop a concept. BrollAI understands your intent and routes it to the right tool automatically.',
  },
  {
    number: '02',
    icon: '⚡',
    title: 'AI Builds the Output',
    description:
      'Generate a full B-roll shot list, analyze a video scene, translate your script, or build a story — all in seconds, not hours.',
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Bulk Export & Post',
    description:
      'Copy, export, or save your outputs. Every generation is stored in your history so you can revisit, tweak, and reuse anytime.',
  },
];

export const features = [
  {
    tag: 'Generate',
    title: 'B-Roll Generator',
    description:
      'Already-viral templates built in. Just paste your prompt and get a full scene-by-scene B-roll shot list — instantly.',
    icon: '✨',
    wide: false,
  },
  {
    tag: 'Analyze',
    title: 'Video Scene Analyzer',
    description:
      'Paste any competitor or viral video script. Reverse engineer it to get the exact AI prompts, scene structure, and visual style behind it — then replicate or beat it.',
    icon: '🔍',
    wide: false,
  },
  {
    tag: 'Translate',
    title: 'Script Translator',
    description:
      'Translate your script into any language without losing tone, slang, or rhythm. Built for creators who publish across regions.',
    icon: '🌐',
    wide: false,
  },
  {
    tag: 'Story',
    title: 'Manual Story Builder',
    description:
      'Manually write your story keeping consistent characters, scene continuity, and B-roll flow — full control over narrative without losing visual coherence.',
    icon: '📖',
    wide: false,
  },
  {
    tag: 'Pro+',
    title: 'Generation History',
    description:
      'Every output you run is saved automatically. Revisit past generations, re-run with tweaks, or bulk export — no starting from scratch.',
    icon: '🗂️',
    wide: true,
  },
];

export const pricing = [
  {
    plan: 'Free',
    amount: '0',
    period: 'forever free',
    popular: false,
    buttonLabel: 'Get Started Free',
    buttonVariant: 'outline' as const,
    features: [
      { label: '3 outputs / month', muted: false },
      { label: 'B-roll generator', muted: false },
      { label: 'Video scene analyzer', muted: false },
      { label: 'Script translator', muted: false },
      { label: 'Manual story builder', muted: false },
      { label: 'Generation history', muted: true },
    ],
  },
  {
    plan: 'Pro',
    amount: '4.99',
    period: 'per month',
    popular: true,
    buttonLabel: 'Get Pro',
    buttonVariant: 'solid' as const,
    features: [
      { label: '20 outputs / month', muted: false },
      { label: 'B-roll generator', muted: false },
      { label: 'Video scene analyzer', muted: false },
      { label: 'Script translator', muted: false },
      { label: 'Manual story builder', muted: false },
      { label: 'Generation history', muted: false },
    ],
  },
  {
    plan: 'Ultra',
    amount: '15.99',
    period: 'per month',
    popular: false,
    buttonLabel: 'Get Ultra',
    buttonVariant: 'outline' as const,
    features: [
      { label: 'Unlimited outputs', muted: false },
      { label: 'Everything in Pro', muted: false },
      { label: 'Unlimited generations', muted: false },
      { label: 'Priority processing', muted: false },
      { label: 'Early feature access', muted: false },
    ],
  },
];
