'use client';

import { useState, useEffect } from 'react';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'USER' | 'ADMIN',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      } else {
        setError(result.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Reset form and refresh users
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'USER',
        });
        setShowCreateForm(false);
        fetchUsers();
      } else {
        setError(result.error || 'Failed to create user');
      }
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'USER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {showCreateForm ? 'Cancel' : 'Add Member'}
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Create User Form */}
            {showCreateForm && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add New Team Member</h2>
                <form onSubmit={handleCreateUser}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Role
                      </label>
                      <select
                        id="role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users Grid */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                  <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        </div>
                        <div className="ml-4">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {user.name || user.email}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-6 flex justify-between">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          View Profile
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {users.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No team members found.</p>
                    <button 
                      onClick={() => setShowCreateForm(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Your First Team Member
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}