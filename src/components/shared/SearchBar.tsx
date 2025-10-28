'use client';

import React, { useRef, useEffect } from 'react';
import { useSearch } from '@/hooks/useSearch';
import Input from '@/components/ui/Input';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  autoFocus?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: externalValue,
  onChange,
  onClear,
  debounceMs = 300,
  autoFocus = false,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchTerm, debouncedSearchTerm, setSearchTerm, clearSearch } = useSearch({
    debounceMs,
    initialValue: externalValue || '',
  });

  // Sync debounced value with parent
  useEffect(() => {
    onChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onChange]);

  // Handle keyboard shortcut (Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    clearSearch();
    if (onClear) {
      onClear();
    }
  };

  const searchIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onClear={searchTerm ? handleClear : undefined}
      prefixIcon={searchIcon}
      autoFocus={autoFocus}
      className={className}
    />
  );
};

export default SearchBar;
