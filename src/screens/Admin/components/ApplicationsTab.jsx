import React, { useState } from 'react';
import { Search, Check, MessageSquare, Clock, Filter, SlidersHorizontal } from 'lucide-react';

export default function ApplicationsTab({
  applications,
  setSelectedApplication,
  appSearchQuery,
  setAppSearchQuery,
  appServiceFilter,
  setAppServiceFilter
}) {
  const [sortOrder, setSortOrder] = useState('oldest'); // 'oldest' or 'newest'

  // Categories list for the filtering dropdown
  const services = ['All services', 'Home Nursing', 'Elderly Care', 'Babysitting', 'Post-op Care', 'Domestic Help'];

  // Filter and Search logic
  const filtered = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                          app.category.toLowerCase().includes(appSearchQuery.toLowerCase()) ||
                          app.location.toLowerCase().includes(appSearchQuery.toLowerCase());
    
    const matchesService = appServiceFilter === 'All services' || app.category === appServiceFilter;

    return matchesSearch && matchesService;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    // Simple mock comparison since they are pre-defined, we can just sort by id or length of waiting time
    if (sortOrder === 'oldest') {
      return a.id.localeCompare(b.id);
    } else {
      return b.id.localeCompare(a.id);
    }
  });

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[#1C1A17] font-display text-xl font-bold flex items-center gap-2">
            Caregiver Verification
            <span className="bg-[#FEF3C7] text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              {applications.length} pending
            </span>
          </h2>
          <p className="text-xs text-[#8A7E74]">Review pending applications and approve, reject or request more information.</p>
        </div>
      </div>

      {/* Search & Filters Row */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
          <input
            type="text"
            placeholder="Search by name, service or city"
            value={appSearchQuery}
            onChange={e => setAppSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E2D9CF] rounded-xl text-xs outline-none bg-[#FAF8F5] focus:ring-1 focus:ring-[#1E4030] text-[#1C1A17]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Service Dropdown */}
          <div className="relative">
            <select
              value={appServiceFilter}
              onChange={e => setAppServiceFilter(e.target.value)}
              className="appearance-none bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-2 pr-8 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
            >
              {services.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Filter size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7E74] pointer-events-none" />
          </div>

          {/* Sort Order Button */}
          <button
            onClick={() => setSortOrder(prev => prev === 'oldest' ? 'newest' : 'oldest')}
            className="bg-[#FAF8F5] border border-[#E2D9CF] hover:bg-[#EFECE6] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <SlidersHorizontal size={12} />
            <span>{sortOrder === 'oldest' ? 'Oldest first' : 'Newest first'}</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-[#EFECE6]">
          {sorted.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8A7E74]">
              No applications match your search criteria.
            </div>
          ) : (
            sorted.map((app) => (
              <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#FAF8F5]/30">
                <div className="flex items-start gap-4">
                  {/* Initials Avatar */}
                  <div className="w-11 h-11 rounded-full bg-[#FEF3C7] text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200 shadow-sm">
                    {app.initials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-xs text-[#1C1A17]">{app.name}</h4>
                      <span className="bg-[#EDE8E1] text-[#1E4030] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {app.category}
                      </span>
                      <span className="text-[10px] text-[#8A7E74]">
                        &middot; {app.location}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[#EDE8E1] text-[#1C1A17] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D9D2C8] shrink-0">
                        <Clock size={10} />
                        Waiting {app.waitingTime}
                      </span>
                    </div>

                    {/* Badge details */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                        app.idVerified 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {app.idVerified && <Check size={10} />} ID (CNI)
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                        app.certVerified 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {app.certVerified && <Check size={10} />} Certifications
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                        app.refVerified 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-gray-50 text-gray-500 border border-gray-200'
                      }`}>
                        {app.refVerified ? <Check size={10} /> : <Clock size={10} />} References
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-[#8A7E74] pt-0.5">Submitted {app.submissionTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Check size={12} />
                    Review
                  </button>
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#EFECE6] font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare size={12} />
                    Ask
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
