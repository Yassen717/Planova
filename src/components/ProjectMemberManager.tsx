'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/lib/userService';
import { projectService } from '@/lib/projectService';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface ProjectMemberManagerProps {
  projectId: string;
  currentMembers: User[];
}

export default function ProjectMemberManager({ projectId, currentMembers }: ProjectMemberManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers.filter((user: any) => !currentMembers.some((member: any) => member.id === user.id)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    
    setIsAdding(true);
    try {
      await projectService.addMemberToProject(projectId, selectedUserId);
      // Refresh the user list
      await fetchUsers();
      setSelectedUserId('');
      // In a real app, you would update the parent component's state here
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await projectService.removeMemberFromProject(projectId, userId);
      // Refresh the user list
      await fetchUsers();
      // In a real app, you would update the parent component's state here
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Project Members</h3>
        {currentMembers.length === 0 ? (
          <p className="text-gray-500">No members added yet.</p>
        ) : (
          <ul className="space-y-2">
            {currentMembers.map((member) => (
              <li key={member.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <div>
                  <span className="font-medium">{member.name || member.email}</span>
                  {member.name && <span className="text-gray-500 text-sm ml-2">({member.email})</span>}
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Add Member</h3>
        <div className="flex space-x-2">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            disabled={users.length === 0}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email} {user.name && `(${user.email})`}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddMember}
            disabled={!selectedUserId || isAdding}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
        {users.length === 0 && (
          <p className="text-gray-500 text-sm mt-2">No users available to add.</p>
        )}
      </div>
    </div>
  );
}