'use client';

import { useEffect, useCallback } from 'react';
import { KeyboardShortcutWithAction } from '@/types/ui';

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcutWithAction[];
  enabled?: boolean;
}

/**
 * Custom hook for managing keyboard shortcuts
 */
export function useKeyboardShortcuts(options: UseKeyboardShortcutsOptions): void {
  const { shortcuts, enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape key even in input fields
        if (event.key !== 'Escape') {
          return;
        }
      }

      for (const shortcut of shortcuts) {
        const modifiersMatch = checkModifiers(event, shortcut.modifiers);
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (modifiersMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

/**
 * Check if the required modifiers are pressed
 */
function checkModifiers(
  event: KeyboardEvent,
  requiredModifiers: ('ctrl' | 'shift' | 'alt' | 'meta')[]
): boolean {
  const hasCtrl = requiredModifiers.includes('ctrl') ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
  const hasShift = requiredModifiers.includes('shift') ? event.shiftKey : !event.shiftKey;
  const hasAlt = requiredModifiers.includes('alt') ? event.altKey : !event.altKey;
  const hasMeta = requiredModifiers.includes('meta') ? event.metaKey : !event.metaKey;

  return hasCtrl && hasShift && hasAlt && hasMeta;
}

/**
 * Format keyboard shortcut for display
 */
export function formatShortcut(shortcut: { key: string; modifiers: string[] }): string {
  const modifierSymbols: Record<string, string> = {
    ctrl: '⌃',
    shift: '⇧',
    alt: '⌥',
    meta: '⌘',
  };

  const parts = shortcut.modifiers.map((mod) => modifierSymbols[mod] || mod);
  parts.push(shortcut.key.toUpperCase());

  return parts.join(' + ');
}
