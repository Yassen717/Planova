'use client';

import React, { useState, useEffect } from 'react';
import { notificationService } from '@/lib/notificationService';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  createdAt: string;
  entityId?: string;
  entityType?: string;
}

interface NotificationCenterProps {
  userId: string;
  onClose: () => void;
}

export default function NotificationCenter({ userId, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    // Listen for real-time notifications
    notificationService.on('sendNotification', handleRealTimeNotification);
    
    return () => {
      notificationService.off('sendNotification', handleRealTimeNotification);
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications?userId=${userId}&limit=20`);
      
      // Handle non-ok responses gracefully
      if (!response.ok) {
        // If unauthorized or forbidden, just show empty notifications
        if (response.status === 401 || response.status === 403) {
          setNotifications([]);
          setUnreadCount(0);
          return;
        }
        console.error('Failed to fetch notifications:', response.status);
        setNotifications([]);
        return;
      }
      
      const result = await response.json();
      if (!result.success) {
        console.error('API error:', result.error);
        setNotifications([]);
        return;
      }
      
      const formattedNotifications = (result.data || []).map((n: any) => ({
        id: n.id,
        type: n.type as 'info' | 'success' | 'warning' | 'error',
        message: n.message,
        read: n.read,
        createdAt: n.createdAt,
        entityId: n.entityId,
        entityType: n.entityType,
      }));
      
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRealTimeNotification = (data: any) => {
    if (data.userId === userId) {
      const newNotification: Notification = {
        id: data.id || Date.now().toString(),
        type: data.type,
        message: data.message,
        read: false,
        createdAt: data.timestamp,
        entityId: data.data?.entityId,
        entityType: data.data?.entityType,
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, read: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to mark notification as read');
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // For marking all as read, we'll need to update each notification individually
      // or implement a batch update endpoint
      const unreadNotifications = notifications.filter(n => !n.read);
      
      // Update each notification
      const updatePromises = unreadNotifications.map(notification => 
        fetch('/api/notifications', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: notification.id, read: true }),
        })
      );
      
      const responses = await Promise.all(updatePromises);
      
      // Check if all requests were successful
      const allSuccessful = responses.every(response => response.ok);
      if (!allSuccessful) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Call the API to delete the notification
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      
      // Update the UI state
      setNotifications(prev => prev.filter(n => n.id !== id));
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col ring-1 ring-slate-200/50 animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                <p className="text-xs text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Actions Bar */}
        {notifications.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm font-medium text-slate-600">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark all read
              </button>
            )}
          </div>
        )}
        
        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 p-6">
              <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-slate-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center p-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-5 ring-1 ring-slate-200/50">
                <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No notifications</h3>
              <p className="text-slate-500 text-sm max-w-[250px]">
                You&apos;re all caught up! We&apos;ll notify you when something important happens.
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {notifications.map((notification, index) => (
                <div 
                  key={notification.id} 
                  className={`group p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                    notification.read 
                      ? 'bg-white border-slate-100 hover:border-slate-200' 
                      : 'bg-gradient-to-r from-indigo-50/80 to-purple-50/50 border-indigo-100 hover:border-indigo-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${notification.read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                          title="Mark as read"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}