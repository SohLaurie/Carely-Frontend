import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Search, Phone, Video, MoreVertical, Paperclip,
  Smile, Mic, Send, ArrowLeft, CheckCheck, Check, ShieldCheck,
  Clock, Plus, X, Image as ImageIcon, MapPin, Calendar, Heart,
  Trash2, AlertTriangle
} from 'lucide-react';

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

export default function DiscussionTab({
  discussions: initialDiscussions,
  onNavigate
}) {
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [activeDiscussionId, setActiveDiscussionId] = useState(initialDiscussions[0]?.id || null);
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

  const sendMessage = (discussionId, text) => {
    const timeStr = new Date().toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Add user message
    setDiscussions(prev => prev.map(d => {
      if (d.id === discussionId) {
        return {
          ...d,
          messages: [
            ...d.messages,
            { id: 'm_new_' + Date.now(), sender: 'caregiver', text, time: timeStr, date: 'Today', status: 'delivered' }
          ]
        };
      }
      return d;
    }));

    // Trigger auto-reply simulation
    setTimeout(() => {
      let replyText = "Thank you for the message. I will check the schedule details and get back to you shortly!";
      if (discussionId === 'D4') {
        replyText = "Our support concierge is currently online. Your ticket has been logged and we will resolve it within 10 minutes.";
      } else if (discussionId === 'D1') {
        replyText = "Sounds good Marie-Claire, see you then! Feel free to ask if you need anything else.";
      }

      setDiscussions(prev => prev.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            messages: [
              ...d.messages,
              { id: 'm_reply_' + Date.now(), sender: 'user', text: replyText, time: timeStr, date: 'Today', status: 'read' }
            ]
          };
        }
        return d;
      }));
    }, 2000);
  };

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

  const promptDeleteDiscussion = (discussionId, e) => {
    e?.stopPropagation();
    setConfirmDialog({
      title: 'Delete Discussion',
      message: 'Are you sure you want to permanently delete this conversation and all its history? This action cannot be undone.',
      onConfirm: () => {
        setDiscussions(prev => prev.filter(d => d.id !== discussionId));
        if (activeDiscussionId === discussionId) {
          const remaining = discussions.filter(d => d.id !== discussionId);
          setActiveDiscussionId(remaining[0]?.id || null);
        }
      }
    });
  };

  const promptClearChat = () => {
    setHeaderMenuOpen(false);
    setConfirmDialog({
      title: 'Clear Chat History',
      message: 'Are you sure you want to clear all messages in this discussion? The conversation header will remain.',
      onConfirm: () => {
        setDiscussions(prev => prev.map(d => {
          if (d.id === activeDiscussionId) {
            return { ...d, messages: [], unreadCount: 0 };
          }
          return d;
        }));
      }
    });
  };

  const deleteMessage = (discussionId, messageId) => {
    setDiscussions(prev => prev.map(d => {
      if (d.id === discussionId) {
        return { ...d, messages: d.messages.filter(m => m.id !== messageId) };
      }
      return d;
    }));
  };

  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filter === 'unread') return d.unreadCount > 0;
    return true;
  });

  return (
    <div className="bg-white border border-[#E2D9CF] rounded-3xl overflow-hidden shadow-sm flex h-[78vh] animate-fadeIn">
      {/* 1. DISCUSSIONS SIDEBAR */}
      <div className={`w-full md:w-[350px] border-r border-[#F0EBE5] flex flex-col ${activeDiscussionId ? 'hidden md:flex' : 'flex'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#F0EBE5] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-lg text-[#1C1A17]">Discussions</h2>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#8A7E74] bg-[#F7F5F2] border border-[#E2D9CF] px-2.5 py-1 rounded-full">
                {discussions.reduce((sum, d) => sum + d.unreadCount, 0)} Unread
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
            <input
              type="text"
              placeholder="Search chat or message…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl pl-9 pr-4 py-2 text-xs text-[#1C1A17] placeholder:text-[#8A7E74] focus:outline-none focus:border-[#2D6A4F] transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                filter === 'all'
                  ? 'bg-[#1E4030] text-white'
                  : 'bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74] hover:text-[#1C1A17]'
              }`}
            >
              All chats
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all ${
                filter === 'unread'
                  ? 'bg-[#1E4030] text-white'
                  : 'bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74] hover:text-[#1C1A17]'
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Sidebar List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#FAF8F5]/30">
          {filteredDiscussions.map(disc => {
            const isActive = disc.id === activeDiscussionId;
            const lastMsg = disc.messages[disc.messages.length - 1];

            return (
              <div
                key={disc.id}
                onClick={() => {
                  setActiveDiscussionId(disc.id);
                  // Mark as read
                  setDiscussions(prev => prev.map(d => d.id === disc.id ? { ...d, unreadCount: 0 } : d));
                }}
                className={`p-3 rounded-2xl flex gap-3 cursor-pointer transition-all relative border ${
                  isActive
                    ? 'bg-white border-[#2D6A4F] shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-white/60 hover:border-[#E2D9CF]/40'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={disc.photo}
                    alt={disc.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-[#E2D9CF]"
                  />
                  {disc.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-xs text-[#1C1A17] truncate">{disc.name}</h3>
                    <span className="text-[9px] text-[#8A7E74] font-medium">{lastMsg?.time || ''}</span>
                  </div>
                  <p className="text-[10px] text-[#8A7E74] truncate pr-4">
                    {lastMsg ? lastMsg.text : 'No messages yet'}
                  </p>
                </div>

                {/* Badge / Options */}
                <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
                  {disc.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-[#1D6F42] text-white font-black text-[9px] flex items-center justify-center rounded-full">
                      {disc.unreadCount}
                    </span>
                  )}
                  <button
                    onClick={(e) => promptDeleteDiscussion(disc.id, e)}
                    className="text-[#8A7E74] hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredDiscussions.length === 0 && (
            <div className="p-8 text-center space-y-2">
              <MessageSquare size={24} className="mx-auto text-[#C5BEB7]" />
              <p className="text-xs text-[#8A7E74] font-medium">No discussions found</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. CHAT PANEL */}
      {activeDiscussion ? (
        <div className="flex-1 flex flex-col bg-[#FAF8F5]/20">
          {/* Chat Header */}
          <div className="p-4 border-b border-[#F0EBE5] bg-white flex items-center justify-between shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveDiscussionId(null)}
                className="md:hidden p-1.5 hover:bg-[#F7F5F2] rounded-xl text-[#1C1A17]"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="relative">
                <img
                  src={activeDiscussion.photo}
                  alt={activeDiscussion.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-[#E2D9CF]"
                />
                {activeDiscussion.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-xs md:text-sm text-[#1C1A17]">{activeDiscussion.name}</h3>
                <p className="text-[9px] text-[#8A7E74] font-medium">{activeDiscussion.lastSeen}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCallModal({ type: 'voice', target: activeDiscussion })}
                className="p-2 hover:bg-[#F7F5F2] rounded-xl text-[#2D6A4F] transition-all cursor-pointer"
              >
                <Phone size={15} />
              </button>
              <button
                onClick={() => setCallModal({ type: 'video', target: activeDiscussion })}
                className="p-2 hover:bg-[#F7F5F2] rounded-xl text-[#2D6A4F] transition-all cursor-pointer"
              >
                <Video size={15} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
                  className="p-2 hover:bg-[#F7F5F2] rounded-xl text-[#8A7E74] transition-all cursor-pointer"
                >
                  <MoreVertical size={15} />
                </button>
                {headerMenuOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-[#E2D9CF] rounded-2xl shadow-xl py-1.5 z-20 text-xs">
                    <button
                      onClick={promptClearChat}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] text-red-600 font-semibold"
                    >
                      Clear Chat History
                    </button>
                    <button
                      onClick={() => setHeaderMenuOpen(false)}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF8F5] text-[#5A5248]"
                    >
                      Close Menu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-[#FAF8F5]/30">
            {activeDiscussion.messages.map((msg, i, arr) => {
              const isCaregiver = msg.sender === 'caregiver';
              const showDateHeader = i === 0 || msg.date !== arr[i - 1].date;

              return (
                <div key={msg.id} className="space-y-2">
                  {showDateHeader && (
                    <div className="flex justify-center my-3">
                      <span className="bg-[#E2D9CF]/40 border border-[#E2D9CF]/70 text-[#5A5248] text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                        {msg.date}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isCaregiver ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] space-y-1 ${isCaregiver ? 'order-1' : 'order-2'}`}>
                      <div
                        className={`p-3.5 rounded-2xl relative group ${
                          isCaregiver
                            ? 'bg-[#1E4030] text-white rounded-tr-none'
                            : 'bg-white border border-[#E2D9CF]/75 text-[#1C1A17] rounded-tl-none'
                        }`}
                      >
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        
                        {/* Hover message delete */}
                        <button
                          onClick={() => deleteMessage(activeDiscussion.id, msg.id)}
                          className="absolute -top-2 -right-2 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-red-200 shadow-sm"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      
                      <div className={`flex items-center gap-1.5 text-[9px] text-[#8A7E74] ${isCaregiver ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.time}</span>
                        {isCaregiver && (
                          msg.status === 'read'
                            ? <CheckCheck size={11} className="text-emerald-500" />
                            : <Check size={11} className="text-[#8A7E74]/70" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Footer Input */}
          <div className="p-4 border-t border-[#F0EBE5] bg-white relative">
            {/* Attachment preview */}
            {selectedAttachment && (
              <div className="absolute left-4 bottom-20 bg-[#F7F5F2] border border-[#E2D9CF] rounded-2xl p-2.5 flex items-center gap-2.5 shadow-lg animate-fadeIn z-10">
                <ImageIcon size={16} className="text-[#1D6F42]" />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-[#1C1A17] max-w-[150px] truncate">{selectedAttachment.name}</p>
                  <p className="text-[8px] text-[#8A7E74]">{(selectedAttachment.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => setSelectedAttachment(null)}
                  className="p-1 hover:bg-[#FAF8F5] rounded-lg text-[#8A7E74]"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Emoji picker menu */}
            {showEmojiPicker && (
              <div className="absolute left-4 bottom-20 bg-white border border-[#E2D9CF] rounded-3xl p-3.5 shadow-xl flex gap-2.5 z-10 max-w-sm flex-wrap animate-fadeIn">
                {emojis.map(e => (
                  <button
                    key={e}
                    onClick={() => addEmoji(e)}
                    className="text-base hover:scale-125 transition-transform p-1 cursor-pointer"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2.5">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 hover:bg-[#F7F5F2] rounded-xl text-[#8A7E74] transition-all cursor-pointer"
              >
                <Paperclip size={15} />
              </button>

              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2.5 hover:bg-[#F7F5F2] rounded-xl text-[#8A7E74] transition-all cursor-pointer"
              >
                <Smile size={15} />
              </button>

              <input
                type="text"
                placeholder="Type your message…"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl px-4 py-2.5 text-xs text-[#1C1A17] placeholder:text-[#8A7E74] focus:outline-none focus:border-[#2D6A4F] transition-all"
              />

              <button
                type="submit"
                className="p-2.5 bg-[#1D6F42] hover:bg-[#155231] text-white rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F5]/10 space-y-4">
          <div className="w-16 h-16 bg-[#F7F5F2] rounded-3xl flex items-center justify-center text-[#8A7E74] border border-[#E2D9CF]">
            <MessageSquare size={28} />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <h3 className="font-bold text-sm text-[#1C1A17]">No chat selected</h3>
            <p className="text-xs text-[#8A7E74]">Click on a client or support conversation in the sidebar list to start chatting.</p>
          </div>
        </div>
      )}

      {/* 3. SIMULATED CALL MODAL */}
      {callModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0F1A14]/90 backdrop-blur-md animate-fadeIn text-white">
          <div className="space-y-8 text-center w-full max-w-xs">
            <div className="space-y-4">
              <div className="relative inline-block mx-auto">
                <img
                  src={callModal.target.photo}
                  alt={callModal.target.name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-white/20 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#0F1A14] flex items-center justify-center">
                  <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg font-display">{callModal.target.name}</h3>
                <p className="text-xs text-white/60 mt-1 capitalize">{callModal.type} call ringing…</p>
              </div>
            </div>

            {callModal.type === 'video' && (
              <div className="aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden text-xs text-white/40 font-medium">
                Camera starting...
              </div>
            )}

            <div className="flex justify-center gap-6">
              <button
                onClick={() => setCallModal(null)}
                className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer text-white"
              >
                <X size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modals */}
      <DiscussionConfirmModal dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
    </div>
  );
}
