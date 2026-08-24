import React from 'react';
import {
  Compass, SlidersHorizontal, LayoutGrid, Stethoscope, Baby, Sparkles, MapPin, ArrowLeft, Heart,
  Search as SearchIcon, Calendar, Check, Send, ChevronDown, MessageSquare, User
} from 'lucide-react';
import { CAREGIVERS, SPECIALTY_META } from '../../../data';

export default function ExploreTab({
  selectedId,
  setSelectedId,
  filterSpecialty,
  setFilterSpecialty,
  filterLocation,
  setFilterLocation,
  date,
  setDate,
  showMobileDetail,
  setShowMobileDetail,
  showMobileFilters,
  setShowMobileFilters,
  minBudget,
  setMinBudget,
  maxBudget,
  setMaxBudget,
  availableOnly,
  setAvailableOnly,
  aiPrompt,
  setAiPrompt,
  aiLoading,
  aiResult,
  handleAiRecommend,
  onNavigate
}) {
  
  const SPECIALTY_ICON_MAP = {
    nursing: Stethoscope,
    babysitting: Baby,
    cleaning: Sparkles
  };

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name[0] || '';
  };

  // Filter list logic
  const filteredCaregivers = CAREGIVERS.filter(c => {
    if (filterSpecialty !== 'all' && c.specialty !== filterSpecialty) return false;
    if (filterLocation && !c.location.toLowerCase().includes(filterLocation.toLowerCase())) return false;
    if (availableOnly && !c.available) return false;
    if (minBudget && c.pricePerHour < Number(minBudget)) return false;
    if (maxBudget && c.pricePerHour > Number(maxBudget)) return false;
    return true;
  });

  const selectedCaregiver = CAREGIVERS.find(c => c.id === selectedId) || CAREGIVERS[0];

  return (
    <div className="space-y-6">
      
      {/* Search Configuration Section */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
            <input
              type="text"
              placeholder="Neighborhood, city... (e.g. Bastos, Akwa)"
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1E4030] bg-[#FAF8F5] text-[#1C1A17]"
            />
          </div>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="pl-10 pr-4 py-3 border border-[#E2D9CF] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#1E4030] bg-[#FAF8F5] w-full lg:w-48 text-[#1C1A17]"
            />
          </div>
          <button className="bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <SearchIcon size={14} />
            Search
          </button>
        </div>
      </div>

      {/* Lovable-inspired AI Assistant Section */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 md:p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
        {/* Micro notification badge */}
        <div className="inline-flex items-center gap-2 bg-[#EDF7F2] text-[#1E4030] text-[11px] font-semibold px-4 py-1.5 rounded-full border border-green-200/50 cursor-default transition-all hover:bg-[#dff3e7]">
          <span className="bg-[#1E4030] text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">New</span>
          <span>AI Caregiver matching works directly in real-time &rarr;</span>
        </div>

        <div className="space-y-1.5 max-w-xl">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-[#1E4030] tracking-tight">
            Describe your care needs to AI
          </h2>
          <p className="text-xs text-[#8A7E74]">
            Type a prompt describing your patient, schedule, or specific childcare preferences, and let our custom algorithm recommend the best matching caregiver.
          </p>
        </div>

        {/* Lovable Chat Field Container */}
        <div className="w-full max-w-2xl bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm focus-within:ring-2 focus-within:ring-[#1E4030] transition-all text-left space-y-3.5">
          <textarea
            rows={2}
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Describe your care needs... (e.g., 'I need a nurse in Bastos, Yaounde for a post-surgical patient')"
            className="w-full text-sm text-[#1C1A17] placeholder-[#8A7E74]/70 bg-transparent border-0 outline-none resize-none"
          />
          
          {/* Action Bar inside Lovable chat box */}
          <div className="flex items-center justify-between pt-3 border-t border-[#FAF8F5]">
            <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
              <Sparkles size={13} className="text-[#1E4030] animate-pulse" />
              <span className="font-medium text-[11px]">Carely AI Assistant</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="border border-[#E2D9CF] bg-[#FAF8F5] hover:bg-secondary text-[#1C1A17] text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                  <span>Recommend</span>
                  <ChevronDown size={11} />
                </button>
              </div>

              <button
                onClick={handleAiRecommend}
                disabled={aiLoading || !aiPrompt.trim()}
                className="bg-[#1E4030] hover:bg-[#152e22] text-white p-2 rounded-xl transition-all shadow-sm disabled:opacity-40 flex items-center justify-center min-w-8 min-h-8 cursor-pointer"
              >
                {aiLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send size={13} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Matching Result Block */}
        {aiResult && (
          <div className="w-full max-w-2xl bg-[#EDF7F2]/50 border border-green-200 rounded-2xl p-5 shadow-sm text-left space-y-3.5 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-green-700">
              <div className="w-5 h-5 rounded-full bg-[#D8ECD8] flex items-center justify-center shrink-0">
                <Check size={11} strokeWidth={3} className="text-green-800" />
              </div>
              AI Recommendation Generated
            </div>
            <p className="text-xs text-[#1C1A17] leading-relaxed font-medium">
              {aiResult.message}
            </p>
            {aiResult.matchedId && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedId(aiResult.matchedId);
                    const caregiverList = document.getElementById('caregivers-found-header');
                    if (caregiverList) {
                      caregiverList.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-[#1E4030] hover:bg-[#152e22] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  Highlight matched caregiver &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Three-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_360px] xl:grid-cols-[260px_1fr_400px] gap-6 items-start">
        
        {/* 1. FILTER SIDE PANEL (Desktop Only) */}
        <aside className="hidden lg:block bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2D9CF]">
            <SlidersHorizontal size={14} className="text-[#8A7E74]" />
            <h3 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Filters</h3>
          </div>

          {/* Specialty Type */}
          <div>
            <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-3">Service type</h4>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Services', Icon: LayoutGrid },
                { id: 'nursing', label: 'Home Nursing', Icon: Stethoscope },
                { id: 'babysitting', label: 'Babysitting', Icon: Baby },
                { id: 'cleaning', label: 'Domestic Cleaning', Icon: Sparkles },
              ].map(({ id, label, Icon }) => {
                const active = filterSpecialty === id;
                return (
                  <button
                    key={id}
                    onClick={() => setFilterSpecialty(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      active ? 'bg-[#1E4030] text-white shadow-sm font-semibold' : 'text-[#8A7E74] hover:bg-secondary hover:text-[#1C1A17]'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekday Availability */}
          <div>
            <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-3">Availability</h4>
            <div className="grid grid-cols-4 gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <button
                  key={day}
                  className="py-1.5 border border-[#E2D9CF] rounded-lg text-[10px] font-semibold text-[#8A7E74] hover:border-[#1E4030] hover:text-[#1E4030] transition-all bg-white cursor-pointer"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Ranges */}
          <div>
            <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-3">Budget (XAF/hr)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minBudget}
                onChange={e => setMinBudget(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2D9CF] rounded-xl text-xs bg-[#FAF8F5] focus:outline-none"
              />
              <span className="text-[#8A7E74] text-xs">&mdash;</span>
              <input
                type="number"
                placeholder="Max"
                value={maxBudget}
                onChange={e => setMaxBudget(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2D9CF] rounded-xl text-xs bg-[#FAF8F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Available only switch */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E2D9CF]">
            <span className="text-xs font-semibold text-[#8A7E74]">Available only</span>
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`w-10 h-6 rounded-full transition-all relative cursor-pointer ${availableOnly ? 'bg-[#1E4030]' : 'bg-[#E2D9CF]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${availableOnly ? 'right-1' : 'left-1'}`}></span>
            </button>
          </div>
        </aside>

        {/* 2. RESULTS MIDDLE LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="caregivers-found-header" className="font-semibold text-[#1C1A17] text-base">
                {filteredCaregivers.length} caregivers found
              </h3>
              <p className="text-xs text-[#8A7E74]">Verified profiles, updated hourly</p>
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden w-10 h-10 border border-[#E2D9CF] bg-white rounded-xl flex items-center justify-center text-[#1C1A17] shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>

          <div className="space-y-3">
            {filteredCaregivers.map(c => {
              const selected = selectedId === c.id;
              const meta = SPECIALTY_META[c.specialty];
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    setShowMobileDetail(true);
                  }}
                  className={`bg-white rounded-2xl border transition-all cursor-pointer p-4 flex items-center justify-between hover:shadow-md ${
                    selected ? 'border-[#1E4030] shadow-sm ring-1 ring-[#1E4030]' : 'border-[#E2D9CF]'
                  }`}
                >
                  <div className="flex gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#EFECE6] border border-[#E2D9CF] shrink-0">
                      <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[#1C1A17] text-sm truncate">{c.name}</h4>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-full">
                          {meta.label}
                        </span>
                        <span className="text-xs text-amber-500 font-semibold flex items-center gap-0.5">
                          ★ {c.rating} <span className="text-[10px] font-normal text-muted-foreground">({c.reviewCount})</span>
                        </span>
                      </div>

                      <p className="text-[11px] text-[#8A7E74] truncate flex items-center gap-1">
                        <MapPin size={10} />
                        {c.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-sm text-[#1C1A17]">{c.pricePerHour.toLocaleString()}</div>
                    <div className="text-[10px] text-[#8A7E74]">XAF/hr</div>
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-2 ${
                      c.available ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {c.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredCaregivers.length === 0 && (
              <div className="text-center py-12 bg-white border border-[#E2D9CF] rounded-2xl">
                <p className="text-sm text-[#8A7E74]">No caregivers found matching filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. SELECTED CAREGIVER DETAIL PANEL (Desktop) */}
        <aside className="hidden lg:block bg-white border border-[#E2D9CF] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="relative text-white rounded-2xl p-5 overflow-hidden shadow-sm h-48 flex flex-col justify-between">
            <img
              src={selectedCaregiver.photo}
              alt={selectedCaregiver.name}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25 z-10"></div>

            <div className="relative z-20 flex justify-end">
              <button className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer">
                <Heart size={14} className="text-white fill-white" />
              </button>
            </div>

            <div className="relative z-20">
              <h3 className="font-semibold text-base leading-tight text-white">{selectedCaregiver.name}</h3>
              <p className="text-xs text-white/80 mt-0.5">{SPECIALTY_META[selectedCaregiver.specialty].label}</p>
              <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-2.5 border border-white/10">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedCaregiver.available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                {selectedCaregiver.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-[#E2D9CF]">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">★ {selectedCaregiver.rating}</span>
                <span className="text-xs text-[#8A7E74]">({selectedCaregiver.reviewCount} reviews)</span>
              </div>
              <div className="text-xs text-[#8A7E74] mt-0.5 flex items-center gap-1">
                <MapPin size={11} />
                {selectedCaregiver.location}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-lg text-[#1E4030]">{selectedCaregiver.pricePerHour.toLocaleString()}</div>
              <div className="text-[10px] text-[#8A7E74]">XAF / hour</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E2D9CF]">
              <p className="text-[#8A7E74] font-medium mb-0.5">EXPERIENCE</p>
              <p className="font-semibold text-[#1C1A17]">{selectedCaregiver.experience} years</p>
            </div>
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E2D9CF]">
              <p className="text-[#8A7E74] font-medium mb-0.5">LANGUAGES</p>
              <p className="font-semibold text-[#1C1A17] truncate">{selectedCaregiver.languages.slice(0, 2).join(', ')}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2.5">Certifications</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedCaregiver.certifications.map(cert => (
                <span key={cert} className="text-[10px] bg-secondary text-[#1C1A17] border border-[#E2D9CF] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  <Check size={9} strokeWidth={3} className="text-[#1E4030]" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2.5">About</h4>
            <p className="text-xs text-[#8A7E74] leading-relaxed line-clamp-4">
              {selectedCaregiver.bio}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <button className="flex-1 border border-[#E2D9CF] bg-[#FAF8F5] text-[#1C1A17] font-semibold py-3 px-3 rounded-xl hover:bg-secondary transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <MessageSquare size={14} />
                Message
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className="flex-1 border border-[#E2D9CF] bg-[#FAF8F5] text-[#1C1A17] font-semibold py-3 px-3 rounded-xl hover:bg-secondary transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <User size={14} />
                View profile
              </button>
            </div>
            <button
              onClick={() => onNavigate('booking')}
              className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold py-3.5 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Calendar size={16} />
              Request booking
            </button>
          </div>
        </aside>

      </div>

      {/* ── MOBILE: FULL DETAILS MODAL SHEET ─────────────────────────────────── */}
      {showMobileDetail && selectedCaregiver && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-[#E2D9CF] px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setShowMobileDetail(false)}
              className="text-[#1C1A17] hover:text-[#1E4030] flex items-center gap-1.5 text-sm font-medium cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Explore
            </button>
          </div>

          <div className="p-4 space-y-6">
            <div className="relative text-white rounded-3xl p-6 overflow-hidden shadow-sm h-56 flex flex-col justify-between">
              <img
                src={selectedCaregiver.photo}
                alt={selectedCaregiver.name}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30 z-10"></div>

              <div className="relative z-20 flex justify-end">
                <button className="w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 flex items-center justify-center transition-colors backdrop-blur-sm cursor-pointer">
                  <Heart size={15} className="text-white fill-white" />
                </button>
              </div>

              <div className="relative z-20">
                <h3 className="font-semibold text-lg text-white">{selectedCaregiver.name}</h3>
                <p className="text-sm text-white/80 mt-0.5">{SPECIALTY_META[selectedCaregiver.specialty].label}</p>
                <span className="inline-flex items-center gap-1.5 bg-black/35 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-3 border border-white/10">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedCaregiver.available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                  {selectedCaregiver.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-[#E2D9CF]">
              <div>
                <p className="text-sm font-bold text-[#1C1A17]">★ {selectedCaregiver.rating} ({selectedCaregiver.reviewCount} reviews)</p>
                <p className="text-xs text-[#8A7E74] mt-0.5">{selectedCaregiver.location}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-[#1E4030]">{selectedCaregiver.pricePerHour.toLocaleString()} XAF</p>
                <p className="text-xs text-[#8A7E74]">per hour</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-secondary p-3 rounded-xl border border-[#E2D9CF]">
                <p className="text-[#8A7E74] font-medium mb-0.5">EXPERIENCE</p>
                <p className="font-semibold text-[#1C1A17]">{selectedCaregiver.experience} years</p>
              </div>
              <div className="bg-secondary p-3 rounded-xl border border-[#E2D9CF]">
                <p className="text-[#8A7E74] font-medium mb-0.5">LANGUAGES</p>
                <p className="font-semibold text-[#1C1A17]">{selectedCaregiver.languages.join(', ')}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-3">Certifications</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCaregiver.certifications.map(cert => (
                  <span key={cert} className="text-[10px] bg-secondary text-[#1C1A17] border border-[#E2D9CF] px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                    <Check size={9} strokeWidth={3} className="text-[#1E4030]" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2.5">About</h4>
              <p className="text-xs text-[#8A7E74] leading-relaxed">
                {selectedCaregiver.bio}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <button className="flex-1 border border-[#E2D9CF] bg-white text-[#1C1A17] font-semibold py-3.5 rounded-xl hover:bg-secondary transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer">
                  <MessageSquare size={16} />
                  Message
                </button>
                <button
                  onClick={() => {
                    setShowMobileDetail(false);
                    onNavigate('profile');
                  }}
                  className="flex-1 border border-[#E2D9CF] bg-white text-[#1C1A17] font-semibold py-3.5 rounded-xl hover:bg-secondary transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User size={16} />
                  View profile
                </button>
              </div>
              <button
                onClick={() => {
                  setShowMobileDetail(false);
                  onNavigate('booking');
                }}
                className="w-full bg-[#1E4030] text-white font-semibold py-3.5 rounded-xl hover:bg-[#152e22] transition-colors text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Calendar size={16} />
                Request booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE: FILTERS MODAL DRAWER ────────────────────────────────────── */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white">
          <div className="sticky top-0 bg-white border-b border-[#E2D9CF] px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Filters</h3>
            <button onClick={() => setShowMobileFilters(false)} className="text-[#1C1A17] cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider">Service type</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Services', Icon: LayoutGrid },
                  { id: 'nursing', label: 'Home Nursing', Icon: Stethoscope },
                  { id: 'babysitting', label: 'Babysitting', Icon: Baby },
                  { id: 'cleaning', label: 'Cleaning', Icon: Sparkles },
                ].map(({ id, label, Icon }) => {
                  const active = filterSpecialty === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setFilterSpecialty(id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#1E4030] border-[#1E4030] text-white'
                          : 'bg-white border-[#E2D9CF] text-[#8A7E74]'
                      }`}
                    >
                      <Icon size={12} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider">Budget (XAF/hr)</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minBudget}
                  onChange={e => setMinBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2D9CF] rounded-xl text-xs bg-white focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxBudget}
                  onChange={e => setMaxBudget(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E2D9CF] rounded-xl text-xs bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pb-6">
              <span className="text-xs font-semibold text-[#8A7E74]">Available only</span>
              <button
                onClick={() => setAvailableOnly(!availableOnly)}
                className={`w-10 h-6 rounded-full transition-all relative cursor-pointer ${availableOnly ? 'bg-[#1E4030]' : 'bg-[#E2D9CF]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${availableOnly ? 'right-1' : 'left-1'}`}></span>
              </button>
            </div>
          </div>

          <div className="p-4 border-t border-[#E2D9CF] bg-white">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full bg-[#1E4030] text-white font-semibold py-3.5 rounded-xl text-sm cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
