"use client";

import { useEffect } from "react";


import { Bell, Loader2, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { fetchNotifications, markNotificationRead, selectAllNotifications, selectUnreadCount } from "@/app/store/notificationSlice";

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectAllNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  const loading = useAppSelector((state) => state.notifications.loading);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Bell size={28} className="text-primary" />
          Notifications
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </h1>
      </div>

      <div className="space-y-3 max-w-2xl">
        {notifications.length === 0 ? (
          <p className="text-text-secondary text-center py-10">
            No notifications yet.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && dispatch(markNotificationRead(n.id))}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                n.read
                  ? "bg-surface-elevated/50 border-border opacity-60"
                  : "bg-surface-elevated border-primary/30 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {n.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {n.content}
                  </p>
                  <span className="text-[10px] text-text-secondary mt-2 block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1" />
                )}
                {n.read && <Check size={16} className="text-green-500 flex-shrink-0" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}