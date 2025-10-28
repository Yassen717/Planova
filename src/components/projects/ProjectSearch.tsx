'use client';

import React from 'react';
import SearchBar from '@/components/shared/SearchBar';

export interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ value, onChange, onClear }) => {
  return (
    <SearchBar
      placeholder="Search projects by title or description..."
      value={value}
      onChange={onChange}
      onClear={onClear}
    />
  );
};

export default ProjectSearch;
