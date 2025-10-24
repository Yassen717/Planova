'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDate: string;
  dueDate: string | null;
  assignee: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  project: {
    id: string;
    title: string;
  };
  comments: {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
};

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      // Fetch real data from the API
      const response = await fetch(`/api/tasks/${taskId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch task');
      }
      
      setTask(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      // Call the API to add a comment
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          authorId: '1', // In a real app, this would be the current user ID
          taskId: taskId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to add comment');
      }
      
      // Update local state
      if (task) {
        setTask({
          ...task,
          comments: [result.data, ...task.comments],
        });
        setNewComment('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'DONE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task not found</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">The task you're looking for doesn't exist.</p>
            <Link href="/tasks" className="mt-4 inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              ← Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/tasks" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                ← Back to Tasks
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {task.description || 'No description provided'}
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Edit Task
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Task Details */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Task Details</h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <dl>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Priority</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Project</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      <Link href={`/projects/${task.project.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        {task.project.title}
                      </Link>
                    </dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Assignee</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {task.assignee ? (task.assignee.name || task.assignee.email) : 'Unassigned'}
                    </dd>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Start Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {new Date(task.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300">Due Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Comments</h3>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                {/* Add Comment Form */}
                <div className="p-6">
                  <form onSubmit={handleAddComment}>
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          rows={3}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                              newComment.trim() 
                                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Add Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Comments List */}
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {task.comments.map((comment) => (
                      <li key={comment.id} className="px-6 py-6">
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {comment.author.name || comment.author.email}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                            <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {task.comments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}