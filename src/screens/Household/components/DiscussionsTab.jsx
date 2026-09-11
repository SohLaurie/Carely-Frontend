import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Search, Phone, Video, MoreVertical, Paperclip,
  Smile, Mic, Send, ArrowLeft, CheckCheck, Check, ShieldCheck,
  Clock, Plus, X, Image as ImageIcon, MapPin, Calendar, Heart,
  Trash2, AlertTriangle, FileText, Download, Loader2, User, Sparkles,
  Users, HelpCircle
} from 'lucide-react';
import { SPECIALTY_META } from '../../../data';
import { uploadChatFile, getOrCreateDiscussion, fetchContacts } from '../../../services/discussionApi';
import { apiGet } from '../../../services/api';

function DiscussionConfirmModal({ dialog, onClose }) {
  if (!dialog) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
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

// Lightbox Modal for Fullscreen Image View
function ImageLightboxModal({ imageUrl, imageName, onClose }) {
  if (!imageUrl) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between w-full pb-3 px-2 text-white">
          <span className="text-xs font-medium truncate max-w-sm text-white/80">{imageName || 'Image preview'}</span>
          <div className="flex items-center gap-3">
            <a
              href={imageUrl}
              download={imageName || 'image'}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Download image"
            >
              <Download size={18} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <img
          src={imageUrl}
          alt={imageName || 'Preview'}
          className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
        />
      </div>
    </div>
  );
}

export default function DiscussionsTab({
  discussions = [],
  activeDiscussionId,
  setActiveDiscussionId,
  sendMessage,
  deleteDiscussion,
  clearDiscussionChat,
  deleteMessage,
  onNavigate,
  openDiscussionWithCaregiver
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'providers' | 'support'
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [callModal, setCallModal] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  // Registered contacts (clients & providers) from backend
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeDiscussion = discussions.find(d => d.id === activeDiscussionId);

  // Load real registered contacts (clients and providers) so users can start conversations
  useEffect(() => {
    let isMounted = true;
    const loadContacts = async () => {
      try {
        setLoadingContacts(true);
        const list = await fetchContacts();
        if (!isMounted) return;
        if (Array.isArray(list) && list.length > 0) {
          setContacts(list);
        } else {
          // Fallback to /providers
          const data = await apiGet('/providers');
          if (!isMounted) return;
          const fallbackList = (data?.providers || []).map(p => ({
            id: p.id,
            userId: p.id,
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Care Provider',
            firstName: p.first_name,
            lastName: p.last_name,
            role: 'provider',
            profession: p.profession || (Array.isArray(p.specialties) ? p.specialties[0] : p.specialties) || 'Care Provider',
            specialty: (p.specialties && p.specialties[0]) || p.profession || 'cleaning',
            location: p.location || p.city || 'Yaoundé',
            pricePerHour: p.price_per_hour || 50,
            rating: Number(p.rating || 5.0).toFixed(1),
            photo: p.photo_url || null,
            initials: `${p.first_name?.[0] || 'N'}${p.last_name?.[0] || 'Z'}`.toUpperCase(),
            isAvailable: p.is_available !== false,
            approvalStatus: p.approval_status
          }));
          setContacts(fallbackList);
        }
      } catch (err) {
        console.warn('Could not load contacts for discussions:', err.message);
      } finally {
        if (isMounted) setLoadingContacts(false);
      }
    };
    loadContacts();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (activeDiscussion) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeDiscussion?.messages, activeDiscussionId]);

  // Clean up object URL when attachment changes
  useEffect(() => {
    if (!selectedAttachment) {
      setAttachmentPreview(null);
      return;
    }
    if (selectedAttachment.type && selectedAttachment.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedAttachment);
      setAttachmentPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAttachmentPreview(null);
    }
  }, [selectedAttachment]);

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedAttachment(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;
    if (isUploading) return;

    let attachmentData = null;

    if (selectedAttachment) {
      try {
        setIsUploading(true);
        const uploaded = await uploadChatFile(selectedAttachment);
        attachmentData = {
          attachmentUrl: uploaded.url,
          attachmentName: uploaded.originalName,
          attachmentType: uploaded.type,
          attachmentSize: uploaded.size,
          attachmentMime: uploaded.mimetype
        };
      } catch (err) {
        alert('Failed to upload file: ' + (err.message || 'Please try again'));
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const textToSend = inputText.trim();
    sendMessage(activeDiscussionId, textToSend, attachmentData);

    setInputText('');
    setSelectedAttachment(null);
    setAttachmentPreview(null);
    setShowEmojiPicker(false);
  };

  const emojis = ['👋', '👍', '❤️', '😊', '🙏', '🏥', '👶', '✨', '🌿', '📍', '✅', '⏰'];

  const addEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  // Start chat with a contact (e.g. client or provider)
  const handleStartChatWithContact = async (contact) => {
    const contactId = contact.userId || contact.id;
    // 1. If conversation already exists in active discussions, open it
    const existing = discussions.find(d => 
      (contactId && (d.caregiverId === contactId || d.participantId === contactId || d.id === contactId)) ||
      (d.name && contact.name && d.name.toLowerCase().includes(contact.name.toLowerCase()))
    );

    if (existing) {
      setActiveDiscussionId(existing.id);
      return;
    }

    // 2. If parent has openDiscussionWithCaregiver
    if (openDiscussionWithCaregiver) {
      await openDiscussionWithCaregiver(contact);
      return;
    }

    // 3. Fallback to API getOrCreateDiscussion
    try {
      const conv = await getOrCreateDiscussion(contactId);
      if (conv) {
        setActiveDiscussionId(conv.id);
      }
    } catch (err) {
      console.error('Failed to start chat with contact:', err);
    }
  };
  const handleStartChatWithProvider = handleStartChatWithContact;

  // Delete handlers with confirmation modals
  const promptDeleteDiscussion = (discussionId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
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
    if (e && e.stopPropagation) e.stopPropagation();
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
    const dName = d.name || 'Conversation';
    const matchesSearch = dName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.messages || []).some(m => (m.text || '').toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filter === 'unread') return (d.unreadCount || 0) > 0;
    if (filter === 'support') return d.caregiverId === 'support';
    if (filter === 'clients') return d.role === 'client';
    if (filter === 'providers') return d.role === 'provider' || (!d.role && d.caregiverId !== 'support');
    return true;
  });

  // Filter contacts for search or Clients / Providers tabs
  const filteredContacts = contacts.filter(c => {
    if (filter === 'clients' && c.role !== 'client') return false;
    if (filter === 'providers' && c.role !== 'provider') return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.profession && c.profession.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.role && c.role.toLowerCase().includes(q))
    );
  });
  const filteredProviders = filteredContacts;

  const getDocBadgeColor = (filename = '') => {
    const ext = filename.split('.').pop() && filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'bg-red-500 text-white';
    if (['doc', 'docx'].includes(ext)) return 'bg-blue-500 text-white';
    if (['xls', 'xlsx'].includes(ext)) return 'bg-emerald-600 text-white';
    return 'bg-amber-600 text-white';
  };

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
              <p className="text-sm text-[#8A7E74]">Real-time encrypted conversations with clients and providers.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#EDF7F2] border border-green-200/60 text-[#1E4030] text-xs font-bold px-3.5 py-2 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live messaging online
          </div>
        </div>
      )}

      {/* ─── List of Discussions & Providers (WhatsApp Inbox Style) ─── */}
      {!activeDiscussion && (
        <div className="bg-white rounded-3xl border border-[#E2D9CF] shadow-sm overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-[#E2D9CF] bg-[#FAF8F5] flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
              <input
                type="text"
                placeholder="Search conversations, clients, providers or messages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E2D9CF] rounded-2xl text-xs text-[#1C1A17] outline-none focus:ring-1 focus:ring-[#1E4030] shadow-2xs"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'clients', label: 'Clients' },
                { id: 'providers', label: 'Providers' },
                { id: 'support', label: 'Support' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={'px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ' + (
                    filter === tab.id
                      ? 'bg-[#1E4030] text-white shadow-xs'
                      : 'bg-white text-[#8A7E74] hover:bg-[#F0EBE4] border border-[#E2D9CF]'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* If viewing 'providers' or 'clients' tab OR searching: show matching contacts */}
          {(filter === 'providers' || filter === 'clients' || searchQuery.trim().length > 0) && (
            <div className="p-4 bg-[#F5F8F6] border-b border-[#E2D9CF]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#1E4030] uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={14} />
                  {filter === 'clients' ? 'Verified Clients' : (filter === 'providers' ? 'Verified Care Providers' : 'Contacts & Profiles')} {searchQuery.trim() ? 'Matching Search' : ''} ({filteredContacts.length})
                </span>
                <span className="text-[11px] text-[#8A7E74]">Click any profile to start chatting</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredContacts.map(contact => {
                  const contactId = contact.userId || contact.id;
                  const hasExistingChat = discussions.some(d => 
                    d.caregiverId === contactId || 
                    d.participantId === contactId || 
                    (d.name && d.name.toLowerCase().includes(contact.name.toLowerCase()))
                  );
                  const isClient = contact.role === 'client';

                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleStartChatWithContact(contact)}
                      className="p-3 bg-white hover:bg-[#EDF7F2] border border-[#E2D9CF] hover:border-green-300 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          {contact.photo ? (
                            <img src={contact.photo} alt={contact.name} className="w-11 h-11 rounded-xl object-cover border border-[#E2D9CF]" />
                          ) : (
                            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold text-xs ${
                              isClient ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-[#EDF7F2] border-green-200 text-[#1E4030]'
                            }`}>
                              {contact.initials}
                            </div>
                          )}
                          <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            contact.isAvailable !== false ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#1C1A17] truncate flex items-center gap-1.5">
                            {contact.name}
                            {isClient ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                Client
                              </span>
                            ) : (
                              <ShieldCheck size={12} className="text-green-600 shrink-0" />
                            )}
                          </h4>
                          <p className="text-[11px] text-[#8A7E74] truncate">
                            {contact.profession} &middot; {contact.location || contact.city || 'Yaoundé'}
                          </p>
                          {contact.pricePerHour && (
                            <span className="text-[10px] font-bold text-[#1E4030] block">
                              {contact.pricePerHour} XAF/hr
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={'px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ' + (
                          hasExistingChat
                            ? 'bg-[#FAF8F5] text-[#1E4030] border border-[#E2D9CF] group-hover:bg-[#1E4030] group-hover:text-white'
                            : 'bg-[#1E4030] text-white group-hover:bg-[#152e22]'
                        )}
                      >
                        <MessageSquare size={12} />
                        <span>{hasExistingChat ? 'Continue' : 'Chat'}</span>
                      </button>
                    </div>
                  );
                })}

                {filteredContacts.length === 0 && (
                  <div className="col-span-2 py-4 text-center text-xs text-[#8A7E74]">
                    No {filter === 'clients' ? 'clients' : (filter === 'providers' ? 'care providers' : 'contacts')} found matching "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Conversations Items */}
          <div className="divide-y divide-[#E2D9CF]">
            {filteredDiscussions.map(disc => {
              const lastMsg = disc.messages && disc.messages[disc.messages.length - 1];
              const initials = (disc.name || 'Carely User')
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={disc.id}
                  onClick={() => setActiveDiscussionId(disc.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative shrink-0">
                      {disc.photo ? (
                        <div className="w-13 h-13 rounded-2xl overflow-hidden border border-[#E2D9CF] shadow-xs">
                          <img src={disc.photo} alt={disc.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-13 h-13 rounded-2xl bg-[#EDF7F2] border border-green-200 flex items-center justify-center text-[#1E4030] font-bold text-sm shadow-xs">
                          {initials}
                        </div>
                      )}
                      <span className={'absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ' + (
                        disc.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      )} />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#1C1A17] truncate">{disc.name}</h4>
                        {disc.specialty && (
                          <span className="text-[10px] font-semibold text-[#1E4030] bg-[#EDF7F2] border border-green-200/60 px-2 py-0.5 rounded-full capitalize">
                            {(SPECIALTY_META[disc.specialty] && SPECIALTY_META[disc.specialty].label) || disc.specialty}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8A7E74] truncate flex items-center gap-1.5">
                        {lastMsg ? (
                          <>
                            {lastMsg.sender === 'user' && (
                              lastMsg.status === 'read' ? (
                                <CheckCheck size={14} className="text-[#53BDEB] shrink-0 stroke-[2.5]" title="Read" />
                              ) : lastMsg.status === 'delivered' ? (
                                <CheckCheck size={14} className="text-[#8696A0] shrink-0 stroke-[2]" title="Delivered" />
                              ) : (
                                <Check size={14} className="text-[#8696A0] shrink-0 stroke-[2]" title="Sent" />
                              )
                            )}
                            {lastMsg.attachmentUrl && (
                              <span className="inline-flex items-center gap-1 font-semibold text-[#1E4030]">
                                {lastMsg.attachmentType === 'image' ? <ImageIcon size={12} /> : <FileText size={12} />}
                                {lastMsg.attachmentType === 'image' ? 'Photo' : 'Document'} &middot;
                              </span>
                            )}
                            <span>{(typeof lastMsg.text === 'string' ? lastMsg.text : lastMsg.text?.text) || lastMsg.attachmentName || 'Attachment'}</span>
                          </>
                        ) : (
                          'Start a conversation...'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-semibold text-[#8A7E74] block">
                        {(lastMsg && lastMsg.time) || disc.lastSeen || 'Recently'}
                      </span>
                      {(disc.unreadCount || 0) > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#1E4030] text-white text-[10px] font-bold rounded-full shadow-xs">
                          {disc.unreadCount}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => promptDeleteDiscussion(disc.id, e)}
                      title="Delete thread"
                      className="opacity-0 group-hover:opacity-100 p-2 text-[#8A7E74] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* When there are 0 discussions in 'all' view, showcase available contacts directly */}
            {filteredDiscussions.length === 0 && filter === 'all' && searchQuery.trim() === '' && (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 bg-[#EDF7F2] rounded-3xl flex items-center justify-center mx-auto mb-4 text-[#1E4030] border border-green-200">
                  <MessageSquare size={30} />
                </div>
                <h3 className="font-display text-lg font-bold text-[#1C1A17]">No discussions yet</h3>
                <p className="text-xs text-[#8A7E74] max-w-md mx-auto mt-1 mb-6 leading-relaxed">
                  Start a conversation with verified clients or care providers below to discuss care requirements, availability, and scheduling.
                </p>

                <div className="max-w-xl mx-auto space-y-3 text-left">
                  <span className="text-xs font-bold text-[#1E4030] uppercase tracking-wider block">
                    Contacts & Profiles Ready to Chat
                  </span>
                  {contacts.map(contact => {
                    const isClient = contact.role === 'client';
                    return (
                      <div
                        key={contact.id}
                        onClick={() => handleStartChatWithContact(contact)}
                        className="p-4 bg-[#FAF8F5] hover:bg-[#EDF7F2] border border-[#E2D9CF] hover:border-green-300 rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer shadow-2xs group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative shrink-0">
                            {contact.photo ? (
                              <img src={contact.photo} alt={contact.name} className="w-12 h-12 rounded-2xl object-cover border border-[#E2D9CF]" />
                            ) : (
                              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-bold text-sm ${
                                isClient ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white border-green-200 text-[#1E4030]'
                              }`}>
                                {contact.initials}
                              </div>
                            )}
                            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                              contact.isAvailable !== false ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-[#1C1A17] flex items-center gap-1.5">
                              {contact.name}
                              {isClient ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                  Client
                                </span>
                              ) : (
                                <ShieldCheck size={14} className="text-green-600 shrink-0" />
                              )}
                            </h4>
                            <p className="text-xs text-[#8A7E74]">
                              {contact.profession} &middot; {contact.location || contact.city || 'Yaoundé'}
                            </p>
                            {contact.pricePerHour && (
                              <span className="text-[11px] font-bold text-[#1E4030] mt-0.5 inline-block">
                                {contact.pricePerHour} XAF / hr
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="px-4 py-2 bg-[#1E4030] group-hover:bg-[#152e22] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs"
                        >
                          <MessageSquare size={13} />
                          <span>Chat Now</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredDiscussions.length === 0 && filter === 'unread' && (
              <div className="p-12 text-center text-[#8A7E74]">
                <CheckCheck size={32} className="mx-auto mb-3 text-[#8A7E74]/40" />
                <p className="font-semibold text-sm">You are all caught up!</p>
                <p className="text-xs mt-1">No unread messages in your discussions.</p>
              </div>
            )}

            {filteredDiscussions.length === 0 && filter === 'support' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-700 border border-amber-200">
                  <HelpCircle size={26} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1C1A17]">Carely Support & Concierge</h3>
                  <p className="text-xs text-[#8A7E74] max-w-sm mx-auto mt-1">
                    Need help with escrow payments, booking schedules, or verification? Our concierge team is available 24/7.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartChatWithProvider({ id: 'support', name: 'Carely Concierge Support', profession: 'Support', location: 'Carely Escrow Help' })}
                  className="px-5 py-2.5 bg-[#1E4030] hover:bg-[#152e22] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  <MessageSquare size={14} />
                  <span>Start Support Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Active Chat Window (WhatsApp Desktop Look & Feel) ─── */}
      {activeDiscussion && (
        <div className="bg-white rounded-3xl border border-[#E2D9CF] shadow-sm overflow-hidden flex flex-col h-[750px] relative">
          {/* WhatsApp Header */}
          <div className="px-4 sm:px-6 py-3.5 bg-[#FAF8F5] border-b border-[#E2D9CF] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setActiveDiscussionId(null)}
                className="p-2 -ml-2 text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#F0EBE4] rounded-xl transition-colors cursor-pointer"
                title="Back to list"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="relative shrink-0">
                {activeDiscussion.photo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E2D9CF] shadow-xs">
                    <img src={activeDiscussion.photo} alt={activeDiscussion.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EDF7F2] border border-green-200 flex items-center justify-center text-[#1E4030] font-bold text-xs shadow-xs">
                    {(activeDiscussion.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className={'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ' + (
                  activeDiscussion.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                )} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#1C1A17] truncate">{activeDiscussion.name}</h3>
                  {activeDiscussion.role === 'client' ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                      Client
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                      <ShieldCheck size={11} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8A7E74] truncate">
                  {activeDiscussion.status === 'online' ? (
                    <span className="text-green-600 font-semibold">● Online</span>
                  ) : (
                    activeDiscussion.lastSeen || 'Last active recently'
                  )}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => setCallModal('audio')}
                className="w-9 h-9 rounded-full bg-white border border-[#E2D9CF] text-[#1E4030] hover:bg-[#EDF7F2] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Audio Call"
              >
                <Phone size={15} />
              </button>
              <button
                onClick={() => setCallModal('video')}
                className="w-9 h-9 rounded-full bg-white border border-[#E2D9CF] text-[#1E4030] hover:bg-[#EDF7F2] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Video Call"
              >
                <Video size={15} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setHeaderMenuOpen(prev => !prev)}
                  className="w-9 h-9 rounded-full bg-white border border-[#E2D9CF] text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#FAF8F5] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  title="More actions"
                >
                  <MoreVertical size={15} />
                </button>

                {headerMenuOpen && (
                  <div className="absolute right-0 top-11 w-44 bg-white border border-[#E2D9CF] rounded-2xl shadow-2xl py-1.5 z-50 text-[#1C1A17] animate-fadeIn">
                    <button
                      onClick={() => { setHeaderMenuOpen(false); if (onNavigate) onNavigate('booking', { caregiver: activeDiscussion }); }}
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
            {(activeDiscussion.messages || []).map((m, idx) => {
              const isUser = m.sender === 'user';
              const hasAttachment = Boolean(m.attachmentUrl || m.attachment_url);
              const attUrl = m.attachmentUrl || m.attachment_url;
              const attName = m.attachmentName || m.attachment_name || 'attachment';
              const attType = m.attachmentType || m.attachment_type || ((m.attachmentMime && m.attachmentMime.startsWith('image/')) ? 'image' : 'document');
              const attSize = m.attachmentSize || m.attachment_size;
              const formattedSize = attSize ? (attSize > 1024 * 1024 ? ((attSize / (1024 * 1024)).toFixed(1) + ' MB') : (Math.round(attSize / 1024) + ' KB')) : null;

              return (
                <div key={m.id || idx} className={'flex items-end gap-2 group ' + (isUser ? 'justify-end' : 'justify-start')}>
                  {/* Delete individual message button (left for sent) */}
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
                    className={'max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm transition-all relative ' + (
                      isUser
                        ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs border border-[#C5E8BF]'
                        : 'bg-white text-[#111B21] rounded-tl-xs border border-[#E2D9CF]'
                    )}
                  >
                    {/* Attachment: Image */}
                    {hasAttachment && attType === 'image' && (
                      <div className="mb-2 relative group/img overflow-hidden rounded-xl border border-black/10 bg-black/5">
                        <img
                          src={attUrl}
                          alt={attName}
                          onClick={() => setLightboxImage({ url: attUrl, name: attName })}
                          className="max-h-64 sm:max-h-72 w-full object-cover rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                        />
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <a
                            href={attUrl}
                            download={attName}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer shadow-md"
                            title="Download image"
                            onClick={e => e.stopPropagation()}
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Attachment: Document */}
                    {hasAttachment && attType === 'document' && (
                      <div className="mb-2 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2D9CF] flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={'w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[10px] uppercase shrink-0 shadow-xs ' + getDocBadgeColor(attName)}>
                            {(attName.split('.').pop() && attName.split('.').pop().slice(0, 4)) || 'DOC'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-[#1C1A17] truncate">{attName}</p>
                            {formattedSize && <p className="text-[10px] text-[#8A7E74]">{formattedSize}</p>}
                          </div>
                        </div>
                        <a
                          href={attUrl}
                          download={attName}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-lg bg-white border border-[#E2D9CF] hover:bg-[#1E4030] hover:text-white hover:border-[#1E4030] text-[#1E4030] flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                          title="Download document"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    )}

                    {/* Message text */}
                    {(typeof m.text === 'string' ? m.text : m.text?.text) && (
                      <p className="whitespace-pre-wrap break-words">{typeof m.text === 'string' ? m.text : m.text?.text}</p>
                    )}

                    {/* WhatsApp Timestamp & Blue Double Ticks */}
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <span className="text-[9px] text-[#667781] font-medium">{m.time}</span>
                      {isUser && (
                        m.status === 'read' ? (
                          <CheckCheck size={14} className="text-[#53BDEB] stroke-[2.5]" title="Read (Blue Ticks)" />
                        ) : m.status === 'delivered' ? (
                          <CheckCheck size={14} className="text-[#8696A0] stroke-[2]" title="Delivered" />
                        ) : (
                          <Check size={14} className="text-[#8696A0] stroke-[2]" title="Sent" />
                        )
                      )}
                    </div>
                  </div>

                  {/* Delete button (right for received) */}
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

            {(!activeDiscussion.messages || activeDiscussion.messages.length === 0) && (
              <div className="py-16 text-center text-[#8A7E74]">
                <MessageSquare size={28} className="mx-auto mb-2 text-[#8A7E74]/30" />
                <p className="text-xs font-semibold">No messages yet in this conversation.</p>
                <p className="text-[10px] mt-0.5">Send a message below or share a file to start chatting!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Care Action Chips */}
          <div className="px-4 py-2 bg-white border-t border-[#E2D9CF] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider shrink-0">Quick reply:</span>
            {[
              '📍 Send address: Bastos, Yaoundé',
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

          {/* Selected Attachment Staging Bar */}
          {selectedAttachment && (
            <div className="px-4 py-2.5 bg-[#FAF8F5] border-t border-[#E2D9CF] flex items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3 min-w-0">
                {attachmentPreview ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2D9CF] shrink-0">
                    <img src={attachmentPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ' + getDocBadgeColor(selectedAttachment.name)}>
                    <FileText size={18} />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#1C1A17] truncate">{selectedAttachment.name}</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#EDF7F2] text-[#1E4030]">
                      {(selectedAttachment.type && selectedAttachment.type.startsWith('image/')) ? 'Image' : 'Document'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8A7E74]">
                    {selectedAttachment.size > 1024 * 1024
                      ? ((selectedAttachment.size / (1024 * 1024)).toFixed(1) + ' MB')
                      : (Math.round(selectedAttachment.size / 1024) + ' KB')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setSelectedAttachment(null); setAttachmentPreview(null); }}
                className="p-1.5 rounded-full hover:bg-red-50 text-[#8A7E74] hover:text-red-600 transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Emoji Picker Popover */}
          {showEmojiPicker && (
            <div className="p-3 bg-[#FAF8F5] border-t border-[#E2D9CF] flex items-center gap-2 flex-wrap animate-fadeIn">
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
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-10 h-10 rounded-full hover:bg-white text-[#54656F] hover:text-[#1C1A17] flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Attach Document or Image (PDF, DOC, Images)"
            >
              <Paperclip size={19} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            <input
              type="text"
              placeholder={isUploading ? "Uploading attachment..." : "Type a message..."}
              disabled={isUploading}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 bg-white border border-[#E2D9CF] rounded-2xl px-4 py-2.5 text-xs text-[#1C1A17] outline-none focus:ring-1 focus:ring-[#1E4030] shadow-2xs disabled:bg-gray-100"
            />

            {isUploading ? (
              <div className="w-10 h-10 rounded-full bg-[#1E4030] text-white flex items-center justify-center shrink-0">
                <Loader2 size={16} className="animate-spin" />
              </div>
            ) : (inputText.trim() || selectedAttachment) ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#1E4030] hover:bg-[#152e22] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0"
                title="Send"
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

      {/* Image Lightbox Viewer Modal */}
      <ImageLightboxModal
        imageUrl={lightboxImage && lightboxImage.url}
        imageName={lightboxImage && lightboxImage.name}
        onClose={() => setLightboxImage(null)}
      />

      {/* Call Simulation Modal */}
      {callModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#1E4030] text-white rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-sm text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                {activeDiscussion?.photo ? (
                  <img src={activeDiscussion.photo} alt={activeDiscussion.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#2a5542] flex items-center justify-center text-white font-bold text-2xl">
                    {(activeDiscussion?.name || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-50"></span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{activeDiscussion.name}</h3>
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
