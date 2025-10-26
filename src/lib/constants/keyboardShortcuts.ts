// Keyboard Shortcuts Configuration

export interface KeyboardShortcut {
  key: string;
  modifiers: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  description: string;
}

export const KEYBOARD_SHORTCUTS = {
  CREATE_PROJECT: {
    key: 'p',
    modifiers: ['ctrl'] as const,
    description: 'Create new project',
  },
  CREATE_TASK: {
    key: 't',
    modifiers: ['ctrl'] as const,
    description: 'Create new task',
  },
  SEARCH: {
    key: 'k',
    modifiers: ['ctrl'] as const,
    description: 'Focus search',
  },
  CLOSE_MODAL: {
    key: 'Escape',
    modifiers: [] as const,
    description: 'Close modal/dialog',
  },
  HELP: {
    key: '?',
    modifiers: ['shift'] as const,
    description: 'Show keyboard shortcuts',
  },
  NEXT_PAGE: {
    key: 'ArrowRight',
    modifiers: ['ctrl'] as const,
    description: 'Next page',
  },
  PREV_PAGE: {
    key: 'ArrowLeft',
    modifiers: ['ctrl'] as const,
    description: 'Previous page',
  },
} as const;

export type ShortcutKey = keyof typeof KEYBOARD_SHORTCUTS;
