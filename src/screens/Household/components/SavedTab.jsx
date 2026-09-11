import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { SPECIALTY_META } from '../../../data';
import { apiGet } from '../../../services/api';

export default function SavedTab({ setSelectedId, setActiveTab }) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadSaved() {
      try {
        const data = await apiGet('/providers');
        if (isMounted && data?.providers) {
          const list = data.providers
            .filter(p => p.approval_status === 'approved' && p.subscription_paid)
            .map(p => ({
              id: p.id,
              name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Verified Provider',
              specialty: (Array.isArray(p.specialties) ? p.specialties[0] : null) || (p.profession ? p.profession.toLowerCase().replace(/\s+/g, '_') : 'cleaning'),
              rating: parseFloat(p.rating) > 0 ? parseFloat(p.rating) : 5.0,
              profession: p.profession || 'Care Provider'
            }));
          setSaved(list);
        }
      } catch (err) {
        console.error('Failed to load saved providers:', err);
      }
    }
    loadSaved();
    return () => { isMounted = false; };
  }, []);

  const getInitials = (name) => {
    const parts = (name || '').trim().split(/\s+/);
    return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : (name[0] || 'CP');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
          <Heart size={20} className="fill-[#1E4030]" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">Saved Providers</h2>
          <p className="text-sm text-[#8A7E74]">Your quick shortlist of preferred care professionals.</p>
        </div>
        <div className="ml-auto bg-[#EDF7F2] border border-green-200/60 text-[#1E4030] text-xs font-bold px-3 py-1.5 rounded-full">
          {saved.length} saved
        </div>
      </div>
      <div className="space-y-3">
        {saved.map(c => (
          <div
            key={c.id}
            onClick={() => { setSelectedId(c.id); setActiveTab('explore'); }}
            className="bg-white border border-[#E2D9CF] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#1E4030]/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#EDF7F2] text-[#1E4030] font-bold text-lg rounded-2xl flex items-center justify-center shrink-0 border border-green-200/60 shadow-sm">
                {getInitials(c.name)}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <h4 className="font-bold text-base text-[#1C1A17] group-hover:text-[#1E4030] transition-colors">{c.name}</h4>
                <div className="flex items-center gap-3 text-xs text-[#8A7E74]">
                  <span className="bg-[#FAF8F5] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                    {SPECIALTY_META[c.specialty]?.label}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-[#1C1A17]">{c.rating}</span>
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] group-hover:bg-[#EDF7F2] border border-[#E2D9CF] flex items-center justify-center text-[#8A7E74] group-hover:text-[#1E4030] transition-all shrink-0">
                <Heart size={16} className="fill-current" />
              </div>
            </div>
          </div>
        ))}
        {saved.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#E2D9CF] rounded-2xl">
            <Heart size={32} className="mx-auto text-[#8A7E74]/30 mb-3" />
            <p className="text-sm font-semibold text-[#8A7E74]">No saved providers</p>
            <p className="text-xs text-[#8A7E74]/70 mt-1">Save providers you like to access them quickly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
