export const tickerItems = [
  'Trending B-Roll',
  'AI Generated',
  'YouTube Shorts',
  'TikTok Ready',
  '9:16 Format',
  'Viral Content',
  'Auto Captions',
  'One Click Export',
];

export const stats = [
  { value: '2M+', label: 'B-Roll Clips in Library' },
  { value: '98%', label: 'Trend Match Accuracy' },
  { value: '8s', label: 'Avg Generation Time' },
  { value: '4K', label: 'Max Export Quality' },
];

export const steps = [
  {
    number: '01',
    icon: '✍️',
    title: 'Describe Your Content',
    description:
      'Type a topic, paste your script, or drop your voiceover. BrollAI reads your intent and detects what kind of visuals will hit hardest.',
  },
  {
    number: '02',
    icon: '🔥',
    title: 'AI Finds Trending B-Roll',
    description:
      'Our model scans trending content across TikTok & Shorts daily, matching visuals to your topic using semantic search + viral score weighting.',
  },
  {
    number: '03',
    icon: '✂️',
    title: 'Auto-Edits & Syncs',
    description:
      'Clips are trimmed, sequenced, and synced to your audio or captions automatically. Transitions, pacing, and cuts - all handled.',
  },
  {
    number: '04',
    icon: '🚀',
    title: 'Export & Post',
    description:
      'Download 9:16 ready clips at up to 4K. Optimized for TikTok, YouTube Shorts, and Instagram Reels - with captions baked in.',
  },
];

export const features = [
  {
    tag: 'Generate',
    title: 'B-Roll Generator',
    description:
      'Describe your topic and let AI build a full B-roll shot list — complete with scene cues, visual styles, and platform-ready prompts for TikTok, Shorts, and Reels.',
    icon: '✨',
    wide: false,
  },
  {
    tag: 'Analyze',
    title: 'Video Scene Analyzer',
    description:
      'Drop a video and get a breakdown of every scene — shot types, pacing, visual hooks, and re-edit suggestions. Know exactly what is working before you post.',
    icon: '🔍',
    wide: false,
  },
  {
    tag: 'Translate',
    title: 'Script Translator',
    description:
      'Translate your video script into any language while preserving tone, slang, and platform-specific phrasing. Built for creators who post globally.',
    icon: '🌐',
    wide: false,
  },
  {
    tag: 'Story',
    title: 'Manual Story Builder',
    description:
      'Build narrative-driven story scripts manually — control scene order, emotional beats, and voiceover timing. Great for long-form storytelling cut into shorts.',
    icon: '📖',
    wide: false,
  },
  {
    tag: 'History',
    title: 'Generation History',
    description:
      'Every generation you run is saved. Go back, re-run, tweak, or export past outputs without starting from scratch. Available on Pro and Ultra plans.',
    icon: '🗂️',
    wide: true,
  },
];

export const platforms = [
  {
    name: 'TikTok',
    icon: '🎵',
    platform: 'tiktok',
    specs: ['9:16 vertical - Up to 4K', 'Trend audio sync', 'Duet-ready format', 'Max 3-min clips'],
  },
  {
    name: 'YouTube Shorts',
    icon: '▶️',
    platform: 'yt',
    specs: ['9:16 vertical - 60s max', 'Thumbnail auto-gen', 'Chapter markers', 'SEO title suggestions'],
  },
  {
    name: 'Instagram Reels',
    icon: '📸',
    platform: 'reels',
    specs: [
      '9:16 vertical - 90s max',
      'Story crosspost ready',
      'Branded watermark removal',
      'Cover frame selector',
    ],
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
