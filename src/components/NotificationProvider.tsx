'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationService } from '@/lib/notificationService';
import { authService } from '@/lib/authService';
import NotificationCenter from './NotificationCenter';

type Notification = {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  showNotificationCenter: () => void;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Connect to notification service
    notificationService.connect();

    // Check for authenticated user
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUserId(user.id);
    } else {
      // Use a default user ID if no user is authenticated
      // This allows the notification center to work even without authentication
      setCurrentUserId('1'); // Use user ID 1 as default (from seed data)
    }

    // Listen for notifications
    const handleNotification = (data: any) => {
      addNotification({
        type: data.type || 'info',
        message: data.message,
      });

      // Increment unread count
      setUnreadCount(prev => prev + 1);
    };

    notificationService.on('notification', handleNotification);

    return () => {
      notificationService.off('notification', handleNotification);
      notificationService.disconnect();
    };
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      ...notification,
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications

    // Auto-remove info notifications after 5 seconds
    if (notification.type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const showNotificationCenter = () => {
    console.log('Opening notification center, currentUserId:', currentUserId);
    setShowNotifications(true);
    // Reset unread count when opening notification center
    setUnreadCount(0);
  };

  const hideNotificationCenter = () => {
    setShowNotifications(false);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearNotifications,
      showNotificationCenter,
      unreadCount
    }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      {showNotifications && currentUserId && (
        <NotificationCenter
          userId={currentUserId}
          onClose={hideNotificationCenter}
        />
      )}
    </NotificationContext.Provider>
  );
}

function NotificationContainer({
  notifications,
  onRemove
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full rounded-lg shadow-lg p-4 transform transition-all duration-300 ${notification.type === 'success' ? 'bg-green-100 border border-green-200 dark:bg-green-900 dark:border-green-700' :
              notification.type === 'error' ? 'bg-red-100 border border-red-200 dark:bg-red-900 dark:border-red-700' :
                notification.type === 'warning' ? 'bg-yellow-100 border border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700' :
                  'bg-blue-100 border border-blue-200 dark:bg-blue-900 dark:border-blue-700'
            }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <div className={`flex-shrink-0 ${notification.type === 'success' ? 'text-green-600 dark:text-green-400' :
                  notification.type === 'error' ? 'text-red-600 dark:text-red-400' :
                    notification.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-blue-600 dark:text-blue-400'
                }`}>
                {notification.type === 'success' && (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'warning' && (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800 dark:text-green-200' :
                    notification.type === 'error' ? 'text-red-800 dark:text-red-200' :
                      notification.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                        'text-blue-800 dark:text-blue-200'
                  }`}>
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className={`ml-4 flex-shrink-0 ${notification.type === 'success' ? 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300' :
                  notification.type === 'error' ? 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' :
                    notification.type === 'warning' ? 'text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300' :
                      'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
                }`}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}