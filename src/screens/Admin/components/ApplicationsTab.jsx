import React, { useState } from 'react';
import {
  Search, Check, MessageSquare, Clock, Filter, SlidersHorizontal,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle, Banknote, Compass
} from 'lucide-react';

export default function ApplicationsTab({
  applications = [],
  setSelectedApplication,
  appSearchQuery = '',
  setAppSearchQuery = () => {},
  appStatusFilter = 'all',
  setAppStatusFilter,
  appServiceFilter,
  setAppServiceFilter
}) {
  const [sortOrder, setSortOrder] = useState('oldest'); // 'oldest' or 'newest'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const activeFilter = (appStatusFilter || appServiceFilter || 'all').toLowerCase();

  const handleStatusChange = (newStatus) => {
    if (setAppStatusFilter) setAppStatusFilter(newStatus);
    if (setAppServiceFilter) setAppServiceFilter(newStatus);
    setCurrentPage(1);
  };

  // Status counts across all loaded applications
  const counts = {
    all: applications.length,
    pending: applications.filter(a => (a.approvalStatus || a.status || 'pending').toLowerCase() === 'pending').length,
    approved: applications.filter(a => (a.approvalStatus || a.status || '').toLowerCase() === 'approved').length,
    rejected: applications.filter(a => (a.approvalStatus || a.status || '').toLowerCase() === 'rejected').length,
  };

  // Status options for the filtering dropdown
  const statusOptions = [
    { value: 'all', label: 'All applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  // Filter and Search logic (filtered strictly by status, not services)
  const filtered = applications.filter(app => {
    const appStatus = (app.approvalStatus || app.status || 'pending').toLowerCase();
    const matchesStatus = (activeFilter === 'all' || activeFilter === 'all applications' || !activeFilter)
      ? true
      : appStatus === activeFilter;

    const q = appSearchQuery.trim().toLowerCase();
    const matchesSearch = !q || (
      (app.name && app.name.toLowerCase().includes(q)) ||
      (app.category && app.category.toLowerCase().includes(q)) ||
      (app.location && app.location.toLowerCase().includes(q)) ||
      (app.email && app.email.toLowerCase().includes(q)) ||
      (app.phone && app.phone.toLowerCase().includes(q))
    );

    return matchesStatus && matchesSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'oldest') {
      return (a.id || '').localeCompare(b.id || '');
    } else {
      return (b.id || '').localeCompare(a.id || '');
    }
  });

  // Pagination calculation
  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginated = sorted.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[#1C1A17] font-display text-xl font-bold flex items-center gap-2">
            Provider Verification
            <span className="bg-[#FEF3C7] text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              {counts.pending} pending
            </span>
          </h2>
          <p className="text-xs text-[#8A7E74]">Review, filter and manage provider applications and credential approvals.</p>
        </div>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleStatusChange('all')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-[#1E4030] text-white shadow-sm'
              : 'bg-white text-[#8A7E74] border border-[#E2D9CF] hover:bg-[#FAF8F5] hover:text-[#1C1A17]'
          }`}
        >
          <span>All Applications</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            activeFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
          }`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => handleStatusChange('pending')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'pending'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-[#FEF3C7]/60 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Clock size={12} />
          <span>Pending</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            activeFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-amber-200 text-amber-900'
          }`}>
            {counts.pending}
          </span>
        </button>

        <button
          onClick={() => handleStatusChange('approved')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'approved'
              ? 'bg-green-700 text-white shadow-sm'
              : 'bg-[#EDF7F2] text-[#1D6F42] border border-green-200 hover:bg-green-100'
          }`}
        >
          <CheckCircle2 size={12} />
          <span>Approved</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            activeFilter === 'approved' ? 'bg-white/20 text-white' : 'bg-green-200 text-green-900'
          }`}>
            {counts.approved}
          </span>
        </button>

        <button
          onClick={() => handleStatusChange('rejected')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'rejected'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }`}
        >
          <XCircle size={12} />
          <span>Rejected</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
            activeFilter === 'rejected' ? 'bg-white/20 text-white' : 'bg-red-200 text-red-900'
          }`}>
            {counts.rejected}
          </span>
        </button>
      </div>

      {/* Search & Filters Row */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
          <input
            type="text"
            placeholder="Search by name, profession, city or email"
            value={appSearchQuery}
            onChange={e => {
              setAppSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-[#E2D9CF] rounded-xl text-xs outline-none bg-[#FAF8F5] focus:ring-1 focus:ring-[#1E4030] text-[#1C1A17]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Status Dropdown Filter */}
          <div className="relative">
            <select
              value={activeFilter}
              onChange={e => handleStatusChange(e.target.value)}
              className="appearance-none bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-2 pr-8 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
          {paginated.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8A7E74]">
              No applications match your status and search criteria.
            </div>
          ) : (
            paginated.map((app) => {
              const statusLower = (app.approvalStatus || app.status || 'pending').toLowerCase();
              const isApproved = statusLower === 'approved';
              const isRejected = statusLower === 'rejected';
              const isPending = !isApproved && !isRejected;

              return (
                <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-[#FAF8F5]/30">
                  <div className="flex items-start gap-4">
                    {/* Initials Avatar */}
                    <div className="w-11 h-11 rounded-full bg-[#FEF3C7] text-amber-800 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-200 shadow-sm">
                      {app.initials}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-xs text-[#1C1A17]">{app.name}</h4>

                        {/* Status Badge */}
                        {isApproved && (
                          <span className="bg-[#EDF7F2] text-[#1D6F42] border border-green-200 text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 size={10} /> Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <XCircle size={10} /> Rejected
                          </span>
                        )}
                        {isPending && (
                          <span className="bg-[#FEF3C7] text-amber-800 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Clock size={10} /> Pending
                          </span>
                        )}

                        <span className="bg-[#EDE8E1] text-[#1E4030] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {app.category}
                        </span>

                        <span className="text-[10px] text-[#8A7E74]">
                          &middot; {app.location}
                        </span>

                        <span className="inline-flex items-center gap-1 bg-[#FAF8F5] text-[#1E4030] border border-[#E2D9CF] text-[9px] font-semibold px-2 py-0.5 rounded-full">
                          <Banknote size={10} className="text-amber-600" />
                          {Number(app.hourlyRate || app.pricePerHour || 500).toLocaleString()} XAF/hr
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
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-200">
                          <Compass size={10} /> Radius: {app.serviceRadius || '15 km'}
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
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#8A7E74]">
            Showing <span className="font-semibold text-[#1C1A17]">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-[#1C1A17]">{endIndex}</span> of{' '}
            <span className="font-semibold text-[#1C1A17]">{totalItems}</span> applications
          </div>

          <div className="flex items-center gap-2">
            {/* Rows per page selector */}
            <div className="flex items-center gap-1.5 mr-2 text-xs text-[#8A7E74]">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-lg px-2 py-1 text-xs text-[#1C1A17] font-semibold cursor-pointer focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Previous button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={validPage <= 1}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                validPage <= 1
                  ? 'border-[#E2D9CF] text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'border-[#E2D9CF] text-[#1C1A17] bg-white hover:bg-[#FAF8F5] cursor-pointer'
              }`}
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    page === validPage
                      ? 'bg-[#1E4030] text-white shadow-sm'
                      : 'bg-white border border-[#E2D9CF] text-[#1C1A17] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={validPage >= totalPages}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                validPage >= totalPages
                  ? 'border-[#E2D9CF] text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'border-[#E2D9CF] text-[#1C1A17] bg-white hover:bg-[#FAF8F5] cursor-pointer'
              }`}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
