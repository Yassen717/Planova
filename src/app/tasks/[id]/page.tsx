'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Avatar from '@/components/ui/Avatar';
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

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
  const { data: session } = useSession();
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
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
    
    if (!newComment.trim() || !session?.user) return;
    
    try {
      setIsSubmitting(true);
      const userId = (session.user as any).id;
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          authorId: userId,
          taskId: taskId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to add comment');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to add comment');
      }
      
      if (task) {
        setTask({
          ...task,
          comments: [result.data, ...task.comments],
        });
        setNewComment('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading task...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl" role="alert">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Task not found</h1>
          <p className="mt-2 text-slate-500">The task you're looking for doesn't exist or has been deleted.</p>
          <Link 
            href="/tasks" 
            className="mt-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Back Link */}
        <Link 
          href="/tasks" 
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tasks
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {task.title}
              </h1>
              <p className="mt-2 text-slate-600">
                {task.description || 'No description provided'}
              </p>
            </div>
            <Link href={`/tasks/${taskId}/edit`}>
              <Button variant="primary">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Task
              </Button>
            </Link>
          </div>
        </div>

        {/* Task Details Card */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Task Details
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {/* Status */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Status</span>
              <TaskStatusBadge status={task.status} />
            </div>
            
            {/* Priority */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Priority</span>
              <TaskPriorityBadge priority={task.priority} />
            </div>
            
            {/* Project */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Project</span>
              <Link 
                href={`/projects/${task.project.id}`} 
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                {task.project.title}
              </Link>
            </div>
            
            {/* Assignee */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Assignee</span>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar name={task.assignee.name || task.assignee.email} size="sm" />
                  <span className="text-slate-900 font-medium">
                    {task.assignee.name || task.assignee.email}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 italic">Unassigned</span>
              )}
            </div>
            
            {/* Start Date */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Start Date</span>
              <span className="text-slate-900">
                {new Date(task.startDate).toLocaleDateString()}
              </span>
            </div>
            
            {/* Due Date */}
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Due Date</span>
              <span className={task.dueDate ? 'text-slate-900' : 'text-slate-400 italic'}>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Card */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comments
              {task.comments.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
                  {task.comments.length}
                </span>
              )}
            </h2>
          </div>
          
          {/* Add Comment Form */}
          <div className="p-6 border-b border-slate-100">
            <form onSubmit={handleAddComment}>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar 
                    name={session?.user?.name || session?.user?.email || 'User'} 
                    size="md" 
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="block w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!newComment.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Add Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="divide-y divide-slate-100">
            {task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div key={comment.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Avatar 
                        name={comment.author.name || comment.author.email} 
                        size="md" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-slate-900">
                          {comment.author.name || comment.author.email}
                        </h4>
                        <time className="text-xs text-slate-400">
                          {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                      </div>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-slate-500">No comments yet</p>
                <p className="text-sm text-slate-400 mt-1">Be the first to add a comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}