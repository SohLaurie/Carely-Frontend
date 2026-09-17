import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { SPECIALTY_META } from '../../../data';
import { apiGet, getAvatarUrl } from '../../../services/api';

export default function SavedTab({ setSelectedId, setActiveTab }) {
  const [saved, setSaved] = useState([]);
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('carely_saved_providers') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const loadSaved = async (currentSavedIds = savedIds) => {
    try {
      const data = await apiGet('/providers');
      if (data?.providers) {
        const list = data.providers
          .filter(p => p.approval_status === 'approved' && p.subscription_paid && currentSavedIds.includes(p.id))
          .map(p => ({
            id: p.id,
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Verified Provider',
            specialty: (Array.isArray(p.specialties) ? p.specialties[0] : null) || (p.profession ? p.profession.toLowerCase().replace(/\s+/g, '_') : 'cleaning'),
            rating: parseFloat(p.rating) > 0 ? parseFloat(p.rating) : 5.0,
            profession: p.profession || 'Care Provider',
            photo: p.photo_url || null,
          }));
        setSaved(list);
      }
    } catch (err) {
      console.error('Failed to load saved providers:', err);
    }
  };

  useEffect(() => {
    loadSaved(savedIds);
  }, []);

  useEffect(() => {
    const handleSavedUpdated = (e) => {
      const updatedIds = Array.isArray(e.detail) ? e.detail : [];
      setSavedIds(updatedIds);
      loadSaved(updatedIds);
    };
    window.addEventListener('carely_saved_updated', handleSavedUpdated);
    return () => window.removeEventListener('carely_saved_updated', handleSavedUpdated);
  }, []);

  const toggleUnsave = (id, e) => {
    e.stopPropagation();
    const next = savedIds.filter(x => x !== id);
    setSavedIds(next);
    setSaved(prev => prev.filter(c => c.id !== id));
    try {
      localStorage.setItem('carely_saved_providers', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('carely_saved_updated', { detail: next }));
    } catch {}
  };

  const getInitials = (name) => {
    const parts = (name || '').trim().split(/\s+/);
    return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : (name[0] || 'CP');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-200 text-rose-500 shadow-sm">
          <Heart size={20} className="fill-rose-500 text-rose-500" />
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
              <div className="w-14 h-14 bg-[#EDF7F2] text-[#1E4030] font-bold text-lg rounded-2xl flex items-center justify-center shrink-0 border border-green-200/60 shadow-sm overflow-hidden relative select-none">
                {c.photo ? (
                  <img
                    src={getAvatarUrl(c.photo)}
                    alt={c.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  getInitials(c.name)
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <h4 className="font-bold text-base text-[#1C1A17] group-hover:text-[#1E4030] transition-colors">{c.name}</h4>
                <div className="flex items-center gap-3 text-xs text-[#8A7E74]">
                  <span className="bg-[#FAF8F5] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
                    {SPECIALTY_META[c.specialty]?.label || c.profession}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-[#1C1A17]">{c.rating}</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => toggleUnsave(c.id, e)}
                className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs hover:scale-105"
                title="Remove from saved"
              >
                <Heart size={16} className="fill-rose-500 text-rose-500" />
              </button>
            </div>
          </div>
        ))}
        {saved.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#E2D9CF] rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto">
              <Heart size={22} className="text-rose-400" />
            </div>
            <p className="text-sm font-bold text-[#1C1A17]">No saved providers yet</p>
            <p className="text-xs text-[#8A7E74] max-w-sm mx-auto">
              Tap the heart icon on any caregiver profile in Explore to save them to your favourites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
