import React from 'react';
import {
  Compass, SlidersHorizontal, LayoutGrid, Stethoscope, Baby, Sparkles, MapPin, ArrowLeft, Heart,
  Search as SearchIcon, Calendar, Check, Send, ChevronDown, MessageSquare, User, Droplets, Leaf,
  UserCheck, Shirt, Star, ShieldCheck, Clock, CheckCircle2, ChevronRight, Phone
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
  onNavigate,
  openDiscussionWithCaregiver
}) {
  
  const SPECIALTY_ICON_MAP = {
    nursing: Stethoscope,
    babysitting: Baby,
    cleaning: Sparkles,
    outdoor_cleaning: Droplets,
    gardening: Leaf,
    pet_care: Heart,
    elderly_care: UserCheck,
    laundry_ironing: Shirt,
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

  const quickPrompts = [
    "Nurse in Bastos for post-surgical care",
    "Certified babysitter in Akwa Douala",
    "Deep housekeeping & laundry in Yaounde",
    "Professional compound gardener in Mvan",
    "Pet walker & sitter in Douala"
  ];

  return (
    <div className="space-y-6">
      
      {/* Search Configuration Section */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
            <input
              type="text"
              placeholder="Search neighborhood or city... (e.g. Bastos, Akwa, Bonamoussadi)"
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
          <button
            onClick={() => {
              const el = document.getElementById('caregivers-found-header');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <SearchIcon size={14} />
            Search Caregivers
          </button>
        </div>
      </div>

      {/* ─── FULL-WIDTH AI CARE ASSISTANT SECTION ─── */}
      <div className="w-full bg-gradient-to-br from-white via-[#FAF8F5] to-[#FAF8F5] border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-[#EDF7F2] text-[#1E4030] text-[11px] font-semibold px-3 py-1 rounded-full border border-green-200">
              <Sparkles size={12} className="text-[#1E4030] animate-pulse" />
              <span>Carely AI Intelligent Matching</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1E4030]">
              Describe your care needs to AI
            </h2>
            <p className="text-xs text-[#8A7E74] max-w-2xl leading-relaxed">
              Describe your patient profile, family schedule, or specific requirements, and our algorithm will instantly recommend the most qualified verified caregiver.
            </p>
          </div>
        </div>

        {/* Full-width Input Field */}
        <div className="w-full bg-white border-2 border-[#E2D9CF] rounded-2xl p-4 shadow-sm focus-within:border-[#1E4030] transition-all text-left space-y-3">
          <textarea
            rows={2}
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Type your requirements here... (e.g. 'I need a home nurse in Bastos Yaounde for elderly mother post-op rehabilitation', or 'Babysitter in Akwa Douala for 2 kids')"
            className="w-full text-sm text-[#1C1A17] placeholder-[#8A7E74]/70 bg-transparent border-0 outline-none resize-none leading-relaxed"
          />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[#F5F1EC]">
            {/* Quick Prompts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
              <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider shrink-0">Try:</span>
              {quickPrompts.slice(0, 3).map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setAiPrompt(prompt)}
                  className="bg-[#FAF8F5] hover:bg-[#EDF7F2] text-[#1E4030] border border-[#E2D9CF] text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Submit button */}
            <button
              onClick={handleAiRecommend}
              disabled={aiLoading || !aiPrompt.trim()}
              className="bg-[#1E4030] hover:bg-[#152e22] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shrink-0 ml-auto sm:ml-0"
            >
              {aiLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Matching Caregiver...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Recommend Match</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Matching Result Block */}
        {aiResult && (
          <div className="w-full bg-[#EDF7F2] border border-green-200 rounded-2xl p-5 shadow-sm space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-green-800">
              <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                <Check size={12} strokeWidth={3} className="text-green-800" />
              </div>
              Carely AI Best Match Recommendation
            </div>
            <p className="text-xs text-[#1C1A17] leading-relaxed font-medium">
              {aiResult.message}
            </p>
            {aiResult.matchedId && (
              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedId(aiResult.matchedId);
                    const caregiverList = document.getElementById('caregivers-found-header');
                    caregiverList?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  View Matched Profile &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── THREE-COLUMN DASHBOARD GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_380px] xl:grid-cols-[260px_1fr_420px] gap-6 items-start">
        
        {/* 1. FILTER SIDE PANEL */}
        <aside className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2D9CF]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#8A7E74]" />
              <h3 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Filters</h3>
            </div>
            {filterSpecialty !== 'all' && (
              <button onClick={() => setFilterSpecialty('all')} className="text-[10px] text-[#1E4030] font-bold hover:underline">
                Reset
              </button>
            )}
          </div>

          {/* Specialty Type */}
          <div>
            <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2.5">Service Categories</h4>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'All Services', Icon: LayoutGrid },
                { id: 'nursing', label: 'Home Nursing', Icon: Stethoscope },
                { id: 'babysitting', label: 'Babysitting', Icon: Baby },
                { id: 'cleaning', label: 'Indoor Cleaning', Icon: Sparkles },
                { id: 'outdoor_cleaning', label: 'Outdoor Cleaning', Icon: Droplets },
                { id: 'gardening', label: 'Gardening & Lawn', Icon: Leaf },
                { id: 'pet_care', label: 'Pet Care', Icon: Heart },
                { id: 'elderly_care', label: 'Elderly Care', Icon: UserCheck },
                { id: 'laundry_ironing', label: 'Laundry & Ironing', Icon: Shirt },
              ].map(({ id, label, Icon }) => {
                const active = filterSpecialty === id;
                return (
                  <button
                    key={id}
                    onClick={() => setFilterSpecialty(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      active ? 'bg-[#1E4030] text-white shadow-sm font-semibold' : 'text-[#8A7E74] hover:bg-[#FAF8F5] hover:text-[#1C1A17]'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Ranges */}
          <div>
            <h4 className="text-xs font-semibold text-[#8A7E74] uppercase tracking-wider mb-2.5">Budget (XAF/hr)</h4>
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
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                availableOnly ? 'bg-[#1E4030]' : 'bg-[#E2D9CF]'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  availableOnly ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </aside>

        {/* 2. CAREGIVERS LIST COLUMN */}
        <div className="space-y-4">
          <div id="caregivers-found-header" className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1C1A17]">
              {filteredCaregivers.length} Caregiver{filteredCaregivers.length !== 1 ? 's' : ''} Available
            </h3>
            <span className="text-xs text-[#8A7E74]">Verified in Cameroon</span>
          </div>

          <div className="space-y-3">
            {filteredCaregivers.map(c => {
              const meta = SPECIALTY_META[c.specialty] || { label: 'Caregiver' };
              const isSelected = c.id === selectedCaregiver.id;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedId(c.id);
                    setShowMobileDetail(true);
                  }}
                  className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative ${
                    isSelected ? 'border-[#1E4030] ring-1 ring-[#1E4030] bg-[#FAF8F5]/30' : 'border-[#E2D9CF] hover:border-[#D4C9BE]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm relative">
                      <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                      {c.available && (
                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" title="Available"></span>
                      )}
                    </div>

                    {/* Information */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-base text-[#1C1A17] group-hover:text-[#1E4030] transition-colors">
                            {c.name}
                          </h4>
                          <span className="text-[10px] bg-[#FAF8F5] text-[#8A7E74] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-semibold">
                            {meta.label}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-sm text-[#1E4030]">{c.pricePerHour.toLocaleString()}</span>
                          <span className="text-[10px] text-[#8A7E74] block">XAF/hr</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#8A7E74]">
                        <span className="flex items-center gap-1 font-semibold text-[#1C1A17]">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {c.rating} ({c.reviewCount})
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#B0A89E]" />
                          {c.location}
                        </span>
                        <span>&middot;</span>
                        <span>{c.experience} yrs exp</span>
                      </div>

                      <p className="text-xs text-[#8A7E74] line-clamp-2 leading-relaxed pt-0.5">
                        {c.bio}
                      </p>

                      {/* Quick action shortcuts */}
                      <div className="flex items-center gap-2 pt-2">
                        {openDiscussionWithCaregiver && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDiscussionWithCaregiver(c);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-xl transition-colors cursor-pointer"
                          >
                            <MessageSquare size={11} />
                            Chat in Discussions
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredCaregivers.length === 0 && (
              <div className="bg-white border border-[#E2D9CF] rounded-2xl p-12 text-center space-y-3">
                <Compass size={32} className="mx-auto text-[#8A7E74]/30 animate-pulse" />
                <h4 className="font-bold text-[#1C1A17]">No Caregivers Found</h4>
                <p className="text-xs text-[#8A7E74]">Try clearing some filters or searching a different neighborhood.</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. SELECTED CAREGIVER DETAIL CARD (Right Column) */}
        {selectedCaregiver && (
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-5 lg:sticky lg:top-20">
            {/* Caregiver Header */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm">
                <img src={selectedCaregiver.photo} alt={selectedCaregiver.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-[#1C1A17]">{selectedCaregiver.name}</h3>
                <span className="text-xs bg-[#EDF7F2] text-[#1E4030] font-bold px-2.5 py-0.5 rounded-full border border-green-200 inline-block">
                  {SPECIALTY_META[selectedCaregiver.specialty]?.label || 'Verified Caregiver'}
                </span>
                <p className="text-xs text-[#8A7E74] flex items-center gap-1 pt-1">
                  <MapPin size={12} />
                  {selectedCaregiver.location}
                </p>
              </div>
            </div>

            {/* Price & Rating Bar */}
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Hourly Rate</span>
                <span className="text-lg font-bold text-[#1E4030]">{selectedCaregiver.pricePerHour.toLocaleString()} XAF</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Rating</span>
                <span className="text-sm font-bold text-[#1C1A17] flex items-center gap-1 justify-end">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  {selectedCaregiver.rating} ({selectedCaregiver.reviewCount})
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">About Caregiver</h4>
              <p className="text-xs text-[#1C1A17] leading-relaxed">
                {selectedCaregiver.bio}
              </p>
            </div>

            {/* Certifications Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Verified Credentials</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCaregiver.certifications.map(cert => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#FAF8F5] text-[#1E4030] border border-[#E2D9CF] px-2.5 py-1 rounded-lg font-semibold"
                  >
                    <CheckCircle2 size={11} className="text-green-600" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#E2D9CF] space-y-2">
              <button
                onClick={() => onNavigate('booking', { caregiver: selectedCaregiver })}
                className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar size={14} />
                <span>Book This Caregiver</span>
              </button>

              {openDiscussionWithCaregiver && (
                <button
                  onClick={() => openDiscussionWithCaregiver(selectedCaregiver)}
                  className="w-full bg-white hover:bg-[#FAF8F5] text-[#1E4030] border-2 border-[#1E4030] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>Chat in Discussions</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
