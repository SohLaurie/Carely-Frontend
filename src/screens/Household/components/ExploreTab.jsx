import React, { useState } from 'react';
import {
  Compass, SlidersHorizontal, LayoutGrid, Stethoscope, Baby, Sparkles, MapPin, ArrowLeft, Heart,
  Search as SearchIcon, Calendar, Check, Send, ChevronDown, MessageSquare, User, Droplets, Leaf,
  UserCheck, Shirt, Star, ShieldCheck, Clock, CheckCircle2, ChevronRight, Phone, X
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
  openDiscussionWithCaregiver,
  openBookingWizard,
}) {
  const [modalCaregiver, setModalCaregiver] = useState(null);

  const SPECIALTY_ICON_MAP = {
    nursing: Stethoscope,
    babysitting: Baby,
    cleaning: Sparkles,
    indoor_cleaning: Sparkles,
    outdoor_cleaning: Droplets,
    gardening: Leaf,
    pet_care: Heart,
    elderly_care: UserCheck,
    laundry_ironing: Shirt,
    fridge_cleaning: Droplets,
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

  const categories = [
    { id: 'all', label: 'All Categories', Icon: LayoutGrid },
    { id: 'nursing', label: 'Home Nursing', Icon: Stethoscope },
    { id: 'babysitting', label: 'Babysitting', Icon: Baby },
    { id: 'cleaning', label: 'Domestic Housekeeping', Icon: Sparkles },
    { id: 'indoor_cleaning', label: 'Indoor Cleaning', Icon: Sparkles },
    { id: 'gardening', label: 'Gardening & Lawn', Icon: Leaf },
    { id: 'pet_care', label: 'Pet Care & Walking', Icon: Heart },
    { id: 'laundry_ironing', label: 'Laundry & Ironing', Icon: Shirt },
    { id: 'outdoor_cleaning', label: 'Outdoor Cleaning', Icon: Droplets },
    { id: 'elderly_care', label: 'Elderly Care', Icon: UserCheck },
  ];

  const quickPrompts = [
    "Nurse in Bastos for post-surgical care",
    "Certified babysitter in Akwa Douala",
    "Deep housekeeping & laundry in Yaounde",
    "Professional compound gardener in Mvan",
    "Pet walker & sitter in Douala"
  ];

  const isFilterActive = filterSpecialty !== 'all' || filterLocation || minBudget || maxBudget || availableOnly;

  const resetAllFilters = () => {
    setFilterSpecialty('all');
    setFilterLocation('');
    setMinBudget('');
    setMaxBudget('');
    setAvailableOnly(false);
  };

  return (
    <div className="space-y-6">
      
      {/* ─── 1. TOP SEARCH & LOCATION BAR ─── */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
            <input
              type="text"
              placeholder="Search neighborhood or city... (e.g. Bastos, Akwa, Bonamoussadi, Molyko, Bota)"
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
            Search Providers
          </button>
        </div>
      </div>

      {/* ─── 2. AI CARE ASSISTANT ─── */}
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
              Describe your patient profile, family schedule, or specific requirements, and our algorithm will instantly recommend the most qualified verified provider.
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
                  <span>Matching Provider...</span>
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
                    const matched = CAREGIVERS.find(c => c.id === aiResult.matchedId);
                    if (matched) {
                      setModalCaregiver(matched);
                    }
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

      {/* ─── 3. HORIZONTAL FILTERS BAR & SERVICE CATEGORIES ─── */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm space-y-4">
        {/* Service Category Chips in Horizontal Scroll */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider flex items-center gap-2">
              <LayoutGrid size={14} className="text-[#1E4030]" />
              <span>Service Categories</span>
            </h4>
            {isFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-[#1E4030] font-bold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(({ id, label, Icon }) => {
              const active = filterSpecialty === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilterSpecialty(id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? 'bg-[#1E4030] text-white border-[#1E4030] shadow-sm ring-2 ring-[#1E4030]/20'
                      : 'bg-[#FAF8F5] text-[#5A5248] border-[#E2D9CF] hover:border-[#B0A89E] hover:text-[#1C1A17]'
                  }`}
                >
                  <Icon size={14} className={active ? 'text-white' : 'text-[#1E4030]'} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Controls: Budget & Availability */}
        <div className="pt-3 border-t border-[#F0EBE5] flex flex-wrap items-center justify-between gap-4">
          {/* Budget Range Inputs */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Rate (XAF/hr):</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minBudget}
                onChange={e => setMinBudget(e.target.value)}
                className="w-24 px-3 py-1.5 border border-[#E2D9CF] rounded-xl text-xs bg-[#FAF8F5] focus:outline-none focus:border-[#1E4030]"
              />
              <span className="text-[#8A7E74] text-xs">&mdash;</span>
              <input
                type="number"
                placeholder="Max"
                value={maxBudget}
                onChange={e => setMaxBudget(e.target.value)}
                className="w-24 px-3 py-1.5 border border-[#E2D9CF] rounded-xl text-xs bg-[#FAF8F5] focus:outline-none focus:border-[#1E4030]"
              />
            </div>
          </div>

          {/* Available Only Toggle */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-semibold text-[#5A5248]">Available for instant booking</span>
            <button
              type="button"
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
        </div>
      </div>

      {/* ─── 4. PROVIDERS FOUND (TWO CARDS PER ROW GRID) ─── */}
      <div className="space-y-4">
        <div id="caregivers-found-header" className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-bold text-base text-[#1C1A17]">
            {filteredCaregivers.length} Verified Provider{filteredCaregivers.length !== 1 ? 's' : ''} Found
          </h3>
          <span className="text-xs text-[#8A7E74] font-medium bg-[#FAF8F5] px-3.5 py-1 rounded-full border border-[#E2D9CF]">
            Direct Escrow & Verified ID &bull; Cameroon
          </span>
        </div>

        {/* 2 Cards Per Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredCaregivers.map(c => {
            const meta = SPECIALTY_META[c.specialty] || { label: 'Provider', color: '#1E4030', bg: '#EDF7F2' };

            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  setModalCaregiver(c);
                }}
                className="bg-white border border-[#E2D9CF] hover:border-[#1E4030] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Row: Avatar + Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm relative">
                      <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                      {c.available && (
                        <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-xs" title="Available for booking"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-base text-[#1C1A17] group-hover:text-[#1E4030] transition-colors truncate">
                          {c.name}
                        </h4>
                        <div className="bg-[#EDF7F2] border border-green-200/80 px-2.5 py-1 rounded-xl text-right shrink-0">
                          <span className="font-extrabold text-xs text-[#1E4030]">{c.pricePerHour.toLocaleString()} XAF/hr</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                          style={{ backgroundColor: meta.bg || '#EDF7F2', color: meta.color || '#1E4030', borderColor: `${meta.color || '#1E4030'}30` }}
                        >
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={11} /> Verified
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 text-xs text-[#8A7E74] pt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 font-bold text-[#1C1A17]">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          {c.rating} ({c.reviewCount})
                        </span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#1E4030]" />
                          {c.location}
                        </span>
                        <span>&middot;</span>
                        <span>{c.experience} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-[#5A5248] line-clamp-2 leading-relaxed">
                    {c.bio}
                  </p>

                  {/* Certifications preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {c.certifications?.slice(0, 3).map(cert => (
                      <span
                        key={cert}
                        className="text-[10px] font-semibold bg-[#FAF8F5] text-[#1E4030] border border-[#E2D9CF] px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <CheckCircle2 size={10} className="text-green-600" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-[#F0EBE5] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(c.id);
                      setModalCaregiver(c);
                    }}
                    className="text-xs font-bold text-[#8A7E74] hover:text-[#1E4030] transition-colors"
                  >
                    View Details &rarr;
                  </button>

                  <div className="flex items-center gap-2">
                    {openDiscussionWithCaregiver && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDiscussionWithCaregiver(c);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                      >
                        <MessageSquare size={12} />
                        <span>Chat</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(c.id);
                        if (openBookingWizard) {
                          openBookingWizard({ initialProvider: c });
                        } else {
                          onNavigate('booking', { caregiver: c });
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#1E4030] hover:bg-[#152e22] px-4 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <Calendar size={12} />
                      <span>Request Book</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCaregivers.length === 0 && (
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-12 text-center space-y-3">
            <Compass size={36} className="mx-auto text-[#8A7E74]/40 animate-pulse" />
            <h4 className="font-bold text-[#1C1A17]">No Providers Found</h4>
            <p className="text-xs text-[#8A7E74]">Try clearing some filters or searching a different neighborhood.</p>
          </div>
        )}
      </div>

      {/* ─── 5. PROVIDER PROFILE DETAIL MODAL (With X Close Icon) ─── */}
      {modalCaregiver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div
            className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-2xl max-w-lg w-full relative space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setModalCaregiver(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#E2D9CF]/50 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Provider Header */}
            <div className="flex items-start gap-4 pt-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E2D9CF] shrink-0 shadow-sm relative">
                <img src={modalCaregiver.photo} alt={modalCaregiver.name} className="w-full h-full object-cover" />
                {modalCaregiver.available && (
                  <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" title="Available"></span>
                )}
              </div>
              <div className="space-y-1.5 flex-1 pr-6">
                <h3 className="font-display text-xl font-bold text-[#1C1A17]">{modalCaregiver.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-[#EDF7F2] text-[#1E4030] font-bold px-2.5 py-0.5 rounded-full border border-green-200 inline-block">
                    {SPECIALTY_META[modalCaregiver.specialty]?.label || 'Verified Provider'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={12} /> ID Verified
                  </span>
                </div>
                <p className="text-xs text-[#8A7E74] flex items-center gap-1 pt-0.5">
                  <MapPin size={13} className="text-[#1E4030]" />
                  <span>{modalCaregiver.location} &bull; {modalCaregiver.experience} years experience</span>
                </p>
              </div>
            </div>

            {/* Price & Rating Bar */}
            <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Hourly Rate</span>
                <span className="text-xl font-bold text-[#1E4030]">{modalCaregiver.pricePerHour.toLocaleString()} XAF</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider block">Rating & Trust</span>
                <span className="text-sm font-bold text-[#1C1A17] flex items-center gap-1 justify-end">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  {modalCaregiver.rating} ({modalCaregiver.reviewCount} client reviews)
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">About Provider</h4>
              <p className="text-xs text-[#1C1A17] leading-relaxed">
                {modalCaregiver.bio}
              </p>
            </div>

            {/* Certifications Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Verified Credentials & Background</h4>
              <div className="flex flex-wrap gap-2">
                {modalCaregiver.certifications?.map(cert => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#FAF8F5] text-[#1E4030] border border-[#E2D9CF] px-3 py-1 rounded-xl font-semibold"
                  >
                    <CheckCircle2 size={12} className="text-green-600" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#E2D9CF] space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setModalCaregiver(null);
                  if (openBookingWizard) {
                    openBookingWizard({ initialProvider: modalCaregiver });
                  } else {
                    onNavigate('booking', { caregiver: modalCaregiver });
                  }
                }}
                className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 px-4 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Calendar size={15} />
                <span>Request Booking with {modalCaregiver.name.split(' ')[0]}</span>
              </button>

              {openDiscussionWithCaregiver && (
                <button
                  type="button"
                  onClick={() => {
                    setModalCaregiver(null);
                    openDiscussionWithCaregiver(modalCaregiver);
                  }}
                  className="w-full bg-white hover:bg-[#FAF8F5] text-[#1E4030] border-2 border-[#1E4030] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>Chat in Discussions</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
