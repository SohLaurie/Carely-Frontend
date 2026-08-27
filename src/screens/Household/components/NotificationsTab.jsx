import React, { useState, useRef } from 'react';
import {
  Bell, Check, Archive, Trash2, ArchiveRestore, CheckCircle2, Wallet,
  Plus, Send, Paperclip, X, Reply, MessageSquare
} from 'lucide-react';

function ConfirmModal({ dialog, onClose }) {
  if (!dialog) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E2D9CF] p-6 w-full max-w-sm space-y-4">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <Trash2 size={22} className="text-red-600" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="font-bold text-base text-[#1C1A17]">{dialog.title}</h3>
          <p className="text-sm text-[#8A7E74] leading-relaxed">{dialog.message}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border-2 border-[#E2D9CF] rounded-xl text-sm font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] transition-all cursor-pointer">Cancel</button>
          <button onClick={dialog.onConfirm} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
}

function MessageModal({ title = "New Message", initialRecipient = "", initialSubject = "", onClose, onSend }) {
  const [recipient, setRecipient] = useState(initialRecipient);
  const [subject, setSubject]     = useState(initialSubject);
  const [body, setBody]           = useState('');
  const [attachments, setAttachments] = useState([]);
  const fileRef = useRef();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files].slice(0, 5));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !body.trim()) return;
    onSend({ recipient, subject, body, attachments });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl border border-[#E2D9CF] flex flex-col max-h-[90vh] rounded-t-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E4030]/20 bg-[#1E4030] rounded-t-2xl">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-white" />
            <h3 className="font-bold text-base text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSend} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 py-3 border-b border-[#F0EBE4] flex items-center gap-3">
              <span className="text-xs font-bold text-[#8A7E74] w-16 shrink-0 uppercase tracking-wide">To</span>
              <input type="text" required value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient name or email" className="flex-1 text-sm text-[#1C1A17] bg-transparent outline-none placeholder:text-[#C5BCBA]" />
            </div>
            <div className="px-5 py-3 border-b border-[#F0EBE4] flex items-center gap-3">
              <span className="text-xs font-bold text-[#8A7E74] w-16 shrink-0 uppercase tracking-wide">Subject</span>
              <input type="text" required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Message subject" className="flex-1 text-sm text-[#1C1A17] bg-transparent outline-none placeholder:text-[#C5BCBA]" />
            </div>
            <div className="px-5 py-4">
              <textarea required value={body} onChange={e => setBody(e.target.value)} placeholder="Write your message here..." rows={6} className="w-full text-sm text-[#1C1A17] bg-transparent outline-none placeholder:text-[#C5BCBA] resize-none leading-relaxed" />
            </div>
            {attachments.length > 0 && (
              <div className="px-5 pb-4 space-y-1.5">
                {attachments.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl px-3 py-2">
                    <Paperclip size={12} className="text-[#8A7E74] shrink-0" />
                    <span className="text-xs text-[#1C1A17] truncate flex-1">{f.name}</span>
                    <span className="text-[10px] text-[#8A7E74]">{(f.size/1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} className="text-[#8A7E74] hover:text-red-600 transition-colors cursor-pointer"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-5 py-4 border-t border-[#E2D9CF] bg-[#FAF8F5] flex items-center justify-between gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={attachments.length >= 5} className="flex items-center gap-1.5 text-xs font-semibold text-[#8A7E74] hover:text-[#1E4030] disabled:opacity-40 transition-colors cursor-pointer">
              <Paperclip size={14} />Attach {attachments.length > 0 && `(${attachments.length}/5)`}
            </button>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-[#8A7E74] hover:text-[#1C1A17] cursor-pointer">Discard</button>
              <button type="submit" className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
                <Send size={13} />Send
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

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
  clearNotifications,
  addMessageNotification,
  markAsReplied,
  openDiscussionWithCaregiver
}) {
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [modalConfig, setModalConfig] = useState(null); // { title, initialRecipient, initialSubject }

  const handleDelete = (id) => {
    setConfirmDialog({
      title: 'Delete Notification',
      message: 'Are you sure you want to delete this notification? This cannot be undone.',
      onConfirm: () => { deleteNotification(id); setConfirmDialog(null); },
    });
  };

  const handleClearAll = () => {
    setConfirmDialog({
      title: 'Clear All Notifications',
      message: 'This will permanently delete all notifications in the current view.',
      onConfirm: () => { clearNotifications(); setConfirmDialog(null); },
    });
  };

  const handleReplyClick = (n) => {
    if (markAsReplied) markAsReplied(n.id);
    setModalConfig({
      title: `Reply to ${n.recipient || n.title}`,
      initialRecipient: n.recipient || n.title,
      initialSubject: `Re: ${n.title}`,
    });
  };

  const tabs = [
    { id: 'all',      label: 'All',      count: notifications.filter(n => !n.archived).length },
    { id: 'unread',   label: 'Unread',   count: notifications.filter(n => n.unread && !n.archived).length },
    { id: 'archived', label: 'Archived', count: notifications.filter(n => n.archived).length },
    { id: 'reply',    label: 'Reply',    count: notifications.filter(n => n.replied || n.type === 'message').length },
  ];

  const filtered = notifications.filter(n => {
    if (notifFilter === 'unread')   return n.unread && !n.archived;
    if (notifFilter === 'archived') return n.archived;
    if (notifFilter === 'reply')    return n.replied || n.type === 'message';
    return !n.archived;
  });

  const getIcon = (type) => {
    if (type === 'accepted') return CheckCircle2;
    if (type === 'payment')  return Wallet;
    if (type === 'message')  return MessageSquare;
    return Bell;
  };

  const getIconStyle = (type) =>
    type === 'welcome' ? 'bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74]' :
    type === 'message' ? 'bg-blue-50 border border-blue-200 text-blue-600' :
    'bg-[#1E4030] text-white';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E4030]">Notifications</h2>
            <p className="text-sm text-[#8A7E74]">Stay updated on your care activity and messages.</p>
          </div>
        </div>
        <button
          onClick={() => setModalConfig({ title: "New Message", initialRecipient: "", initialSubject: "" })}
          className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer hover:shadow-md"
        >
          <Plus size={16} />New Message
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#E2D9CF]">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setNotifFilter(tab.id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${notifFilter === tab.id ? 'bg-[#1E4030] text-white shadow-sm' : 'text-[#8A7E74] hover:text-[#1C1A17] hover:bg-white'}`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold min-w-[16px] text-center ${notifFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white text-[#1E4030] border border-[#E2D9CF]'}`}>{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={markAllNotificationsRead} type="button" className="text-[11px] font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:border-[#D4C9BE]">
              <Check size={12} /><span>Mark all read</span>
            </button>
            <button onClick={archiveAllNotifications} type="button" className="text-[11px] font-bold text-[#8A7E74] hover:text-[#1C1A17] flex items-center gap-1 bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:border-[#D4C9BE]">
              <Archive size={12} /><span>Archive all</span>
            </button>
            <button onClick={handleClearAll} type="button" className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
              <Trash2 size={12} /><span>Clear all</span>
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(n => {
          const IconComponent = getIcon(n.type);
          return (
            <div key={n.id} className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all group ${n.unread ? 'border-[#1E4030]/20 bg-[#EDF7F2]/20' : 'border-[#E2D9CF]'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconStyle(n.type)}`}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`font-bold text-sm ${n.unread ? 'text-[#1C1A17]' : 'text-[#3A3634]'}`}>{n.title}</h4>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-[#1E4030]"></span>}
                    {n.type === 'message' && <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">Message</span>}
                  </div>
                  <p className="text-xs text-[#8A7E74] leading-relaxed">{n.text}</p>
                  {n.recipient && <p className="text-[10px] text-[#8A7E74]/70">To: {n.recipient}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-[#8A7E74] font-medium group-hover:hidden">{n.time}</span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    {/* Mark Read */}
                    <button onClick={() => readToggleNotification(n.id)} title={n.unread ? 'Mark as read' : 'Mark as unread'} className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:border-[#1E4030] transition-all cursor-pointer shadow-xs">
                      <Check size={12} className={n.unread ? 'text-[#1E4030]' : ''} />
                    </button>

                    {/* Go to Discussion Chat with that user */}
                    {openDiscussionWithCaregiver && (
                      <button
                        onClick={() => openDiscussionWithCaregiver(n.recipient || n.title)}
                        title="Chat in Discussions"
                        className="w-7 h-7 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-xs"
                      >
                        <MessageSquare size={12} />
                      </button>
                    )}

                    {/* Reply card popup */}
                    <button onClick={() => handleReplyClick(n)} title="Reply" className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:border-[#1E4030] transition-all cursor-pointer shadow-xs">
                      <Reply size={12} />
                    </button>

                    {/* Archive toggle */}
                    <button onClick={() => archiveToggleNotification(n.id)} title={n.archived ? 'Unarchive' : 'Archive'} className="w-7 h-7 rounded-full border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:border-[#C9C0B8] transition-all cursor-pointer shadow-xs">
                      {n.archived ? <ArchiveRestore size={12} /> : <Archive size={12} />}
                    </button>

                    {/* Delete */}
                    <button onClick={() => handleDelete(n.id)} title="Delete" className="w-7 h-7 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-xs">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center bg-white border border-[#E2D9CF] rounded-2xl">
            <Bell size={28} className="mx-auto text-[#8A7E74]/30 mb-3 animate-pulse" />
            <p className="text-sm font-bold text-[#8A7E74]">No notifications found</p>
            <p className="text-xs text-[#8A7E74]/70 mt-1">Your {notifFilter} folder is empty.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />

      {/* New Message / Reply Modal */}
      {modalConfig && (
        <MessageModal
          title={modalConfig.title}
          initialRecipient={modalConfig.initialRecipient}
          initialSubject={modalConfig.initialSubject}
          onClose={() => setModalConfig(null)}
          onSend={({ recipient, subject, body }) => {
            if (addMessageNotification) addMessageNotification({ recipient, subject, body });
          }}
        />
      )}
    </div>
  );
}
