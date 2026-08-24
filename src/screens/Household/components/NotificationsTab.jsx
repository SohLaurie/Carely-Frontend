import React from 'react';
import { Bell, Check, Archive, Trash2, ArchiveRestore, CheckCircle2, Wallet } from 'lucide-react';

export default function NotificationsTab({
  notifications,
  setNotifications,
  notifFilter,
  setNotifFilter,
  unreadCount,
  archiveToggleNotification,
  readToggleNotification,
  deleteNotification,
  markAllNotificationsRead,
  archiveAllNotifications,
  clearNotifications
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-5 pt-2">
      <h2 className="font-display text-xl font-bold text-[#1E4030]">Notifications</h2>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#FAF8F5] p-3 rounded-2xl border border-[#E2D9CF]">
        {/* Filters switcher */}
        <div className="flex gap-1 bg-white p-0.5 rounded-xl border border-[#E2D9CF]">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'archived', label: 'Archived' }
          ].map(tab => {
            const isActive = notifFilter === tab.id;
            const count = tab.id === 'unread'
              ? notifications.filter(n => n.unread && !n.archived).length
              : tab.id === 'archived'
              ? notifications.filter(n => n.archived).length
              : notifications.filter(n => !n.archived).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setNotifFilter(tab.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-secondary text-[#1E4030] border border-[#E2D9CF]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={markAllNotificationsRead}
            type="button"
            title="Mark all read"
            className="text-[10px] font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-white border border-[#E2D9CF] px-2.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Check size={11} />
            <span>Mark all read</span>
          </button>
          <button
            onClick={archiveAllNotifications}
            type="button"
            title="Archive all"
            className="text-[10px] font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-white border border-[#E2D9CF] px-2.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Archive size={11} />
            <span>Archive all</span>
          </button>
          <button
            onClick={clearNotifications}
            type="button"
            title="Clear all"
            className="text-[10px] font-bold text-red-650 hover:text-red-700 flex items-center gap-1 bg-white border border-[#E2D9CF] px-2.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Trash2 size={11} />
            <span>Clear all</span>
          </button>
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl divide-y divide-[#EFECE6] overflow-hidden shadow-sm">
        {notifications.filter(n => {
          if (notifFilter === 'unread') return n.unread && !n.archived;
          if (notifFilter === 'archived') return n.archived;
          return !n.archived;
        }).map(n => {
          const IconComponent =
            n.type === 'accepted' ? CheckCircle2 :
            n.type === 'payment' ? Wallet :
            Bell;

          const badgeStyle = n.type === 'welcome'
            ? 'bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74]'
            : 'bg-[#1E4030] text-white';

          return (
            <div key={n.id} className="p-4.5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5]/45 transition-all group">
              <div className="flex items-start gap-3.5">
                {/* Circular icon container */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${badgeStyle}`}>
                  <IconComponent size={15} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xs text-[#1C1A17]">{n.title}</h4>
                    {n.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D6F42]" title="Unread"></span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#8A7E74] leading-relaxed">{n.text}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Individual Action Menu */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                  <button
                    onClick={() => readToggleNotification(n.id)}
                    type="button"
                    title={n.unread ? "Mark as read" : "Mark as unread"}
                    className="w-6.5 h-6.5 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:bg-secondary transition-all shadow-xs cursor-pointer"
                  >
                    <Check size={11} className={n.unread ? "text-[#1D6F42]" : ""} />
                  </button>
                  <button
                    onClick={() => archiveToggleNotification(n.id)}
                    type="button"
                    title={n.archived ? "Send to Inbox" : "Archive"}
                    className="w-6.5 h-6.5 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:bg-secondary transition-all shadow-xs cursor-pointer"
                  >
                    {n.archived ? <ArchiveRestore size={11} /> : <Archive size={11} />}
                  </button>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    type="button"
                    title="Delete"
                    className="w-6.5 h-6.5 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-red-650 hover:text-red-700 hover:bg-red-50 transition-all shadow-xs cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>

                <span className="text-[10px] text-[#8A7E74] font-medium min-w-[50px] text-right group-hover:hidden">
                  {n.time}
                </span>
              </div>
            </div>
          );
        })}

        {notifications.filter(n => {
          if (notifFilter === 'unread') return n.unread && !n.archived;
          if (notifFilter === 'archived') return n.archived;
          return !n.archived;
        }).length === 0 && (
          <div className="p-12 text-center text-[#8A7E74] space-y-2">
            <Bell size={24} className="mx-auto text-[#8A7E74]/40 animate-pulse" />
            <p className="text-xs font-semibold">No notifications found</p>
            <p className="text-[10px]">Your {notifFilter} folder is currently empty.</p>
          </div>
        )}
      </div>

    </div>
  );
}
