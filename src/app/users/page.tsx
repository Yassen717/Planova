'use client';

import { useState, useEffect } from 'react';
import { getTeamMetadata } from '@/lib/metadata';

export const metadata = getTeamMetadata();

export default function UsersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Team Members</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">User List</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400">Team management interface will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}
