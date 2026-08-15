import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../services/apis/notificationApi';
import type { NotificationItem } from '../../interfaces/notification';
import { Bell, Info, AlertTriangle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { Popover, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (withAnimation = false) => {
    if (withAnimation) setRefreshing(true);
    try {
      const items = await notificationApi.getMyNotifications(false);
      setNotifications(items || []);
    } catch {
      // Silent catch
    } finally {
      if (withAnimation) {
        setTimeout(() => setRefreshing(false), 600);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(false), 15000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await fetchNotifications(true);
  };

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await notificationApi.markAsRead(id);
      await fetchNotifications(false);
      if (link) {
        setOpen(false);
        navigate(link);
      }
    } catch {
      // Silent catch
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      await fetchNotifications(false);
    } catch {
      // Silent catch
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500 shrink-0" />;
      case 'error':
        return <XCircle size={16} className="text-rose-500 shrink-0" />;
      default:
        return <Info size={16} className="text-zinc-700 shrink-0" />;
    }
  };

  const content = (
    <div className="w-80 max-h-96 flex flex-col text-xs">
      <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1 rounded-md text-slate-500 hover:text-black hover:bg-slate-200/70 transition-all disabled:opacity-50"
            title="Refresh notifications"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-black' : ''} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-slate-900 hover:text-black"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div
              key={item._id}
              onClick={() => handleMarkAsRead(item._id, item.link)}
              className={`p-3 cursor-pointer transition-colors flex items-start gap-2.5 ${
                item.isRead ? 'bg-white hover:bg-slate-50 opacity-75' : 'bg-slate-100/70 hover:bg-slate-100 font-medium'
              }`}
            >
              {renderIcon(item.type)}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 truncate">{item.title}</div>
                <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.message}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-slate-400 italic">No notifications</div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="p-0"
    >
      <button className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none">
        <Badge count={unreadCount} size="small" offset={[-2, 2]}>
          <Bell size={18} />
        </Badge>
      </button>
    </Popover>
  );
};
