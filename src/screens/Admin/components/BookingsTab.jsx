import React, { useState } from 'react';
import { Search, Calendar, Eye, ChevronDown, Filter } from 'lucide-react';

export default function BookingsTab({ bookings, setSelectedUser, onSelectBooking }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Simple search filter logic
  const filtered = bookings.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.caregiver.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section with icon on left */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#EDF7F2] border border-green-200/60 rounded-2xl flex items-center justify-center text-[#1E4030] shadow-xs">
            <Calendar size={22} />
          </div>
          <div>
            <h2 className="text-[#1C1A17] font-display text-2xl font-bold flex items-center gap-2">
              Bookings & Escrow
              <span className="bg-[#EDE8E1] text-[#1E4030] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D9D2C8]">
                {bookings.length} total
              </span>
            </h2>
            <p className="text-xs text-[#8A7E74]">Real-time monitor of platform bookings, escrow status, and session progress.</p>
          </div>
        </div>
      </div>

      {/* Search and filter toolbar */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
          <input
            type="text"
            placeholder="Search by ref ID, household, caregiver or service..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E2D9CF] rounded-xl text-xs outline-none bg-[#FAF8F5] focus:ring-1 focus:ring-[#1E4030] text-[#1C1A17] font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
          >
            <option value="All">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Disputed">Disputed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E2D9CF] text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider">
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Household</th>
                <th className="px-6 py-4">Caregiver</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">When</th>
                <th className="px-6 py-4">Amount (XAF)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-xs text-[#8A7E74]">
                    No bookings match your current filter query.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';
                  
                  if (b.status === 'Completed') {
                    badgeStyle = 'bg-[#EDF7F2] text-[#1D6F42] border border-green-200';
                  } else if (b.status === 'In Progress') {
                    badgeStyle = 'bg-blue-50 text-blue-700 border border-blue-200';
                  } else if (b.status === 'Scheduled') {
                    badgeStyle = 'bg-purple-50 text-purple-700 border border-purple-200';
                  } else if (b.status === 'Cancelled') {
                    badgeStyle = 'bg-red-50 text-red-600 border border-red-200';
                  } else if (b.status === 'Disputed') {
                    badgeStyle = 'bg-amber-100 text-amber-800 border border-amber-200';
                  }

                  return (
                    <tr key={b.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="px-6 py-4 font-mono text-[11px] font-bold text-[#1E4030]">{b.id}</td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedUser && setSelectedUser({ name: b.client, role: 'Household', city: 'Yaounde', initials: b.client.charAt(0) })}
                          className="text-[#1C1A17] hover:text-[#1E4030] hover:underline font-bold text-left cursor-pointer transition-colors"
                        >
                          {b.client}
                        </button>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedUser && setSelectedUser({ name: b.caregiver, role: 'Caregiver', city: 'Douala', initials: b.caregiver.charAt(0) })}
                          className="text-[#1C1A17] hover:text-[#1E4030] hover:underline font-bold text-left cursor-pointer transition-colors"
                        >
                          {b.caregiver}
                        </button>
                      </td>

                      <td className="px-6 py-4 font-medium text-[#8A7E74]">{b.service}</td>
                      <td className="px-6 py-4 text-[#8A7E74] whitespace-nowrap">{b.date}</td>
                      <td className="px-6 py-4 font-bold text-[#1C1A17]">{b.amount}</td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => onSelectBooking && onSelectBooking(b)}
                          title="View Complete Booking Details"
                          className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E2D9CF] text-[#8A7E74] hover:text-[#1E4030] hover:border-[#1E4030] hover:bg-white transition-all inline-flex items-center justify-center cursor-pointer shadow-2xs"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

