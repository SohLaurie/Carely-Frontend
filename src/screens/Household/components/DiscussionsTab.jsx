import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Search, Phone, Video, MoreVertical, Paperclip,
  Smile, Mic, Send, ArrowLeft, CheckCheck, Check, ShieldCheck,
  Clock, Plus, X, Image as ImageIcon, MapPin, Calendar, Heart,
  Trash2, AlertTriangle
} from 'lucide-react';
import { SPECIALTY_META } from '../../../data';

function DiscussionConfirmModal({ dialog, onClose }) {
  if (!dialog) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-[#E2D9CF] p-6 w-full max-w-sm space-y-4">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-600">
          <Trash2 size={22} />
        </div>
        <div className="text-center space-y-1.5">
          <h3 className="font-bold text-base text-[#1C1A17]">{dialog.title}</h3>
          <p className="text-xs text-[#8A7E74] leading-relaxed">{dialog.message}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#1C1A17] hover:bg-[#FAF8F5] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => { dialog.onConfirm(); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DiscussionsTab({
  discussions,
  activeDiscussionId,
  setActiveDiscussionId,
  sendMessage,
  deleteDiscussion,
  clearDiscussionChat,
  deleteMessage,
  onNavigate
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [callModal, setCallModal] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeDiscussion = discussions.find(d => d.id === activeDiscussionId);

  useEffect(() => {
    if (activeDiscussion) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeDiscussion?.messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;
    
    let text = inputText;
    if (selectedAttachment) {
      text = `[Attachment: ${selectedAttachment.name}] ${inputText}`;
      setSelectedAttachment(null);
    }

    sendMessage(activeDiscussionId, text);
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAttachment(file);
    }
  };

  const emojis = ['👋', '👍', '❤️', '😊', '🙏', '🏥', '👶', '✨', '🌿', '📍', '✅', '⏰'];

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  // Delete handlers with confirmation modals
  const promptDeleteDiscussion = (discussionId, e) => {
    e?.stopPropagation();
    setConfirmDialog({
      title: 'Delete Discussion Thread',
      message: 'Are you sure you want to permanently delete this discussion? All message history will be removed.',
      onConfirm: () => {
        if (deleteDiscussion) deleteDiscussion(discussionId);
      }
    });
  };

  const promptClearChat = () => {
    setHeaderMenuOpen(false);
    setConfirmDialog({
      title: 'Clear Conversation Messages',
      message: 'This will clear all messages in this chat. This action cannot be undone.',
      onConfirm: () => {
        if (clearDiscussionChat) clearDiscussionChat(activeDiscussionId);
      }
    });
  };

  const promptDeleteMessage = (messageId, e) => {
    e?.stopPropagation();
    setConfirmDialog({
      title: 'Delete Message',
      message: 'Do you want to delete this message?',
      onConfirm: () => {
        if (deleteMessage) deleteMessage(activeDiscussionId, messageId);
      }
    });
  };

  // Filter conversations
  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filter === 'unread') return (d.unreadCount || 0) > 0;
    if (filter === 'support') return d.caregiverId === 'support';
    if (filter === 'caregivers') return d.caregiverId !== 'support';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ─── Header when in List View ─── */}
      {!activeDiscussion && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1E4030]">Discussions</h2>
              <p className="text-sm text-[#8A7E74]">Real-time encrypted conversations with your care providers.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#EDF7F2] border border-green-200/60 text-[#1E4030] text-xs font-bold px-3.5 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Live messaging online</span>
          </div>
        </div>
      )}

      {/* ─── FULL-WIDTH CONVERSATION LIST (When no active chat) ─── */}
      {!activeDiscussion ? (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'caregivers', label: 'Caregivers' },
                { id: 'support', label: 'Support' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-[#1E4030] text-white shadow-sm'
                      : 'bg-[#FAF8F5] text-[#8A7E74] hover:text-[#1C1A17] border border-[#E2D9CF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full-width conversation cards */}
          <div className="space-y-3">
            {filteredDiscussions.map(d => {
              const lastMsg = d.messages[d.messages.length - 1];
              const meta = SPECIALTY_META[d.specialty] || { label: 'Support Concierge' };

              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDiscussionId(d.id)}
                  className="w-full bg-white border border-[#E2D9CF] hover:border-[#1E4030]/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shadow-sm">
                        <img src={d.photo} alt={d.name} className="w-full h-full object-cover" />
                      </div>
                      {d.status === 'online' && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    {/* Middle Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-[#1C1A17] group-hover:text-[#1E4030] transition-colors">
                            {d.name}
                          </h3>
                          <span className="text-[10px] bg-[#FAF8F5] text-[#8A7E74] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-semibold">
                            {meta.label}
                          </span>
                        </div>
                        <span className="text-xs text-[#8A7E74] font-medium shrink-0">
                          {lastMsg?.time || 'Today'}
                        </span>
                      </div>

                      {/* Last message preview with WhatsApp blue ticks */}
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-[#8A7E74] truncate flex items-center gap-1.5 flex-1">
                          {lastMsg?.sender === 'user' && (
                            <CheckCheck size={14} className="text-[#34B7F1] shrink-0" />
                          )}
                          <span className="truncate">{lastMsg?.text || 'No messages yet...'}</span>
                        </p>

                        <div className="flex items-center gap-2 shrink-0">
                          {d.unreadCount > 0 && (
                            <span className="bg-[#1E4030] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {d.unreadCount}
                            </span>
                          )}

                          {/* Delete Discussion Button */}
                          <button
                            type="button"
                            onClick={(e) => promptDeleteDiscussion(d.id, e)}
                            title="Delete Discussion"
                            className="w-8 h-8 rounded-full border border-transparent group-hover:border-red-200 group-hover:bg-red-50 text-[#8A7E74] group-hover:text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDiscussions.length === 0 && (
              <div className="bg-white border border-[#E2D9CF] rounded-2xl p-12 text-center space-y-3">
                <MessageSquare size={32} className="mx-auto text-[#8A7E74]/30 animate-pulse" />
                <h4 className="font-bold text-[#1C1A17]">No conversations found</h4>
                <p className="text-xs text-[#8A7E74]">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ─── WHATSAPP STYLE DISCUSSION PAGE ─── */
        <div className="w-full bg-white border border-[#E2D9CF] rounded-3xl shadow-xl overflow-hidden flex flex-col h-[750px] animate-fadeIn">
          {/* WhatsApp Header */}
          <div className="bg-[#1E4030] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveDiscussionId(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Back to all discussions"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="relative">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 shadow-sm">
                  <img src={activeDiscussion.photo} alt={activeDiscussion.name} className="w-full h-full object-cover" />
                </div>
                {activeDiscussion.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#1E4030] rounded-full"></span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-sm text-white leading-tight flex items-center gap-1.5">
                  {activeDiscussion.name}
                  <ShieldCheck size={14} className="text-[#A7D7C5]" />
                </h3>
                <p className="text-[11px] text-white/70">
                  {activeDiscussion.status === 'online' ? (
                    <span className="text-green-300 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      online
                    </span>
                  ) : (
                    activeDiscussion.lastSeen
                  )}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setCallModal('audio')}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Voice Call"
              >
                <Phone size={15} />
              </button>
              <button
                onClick={() => setCallModal('video')}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Video Call"
              >
                <Video size={16} />
              </button>

              {/* More options dropdown */}
              <div className="relative">
                <button
                  onClick={() => setHeaderMenuOpen(prev => !prev)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <MoreVertical size={16} />
                </button>

                {headerMenuOpen && (
                  <div className="absolute right-0 top-11 w-44 bg-white border border-[#E2D9CF] rounded-2xl shadow-2xl py-1.5 z-50 text-[#1C1A17] animate-fadeIn">
                    <button
                      onClick={() => { setHeaderMenuOpen(false); onNavigate && onNavigate('booking', { caregiver: activeDiscussion }); }}
                      className="w-full px-4 py-2 text-xs font-semibold hover:bg-[#FAF8F5] text-left flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar size={13} className="text-[#1E4030]" />
                      Book Session
                    </button>
                    <button
                      onClick={promptClearChat}
                      className="w-full px-4 py-2 text-xs font-semibold hover:bg-amber-50 text-amber-800 text-left flex items-center gap-2 cursor-pointer"
                    >
                      <AlertTriangle size={13} />
                      Clear Chat History
                    </button>
                    <button
                      onClick={() => { setHeaderMenuOpen(false); promptDeleteDiscussion(activeDiscussion.id); }}
                      className="w-full px-4 py-2 text-xs font-semibold hover:bg-red-50 text-red-600 text-left flex items-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Delete Discussion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp Message Canvas */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F5F2EB]/60 bg-[radial-gradient(#E2D9CF_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Encryption pill */}
            <div className="flex justify-center">
              <span className="bg-[#FFFBEB] border border-amber-200/80 text-amber-900 text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 text-center max-w-md">
                <span>🔒</span> Messages & calls are end-to-end secured via Carely Trust Escrow.
              </span>
            </div>

            {/* Date Separator */}
            <div className="flex justify-center my-2">
              <span className="bg-white/80 border border-[#E2D9CF] text-[#8A7E74] text-[10px] font-bold px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                Today
              </span>
            </div>

            {/* Messages Loop with Per-Message Delete */}
            {activeDiscussion.messages.map((m, idx) => {
              const isUser = m.sender === 'user';

              return (
                <div key={m.id || idx} className={`flex items-end gap-2 group ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {/* Delete individual message button (left for sent, right for received) */}
                  {isUser && (
                    <button
                      onClick={(e) => promptDeleteMessage(m.id, e)}
                      title="Delete message"
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white border border-[#E2D9CF] text-[#8A7E74] hover:text-red-600 hover:border-red-300 flex items-center justify-center transition-all cursor-pointer shadow-xs mb-1"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm transition-all relative ${
                      isUser
                        ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs border border-[#C5E8BF]'
                        : 'bg-white text-[#111B21] rounded-tl-xs border border-[#E2D9CF]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className="text-[9px] text-[#667781] font-medium">{m.time}</span>
                      {isUser && (
                        <CheckCheck size={13} className="text-[#34B7F1]" title="Read" />
                      )}
                    </div>
                  </div>

                  {!isUser && (
                    <button
                      onClick={(e) => promptDeleteMessage(m.id, e)}
                      title="Delete message"
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-white border border-[#E2D9CF] text-[#8A7E74] hover:text-red-600 hover:border-red-300 flex items-center justify-center transition-all cursor-pointer shadow-xs mb-1"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              );
            })}

            {activeDiscussion.messages.length === 0 && (
              <div className="py-16 text-center text-[#8A7E74]">
                <MessageSquare size={28} className="mx-auto mb-2 text-[#8A7E74]/30" />
                <p className="text-xs font-semibold">No messages yet in this conversation.</p>
                <p className="text-[10px] mt-0.5">Send a message below to start chatting!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Care Action Chips */}
          <div className="px-4 py-2 bg-white border-t border-[#E2D9CF] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider shrink-0">Quick reply:</span>
            {[
              '📍 Send address: Bastos, Yaounde',
              '⏰ Yes, 09:00 works for me',
              '💊 Prescription booklet is ready',
              '💳 Escrow payment is funded',
            ].map(pill => (
              <button
                key={pill}
                onClick={() => sendMessage(activeDiscussionId, pill)}
                className="bg-[#FAF8F5] hover:bg-[#EDF7F2] text-[#1E4030] border border-[#E2D9CF] hover:border-green-300 text-[11px] font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Selected Attachment Preview */}
          {selectedAttachment && (
            <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#E2D9CF] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#1C1A17]">
                <ImageIcon size={14} className="text-[#1E4030]" />
                <span className="font-semibold truncate max-w-xs">{selectedAttachment.name}</span>
                <span className="text-[10px] text-[#8A7E74]">({(selectedAttachment.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button
                onClick={() => setSelectedAttachment(null)}
                className="text-[#8A7E74] hover:text-red-600 transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <div className="p-3 bg-[#FAF8F5] border-t border-[#E2D9CF] flex items-center gap-2 flex-wrap">
              {emojis.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => addEmoji(e)}
                  className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  {e}
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp Bottom Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-[#F0F2F5] border-t border-[#E2D9CF] flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className="w-10 h-10 rounded-full hover:bg-white text-[#54656F] hover:text-[#1C1A17] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Add Emoji"
            >
              <Smile size={20} />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full hover:bg-white text-[#54656F] hover:text-[#1C1A17] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Attach Document or Image"
            >
              <Paperclip size={19} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />

            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 bg-white border border-[#E2D9CF] rounded-2xl px-4 py-2.5 text-xs text-[#1C1A17] outline-none focus:ring-1 focus:ring-[#1E4030] shadow-xs"
            />

            {inputText.trim() || selectedAttachment ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#1E4030] hover:bg-[#152e22] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0"
              >
                <Send size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setInputText('🎙️ [Voice note: 0:14]')}
                className="w-10 h-10 rounded-full hover:bg-white text-[#54656F] hover:text-[#1E4030] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Voice Note"
              >
                <Mic size={19} />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      <DiscussionConfirmModal
        dialog={confirmDialog}
        onClose={() => setConfirmDialog(null)}
      />

      {/* Call Simulation Modal */}
      {callModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1E4030] text-white rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-sm text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                <img src={activeDiscussion?.photo} alt={activeDiscussion?.name} className="w-full h-full object-cover" />
              </div>
              <span className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-50"></span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{activeDiscussion?.name}</h3>
              <p className="text-xs text-white/70 mt-1">
                {callModal === 'video' ? 'Carely Encrypted Video Call...' : 'Carely Encrypted Audio Call...'}
              </p>
              <p className="text-xs text-green-300 font-semibold mt-2 animate-pulse">Ringing...</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setCallModal(null)}
                className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
              >
                <Phone size={22} className="rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
