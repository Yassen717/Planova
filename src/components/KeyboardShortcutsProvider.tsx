'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import KeyboardShortcutsHelp from './shared/KeyboardShortcutsHelp';

export const KeyboardShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Define global keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'p',
        modifiers: ['ctrl'],
        description: 'Create new project',
        action: () => router.push('/projects/new'),
      },
      {
        key: 't',
        modifiers: ['ctrl'],
        description: 'Create new task',
        action: () => router.push('/tasks/new'),
      },
      {
        key: 'k',
        modifiers: ['ctrl'],
        description: 'Focus search',
        action: () => {
          // Focus search input if it exists
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        },
      },
      {
        key: '?',
        modifiers: ['shift'],
        description: 'Show keyboard shortcuts',
        action: () => setIsHelpOpen(true),
      },
      {
        key: 'Escape',
        modifiers: [],
        description: 'Close modal/dialog',
        action: () => {
          // This will be handled by individual modals
          // but we can close the help modal here
          if (isHelpOpen) {
            setIsHelpOpen(false);
          }
        },
      },
    ],
    enabled: true,
  });

  return (
    <>
      {children}
      <KeyboardShortcutsHelp isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
