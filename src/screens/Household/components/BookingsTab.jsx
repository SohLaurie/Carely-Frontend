import React from 'react';
import { CalendarCheck, Clock, MapPin, MoreHorizontal } from 'lucide-react';
import { SPECIALTY_META } from '../../../data';

export default function BookingsTab({
  bookings,
  activeBookingDropdownId,
  setActiveBookingDropdownId,
  onNavigate
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EDF7F2] rounded-xl flex items-center justify-center border border-green-200/50 text-[#1E4030]">
          <CalendarCheck size={18} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[#1E4030]">My Bookings</h2>
          <p className="text-xs text-[#8A7E74]">Upcoming visits and your care history.</p>
        </div>
      </div>

      <div className="space-y-3">
        {bookings.map(b => {
          const meta = SPECIALTY_META[b.specialty] || { label: 'Caregiver' };
          const showDropdown = activeBookingDropdownId === b.id;

          const handleViewDetails = () => {
            setActiveBookingDropdownId(null);
            onNavigate('confirmed');
          };

          const handleGetOtp = () => {
            setActiveBookingDropdownId(null);
            onNavigate('otp');
          };

          return (
            <div key={b.id} className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 relative">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary border border-[#E2D9CF] shrink-0">
                  <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-sm text-[#1C1A17] truncate">{b.name}</h4>
                    <span className="text-[10px] bg-[#FAF8F5] text-muted-foreground border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-medium shrink-0">
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A7E74]">
                    {b.date} &middot; {b.time}
                  </p>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 shrink-0 relative">
                <span className="text-xs font-bold bg-[#EDF7F2] text-[#1E4030] border border-green-200 px-3 py-1 rounded-full">
                  {b.status}
                </span>

                {/* Three dots button */}
                <div className="relative">
                  <button
                    onClick={() => setActiveBookingDropdownId(showDropdown ? null : b.id)}
                    className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-all cursor-pointer"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-9 w-32 bg-white border border-[#E2D9CF] rounded-xl shadow-lg py-1.5 z-50 text-left">
                      <button
                        onClick={handleViewDetails}
                        className="w-full px-4 py-2 text-xs text-[#1C1A17] hover:bg-secondary text-left font-medium transition-colors cursor-pointer"
                      >
                        View details
                      </button>
                      <button
                        onClick={handleGetOtp}
                        className="w-full px-4 py-2 text-xs text-[#1E4030] hover:bg-[#1E4030]/5 text-left font-semibold transition-colors cursor-pointer"
                      >
                        Get OTP
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
