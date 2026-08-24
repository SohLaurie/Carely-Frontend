import React from 'react';
import { ClipboardList, Clock, MapPin, MoreHorizontal } from 'lucide-react';
import { SPECIALTY_META } from '../../../data';

export default function RequestsTab({
  requests,
  activeDropdownId,
  setActiveDropdownId,
  cancelDeleteRequest,
  onNavigate
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EDF7F2] rounded-xl flex items-center justify-center border border-green-200/50 text-[#1E4030]">
          <ClipboardList size={18} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[#1E4030]">My Requests</h2>
          <p className="text-xs text-[#8A7E74]">Every caregiver you've reached out to and where they stand.</p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map(r => {
          const meta = SPECIALTY_META[r.specialty] || { label: 'Caregiver' };
          const showDropdown = activeDropdownId === r.id;
          
          const handleCancelDelete = () => {
            cancelDeleteRequest(r.id);
          };

          const handleView = () => {
            setActiveDropdownId(null);
            onNavigate('pending', { activeRequest: r }); // Navigates to request pending details view
          };

          return (
            <div key={r.id} className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 relative">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary border border-[#E2D9CF] shrink-0">
                  <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-[#1C1A17] truncate">{r.name}</h4>
                    <span className="text-[10px] bg-[#FAF8F5] text-[#8A7E74] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-medium shrink-0">
                      {meta.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-[#8A7E74]">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {r.timeSent}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {r.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-3 shrink-0 relative">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${
                  r.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  r.status === 'Accepted' ? 'bg-[#EDF7F2] text-[#1E4030] border-green-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {r.status}
                </span>

                {/* Three dots button */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdownId(showDropdown ? null : r.id)}
                    className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-all cursor-pointer"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* Dropdown Menu options box */}
                  {showDropdown && (
                    <div className="absolute right-0 top-9 w-32 bg-white border border-[#E2D9CF] rounded-xl shadow-lg py-1.5 z-50 text-left">
                      <button
                        onClick={handleView}
                        className="w-full px-4 py-2 text-xs text-[#1C1A17] hover:bg-secondary text-left font-medium transition-colors cursor-pointer"
                      >
                        View details
                      </button>
                      <button
                        onClick={handleCancelDelete}
                        className="w-full px-4 py-2 text-xs text-red-650 hover:bg-red-50 text-left font-semibold transition-colors cursor-pointer"
                      >
                        {r.status === 'Pending' ? 'Cancel' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="text-center py-12 bg-white border border-[#E2D9CF] rounded-2xl">
            <p className="text-sm text-[#8A7E74]">You have no active requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
