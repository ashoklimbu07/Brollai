import type { LucideIcon } from 'lucide-react';
import { BookOpen, History, Languages, Library, Scissors, Search, Settings, Sparkles, SplitSquareVertical, Tag } from 'lucide-react';

export type WorkspaceNavItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export const toolsNavItems: WorkspaceNavItem[] = [
  { icon: Sparkles, label: 'Generate B-roll', path: '/tools/generate' },
  { icon: Search, label: 'Video Scene Analyzer', path: '/tools/video-scene-analyzer' },
  { icon: Languages, label: 'Script Translator', path: '/script-translator' },
  { icon: BookOpen, label: 'Manual Story', path: '/tools/manual-story' },
  { icon: SplitSquareVertical, label: 'Prompt Parser', path: '/tools/prompt-cleaner' },
  { icon: Scissors, label: 'Script Splitter', path: '/tools/script-splitter' },
];

export const extraNavItems: WorkspaceNavItem[] = [
  { icon: History, label: 'History', path: '/extra/history' },
  { icon: Library, label: 'Media Library', path: '/extra/media-library' },
];

export const accountNavItems: WorkspaceNavItem[] = [
  { icon: Tag, label: 'Pricing', path: '/account/pricing' },
  { icon: Settings, label: 'Settings', path: '/account/settings' },
];
