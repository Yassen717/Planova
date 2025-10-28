'use client';

import React from 'react';
import SearchBar from '@/components/shared/SearchBar';

export interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const TaskSearch: React.FC<TaskSearchProps> = ({ value, onChange, onClear }) => {
  return (
    <SearchBar
      placeholder="Search tasks by title, description, or assignee..."
      value={value}
      onChange={onChange}
      onClear={onClear}
    />
  );
};

export default TaskSearch;
