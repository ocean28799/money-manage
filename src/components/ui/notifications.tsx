'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoClose?: boolean;
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Simple notification store
let notificationStore: NotificationStore;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!notificationStore) {
      notificationStore = {
        notifications: [],
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
          };
          
          notificationStore.notifications.push(newNotification);
          setNotifications([...notificationStore.notifications]);
          
          // Auto-remove after duration
          if (notification.autoClose !== false) {
            setTimeout(() => {
              notificationStore.removeNotification(newNotification.id);
            }, notification.duration || 5000);
          }
        },
        removeNotification: (id) => {
          notificationStore.notifications = notificationStore.notifications.filter(n => n.id !== id);
          setNotifications([...notificationStore.notifications]);
        },
        clearAll: () => {
          notificationStore.notifications = [];
          setNotifications([]);
        },
      };
    }
    
    setNotifications([...notificationStore.notifications]);
  }, []);

  return {
    notifications,
    addNotification: notificationStore?.addNotification || (() => {}),
    removeNotification: notificationStore?.removeNotification || (() => {}),
    clearAll: notificationStore?.clearAll || (() => {}),
  };
}

export function NotificationCenter() {
  const { notifications, removeNotification, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return AlertTriangle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-3 mb-2 rounded-lg border transition-all duration-200 hover:shadow-md',
                          getTypeStyles(notification.type)
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2">
                            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {notification.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {notification.action && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              onClick={() => {
                                notification.action?.onClick();
                                removeNotification(notification.id);
                              }}
                              className="text-xs"
                            >
                              {notification.action.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Toast notifications that appear at the top of the screen
export function ToastContainer() {
  const { notifications, removeNotification } = useNotifications();
  
  // Only show first 3 notifications as toasts
  const toastNotifications = notifications.slice(0, 3);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastNotifications.map((notification) => {
        const Icon = (() => {
          switch (notification.type) {
            case 'success': return CheckCircle;
            case 'error': return AlertTriangle;
            case 'warning': return AlertTriangle;
            case 'info': return Info;
            default: return Bell;
          }
        })();

        return (
          <Card
            key={notification.id}
            className={cn(
              'w-80 animate-in slide-in-from-top-2 duration-300',
              notification.type === 'success' && 'border-green-200 bg-green-50',
              notification.type === 'error' && 'border-red-200 bg-red-50',
              notification.type === 'warning' && 'border-yellow-200 bg-yellow-50',
              notification.type === 'info' && 'border-blue-200 bg-blue-50'
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon className={cn(
                    'h-5 w-5 mt-0.5',
                    notification.type === 'success' && 'text-green-600',
                    notification.type === 'error' && 'text-red-600',
                    notification.type === 'warning' && 'text-yellow-600',
                    notification.type === 'info' && 'text-blue-600'
                  )} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNotification(notification.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Utility functions for creating notifications
export const notify = {
  success: (title: string, message: string, options?: Partial<Notification>) => {
    if (notificationStore) {
      notificationStore.addNotification({
        type: 'success',
        title,
        message,
        ...options,
      });
    }
  },
  error: (title: string, message: string, options?: Partial<Notification>) => {
    if (notificationStore) {
      notificationStore.addNotification({
        type: 'error',
        title,
        message,
        autoClose: false, // Keep error notifications until manually dismissed
        ...options,
      });
    }
  },
  warning: (title: string, message: string, options?: Partial<Notification>) => {
    if (notificationStore) {
      notificationStore.addNotification({
        type: 'warning',
        title,
        message,
        duration: 7000, // Show warnings longer
        ...options,
      });
    }
  },
  info: (title: string, message: string, options?: Partial<Notification>) => {
    if (notificationStore) {
      notificationStore.addNotification({
        type: 'info',
        title,
        message,
        ...options,
      });
    }
  },
};
