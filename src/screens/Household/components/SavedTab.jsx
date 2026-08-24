import React from 'react';
import { Heart } from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';

export default function SavedTab({
  setSelectedId,
  setActiveTab
}) {
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name[0] || '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#EDF7F2] rounded-xl flex items-center justify-center border border-green-200/50 text-[#1E4030]">
          <Heart size={18} className="fill-[#1E4030]" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[#1E4030]">Saved Caregivers</h2>
          <p className="text-xs text-[#8A7E74]">Your quick shortlist of preferred care professionals.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 pt-2">
        {CAREGIVERS.slice(0, 2).map(c => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedId(c.id);
              setActiveTab('explore');
            }}
            className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-[#1E4030] hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-secondary text-[#1E4030] font-semibold rounded-full flex items-center justify-center shrink-0 border border-[#E2D9CF]">
              {getInitials(c.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-[#1C1A17] truncate">{c.name}</h4>
              <p className="text-xs text-[#8A7E74] truncate">
                {SPECIALTY_META[c.specialty]?.label} &bull; ★ {c.rating}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
