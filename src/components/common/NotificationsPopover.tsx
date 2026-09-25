// ProjectWatch: Notifications Popover
// Smart India Hackathon 2026

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { store } from '@/lib/database/store';
import { AppNotification } from '@/types';
import { Bell, CheckCheck, Clock, ShieldAlert, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/utils/formatters';

export const NotificationsPopover: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = () => {
    if (user) {
      setNotifications(store.getNotifications(user.id));
    }
  };

  useEffect(() => {
    loadNotifications();
    const unsubscribe = store.subscribe(() => {
      loadNotifications();
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    if (user) {
      store.markAllNotificationsRead(user.id);
      loadNotifications();
    }
  };

  const handleItemClick = (n: AppNotification) => {
    store.markNotificationRead(n.id);
    loadNotifications();
    setOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'RISK_ALERT':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'REPORT_STATUS':
      case 'ACTION_UPDATE':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`p-3 text-left transition-colors cursor-pointer flex gap-3 items-start hover:bg-slate-50 ${
                    !n.is_read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-md bg-white border border-slate-200 shadow-2xs shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs ${!n.is_read ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {formatDate(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 mt-2 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
