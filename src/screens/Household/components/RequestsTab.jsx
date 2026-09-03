import React, { useState } from 'react';
import {
  ClipboardList, Clock, MapPin, MoreHorizontal, ChevronRight,
  X, CheckCircle, AlertCircle, ShieldCheck, MessageSquare, Calendar, DollarSign,
  Eye, Trash2
} from 'lucide-react';
import { SPECIALTY_META } from '../../../data';

function RequestDetailsModal({ request, onClose, onOpenDiscussion, onCancelRequest }) {
  if (!request) return null;
  const meta = SPECIALTY_META[request.specialty] || { label: 'Provider' };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2D9CF] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1E4030] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ClipboardList size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Request Details</h3>
              <p className="text-xs text-white/70">ID: {request.id} &middot; {request.timeSent}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Caregiver Summary */}
          <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-[#E2D9CF] shrink-0 shadow-sm">
              <img src={request.photo} alt={request.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-base text-[#1C1A17]">{request.name}</h4>
                <span className="text-[10px] bg-[#EDF7F2] text-[#1E4030] border border-green-200 px-2 py-0.5 rounded-full font-bold">
                  {meta.label}
                </span>
              </div>
              <p className="text-xs text-[#8A7E74] flex items-center gap-1.5">
                <MapPin size={13} className="text-[#B0A89E]" />
                {request.location}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Status</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                request.status === 'Accepted' ? 'bg-[#EDF7F2] text-[#1E4030] border border-green-200' :
                request.status === 'Pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  request.status === 'Accepted' ? 'bg-green-500' :
                  request.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                {request.status}
              </span>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Schedule</span>
              <span className="text-xs font-bold text-[#1C1A17] flex items-center gap-1">
                <Calendar size={12} className="text-[#1E4030]" />
                {request.date} ({request.time})
              </span>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Hourly Rate</span>
              <span className="text-xs font-bold text-[#1C1A17]">
                {request.pricePerHour?.toLocaleString() || '3,500'} XAF / hr
              </span>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Total Estimated Fee</span>
              <span className="text-xs font-bold text-[#1E4030]">
                {request.totalPrice || '10,500 XAF'}
              </span>
            </div>
          </div>

          {/* Notes / Patient Details */}
          <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-4 space-y-1.5">
            <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Care Request Summary</span>
            <p className="text-xs text-[#1C1A17] leading-relaxed">
              {request.patientNotes || 'Provider booking requested for family home care in Yaounde/Douala with background check and escrow security.'}
            </p>
          </div>

          {/* Escrow note */}
          <div className="p-3 bg-[#EDF7F2] border border-green-200 rounded-xl flex items-center gap-2.5 text-xs text-[#1E4030]">
            <ShieldCheck size={16} className="shrink-0" />
            <span>Escrow protection active: Provider is only paid upon validated arrival OTP.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#E2D9CF] bg-[#FAF8F5] flex items-center justify-between gap-3">
          {request.status === 'Pending' ? (
            <button
              onClick={() => { onCancelRequest(request.id); onClose(); }}
              className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
            >
              Cancel Request
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            {onOpenDiscussion && (
              <button
                onClick={() => { onClose(); onOpenDiscussion(request.name); }}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>Chat in Discussions</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-[#1E4030] hover:bg-[#152e22] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestsTab({
  requests,
  activeDropdownId,
  setActiveDropdownId,
  cancelDeleteRequest,
  onNavigate,
  openDiscussionWithCaregiver
}) {
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
          <ClipboardList size={20} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">My Requests</h2>
          <p className="text-sm text-[#8A7E74]">Every provider you reached out to and where they stand.</p>
        </div>
        <div className="ml-auto bg-[#EDF7F2] border border-green-200/60 text-[#1E4030] text-xs font-bold px-3 py-1.5 rounded-full">
          {requests.length} request{requests.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map(r => {
          const meta = SPECIALTY_META[r.specialty] || { label: 'Provider' };
          const showDropdown = activeDropdownId === r.id;
          const statusConfig = (
            r.status === 'Pending'  ? { bg: 'bg-amber-50',   text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400'  } :
            r.status === 'Accepted' ? { bg: 'bg-[#EDF7F2]',  text: 'text-[#1E4030]', border: 'border-green-200',  dot: 'bg-green-500' } :
                                      { bg: 'bg-red-50',     text: 'text-red-700',   border: 'border-red-200',    dot: 'bg-red-400'   }
          );

          return (
            <div key={r.id} className="bg-white border border-[#E2D9CF] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#D4C9BE] transition-all relative group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm">
                  <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-bold text-base text-[#1C1A17]">{r.name}</h4>
                    <span className="text-[11px] bg-[#FAF8F5] text-[#8A7E74] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-semibold">{meta.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#8A7E74]">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#B0A89E]" />{r.timeSent}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#B0A89E]" />{r.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                    {r.status}
                  </span>
                  <div className="relative">
                    <button onClick={() => setActiveDropdownId(showDropdown ? null : r.id)} className="w-9 h-9 rounded-xl hover:bg-[#FAF8F5] border border-transparent hover:border-[#E2D9CF] flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-all cursor-pointer">
                      <MoreHorizontal size={17} />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 top-10 w-44 bg-white border border-[#E2D9CF] rounded-xl shadow-xl py-1.5 z-50 animate-fadeIn">
                        <button
                          onClick={() => {
                            setActiveDropdownId(null);
                            const bookingVal = {
                              caregiver: {
                                name: r.name,
                                photo: r.photo,
                                specialty: r.specialty,
                                location: r.location,
                                rating: 4.8,
                                pricePerHour: r.pricePerHour || 3500
                              },
                              sessionType: r.bookingType || 'once',
                              date: r.date,
                              time: r.time,
                              totalPrice: typeof r.totalPrice === 'string'
                                ? parseInt(r.totalPrice.replace(/[^0-9]/g, ''))
                                : (r.totalPrice || 10500),
                              durationWeeks: 1,
                              status: 'Accepted'
                            };
                            onNavigate('payment', { booking: bookingVal });
                          }}
                          className="w-full px-4 py-2 text-xs text-[#1E4030] hover:bg-[#EDF7F2] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2 border-b border-[#F0EBE5]"
                        >
                          <DollarSign size={13} className="text-[#1E4030]" />Make Payment
                        </button>
                        <button
                          onClick={() => {
                            setActiveDropdownId(null);
                            setSelectedRequestDetails(r); // Open details popup!
                          }}
                          className="w-full px-4 py-2 text-xs text-[#1C1A17] hover:bg-[#FAF8F5] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <Eye size={13} className="text-[#8A7E74]" />View details
                        </button>
                        <button
                          onClick={() => {
                            setActiveDropdownId(null);
                            if (openDiscussionWithCaregiver) openDiscussionWithCaregiver(r.name);
                          }}
                          className="w-full px-4 py-2 text-xs text-[#1E4030] hover:bg-[#EDF7F2] text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <MessageSquare size={13} className="text-[#1E4030]" />Message
                        </button>
                        <button
                          onClick={() => cancelDeleteRequest(r.id)}
                          className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-semibold transition-colors cursor-pointer flex items-center gap-2"
                        >
                          {r.status === 'Pending' ? (
                            <>
                              <X size={13} className="text-red-600" />Cancel request
                            </>
                          ) : (
                            <>
                              <Trash2 size={13} className="text-red-600" />Delete
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {requests.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#E2D9CF] rounded-2xl">
            <ClipboardList size={32} className="mx-auto text-[#8A7E74]/30 mb-3" />
            <p className="text-sm font-semibold text-[#8A7E74]">No requests yet</p>
            <p className="text-xs text-[#8A7E74]/70 mt-1">Explore providers and send your first request.</p>
          </div>
        )}
      </div>

      {/* Details Pop-up Modal */}
      <RequestDetailsModal
        request={selectedRequestDetails}
        onClose={() => setSelectedRequestDetails(null)}
        onOpenDiscussion={openDiscussionWithCaregiver}
        onCancelRequest={cancelDeleteRequest}
      />
    </div>
  );
}
