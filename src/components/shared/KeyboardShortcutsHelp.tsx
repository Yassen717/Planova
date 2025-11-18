'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants/keyboardShortcuts';
import { formatShortcut } from '@/hooks/useKeyboardShortcuts';

export interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group shortcuts by category
  const shortcutCategories = {
    'Navigation': [
      { ...KEYBOARD_SHORTCUTS.SEARCH, name: 'SEARCH' },
      { ...KEYBOARD_SHORTCUTS.NEXT_PAGE, name: 'NEXT_PAGE' },
      { ...KEYBOARD_SHORTCUTS.PREV_PAGE, name: 'PREV_PAGE' },
    ],
    'Actions': [
      { ...KEYBOARD_SHORTCUTS.CREATE_PROJECT, name: 'CREATE_PROJECT' },
      { ...KEYBOARD_SHORTCUTS.CREATE_TASK, name: 'CREATE_TASK' },
    ],
    'General': [
      { ...KEYBOARD_SHORTCUTS.CLOSE_MODAL, name: 'CLOSE_MODAL' },
      { ...KEYBOARD_SHORTCUTS.HELP, name: 'HELP' },
    ],
  };

  // Filter shortcuts based on search
  const filteredCategories = Object.entries(shortcutCategories).reduce((acc, [category, shortcuts]) => {
    const filtered = shortcuts.filter(
      (shortcut) =>
        shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortcut.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="lg">
      <div className="space-y-6">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search shortcuts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Shortcuts by Category */}
        {Object.keys(filteredCategories).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(filteredCategories).map(([category, shortcuts]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut: any) => (
                    <div
                      key={shortcut.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">
                        {shortcut.description}
                      </span>
                      <kbd className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No shortcuts found matching "{searchTerm}"
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Shift + ?</kbd> to toggle this help
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default KeyboardShortcutsHelp;
