import React, { useState } from 'react';
import { Search, Calendar, Eye, ChevronDown } from 'lucide-react';

export default function BookingsTab({ bookings, setSelectedUser }) {
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
    <div className="space-y-6">
      {/* Header section with icon on left */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#EFECE6] border border-[#E2D9CF] rounded-xl flex items-center justify-center text-[#8A7E74] shrink-0">
          <Calendar size={18} />
        </div>
        <div>
          <h2 className="text-[#1C1A17] font-display text-xl font-bold">Bookings</h2>
          <p className="text-xs text-[#8A7E74]">Read-only view of platform-wide booking activity.</p>
        </div>
      </div>

      {/* Search and filter toolbar */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
          <input
            type="text"
            placeholder="Search by ref, household or caregiver"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E2D9CF] rounded-xl text-xs outline-none bg-[#FAF8F5] focus:ring-1 focus:ring-[#1E4030] text-[#1C1A17]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Status filter pill */}
          <button className="bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1C1A17] flex items-center gap-1 hover:bg-[#EFECE6] transition-colors">
            <span>All statuses</span>
            <ChevronDown size={12} className="text-[#8A7E74]" />
          </button>
          
          {/* Time range filter pill */}
          <button className="bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#1C1A17] flex items-center gap-1 hover:bg-[#EFECE6] transition-colors">
            <span>Last 7 days</span>
            <ChevronDown size={12} className="text-[#8A7E74]" />
          </button>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E2D9CF] text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider">
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Household</th>
                <th className="px-6 py-4">Caregiver</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">When</th>
                <th className="px-6 py-4">Amount (XAF)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-xs">
              {filtered.map((b) => {
                // Colored badges matching screenshots
                let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';
                
                if (b.status === 'Completed') {
                  badgeStyle = 'bg-gray-100 text-gray-700 border border-gray-200';
                } else if (b.status === 'In Progress') {
                  badgeStyle = 'bg-green-100 text-green-800 border border-green-200';
                } else if (b.status === 'Scheduled') {
                  badgeStyle = 'bg-gray-100 text-gray-700 border border-gray-200';
                } else if (b.status === 'Cancelled') {
                  badgeStyle = 'bg-red-50 text-red-600 border border-red-200';
                } else if (b.status === 'Disputed') {
                  badgeStyle = 'bg-amber-100 text-amber-800 border border-amber-200';
                }

                return (
                  <tr key={b.id} className="hover:bg-[#FAF8F5]/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-[11px] font-semibold text-[#8A7E74]">{b.id}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedUser({ name: b.client, role: 'Household', city: 'Yaounde', initials: b.client.charAt(0) })}
                        className="text-[#1E4030] hover:underline font-bold text-left cursor-pointer"
                      >
                        {b.client}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedUser({ name: b.caregiver, role: 'Caregiver', city: 'Douala', initials: b.caregiver.charAt(0) })}
                        className="text-[#1E4030] hover:underline font-bold text-left cursor-pointer"
                      >
                        {b.caregiver}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-[#8A7E74]">{b.service}</td>
                    <td className="px-6 py-4 text-[#8A7E74]">{b.date}</td>
                    <td className="px-6 py-4 font-bold text-[#1C1A17]">{b.amount}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button className="text-gray-400 hover:text-[#1C1A17] transition-colors p-1 cursor-pointer">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
