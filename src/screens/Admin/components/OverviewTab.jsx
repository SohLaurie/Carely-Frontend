import React from 'react';
import {
  Activity,
  FileCheck,
  AlertOctagon,
  CalendarDays,
  Wallet,
  Check,
  Clock,
  ArrowUpRight,
  ChevronRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function OverviewTab({
  applications,
  disputes,
  users,
  bookings,
  recentActivity,
  revenueStats,
  setActiveTab,
  setSelectedApplication,
  setSelectedDispute
}) {
  // Show first 3 applications in queue
  const queueApplications = applications.slice(0, 3);
  
  // Show first 3 open disputes in queue
  const queueDisputes = disputes.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header section with Platform Health */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[#1C1A17] font-display text-xl font-bold">Overview</h2>
          <p className="text-xs text-[#8A7E74]">Welcome back, Samuel. Platform health and items needing your attention.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#EDF7F2] border border-green-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#1D6F42]">
          <Activity size={14} className="animate-pulse" />
          <span>Uptime <strong className="text-[#1E4030]">99.98%</strong></span>
          <span className="text-[10px] text-[#8A7E74] font-medium">&middot; last 30 days</span>
        </div>
      </div>

      {/* Grid of 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Pending Verifications */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Pending Verifications</span>
            <div className="text-2xl font-bold text-[#1C1A17] font-display">{applications.length}</div>
            <span className="text-[10px] text-amber-700 font-semibold bg-[#FEF3C7] px-2 py-0.5 rounded-full">3 waiting &gt;48h</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
            <FileCheck size={16} />
          </div>
        </div>

        {/* Card 2: Open Disputes */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Open Disputes</span>
            <div className="text-2xl font-bold text-[#1C1A17] font-display">{disputes.length}</div>
            <span className="text-[10px] text-[#991B1B] font-semibold bg-[#FEE2E2] px-2 py-0.5 rounded-full">1 nearing SLA</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-sm shrink-0">
            <AlertOctagon size={16} />
          </div>
        </div>

        {/* Card 3: Active Bookings */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Active Bookings Today</span>
            <div className="text-2xl font-bold text-[#1C1A17] font-display">184</div>
            <span className="text-[10px] text-green-700 font-semibold bg-[#EDF7F2] px-2 py-0.5 rounded-full">+12 vs yesterday</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 shadow-sm shrink-0">
            <CalendarDays size={16} />
          </div>
        </div>

        {/* Card 4: Revenue */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition-all">
          <div className="space-y-2">
            <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Platform Revenue (Nov)</span>
            <div className="text-2xl font-bold text-[#1C1A17] font-display">{revenueStats.value}</div>
            <span className="text-[10px] text-[#1E4030] font-semibold bg-[#EDE8E1] px-2 py-0.5 rounded-full">18% commission &middot; +9%</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#EDE8E1] flex items-center justify-center text-[#1E4030] shadow-sm shrink-0">
            <Wallet size={16} />
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        
        {/* Left Column widgets */}
        <div className="space-y-6">
          
          {/* Caregiver Verification Queue Widget */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#1C1A17] text-sm">Provider Verification Queue</h3>
                <span className="bg-[#FEF3C7] text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  {applications.length} pending
                </span>
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs text-[#1E4030] font-bold flex items-center gap-1 hover:underline"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-[11px] text-[#8A7E74] leading-relaxed -mt-2">
              Vet documents, then approve or reject.
            </p>

            <div className="divide-y divide-[#EFECE6] pt-1">
              {queueApplications.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#8A7E74]">No pending verifications.</div>
              ) : (
                queueApplications.map((app) => (
                  <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-2 last:pb-0">
                    <div className="flex items-start gap-3">
                      {/* Initials Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-amber-200">
                        {app.initials}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-xs text-[#1C1A17]">{app.name}</h4>
                          <span className="bg-[#EDE8E1] text-[#1C1A17] text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {app.category} &middot; {app.location}
                          </span>
                        </div>
                        
                        {/* Badges indicators */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${
                            app.idVerified 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}>
                            {app.idVerified && <Check size={10} />} ID (CNI)
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${
                            app.certVerified 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}>
                            {app.certVerified && <Check size={10} />} Certifications
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${
                            app.refVerified 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}>
                            {app.refVerified ? <Check size={10} /> : <Clock size={10} />} References
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8A7E74]">Submitted {app.submissionTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                      >
                        <Check size={12} />
                        Review
                      </button>
                      <button
                        onClick={() => setSelectedApplication(app)}
                        className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#EFECE6] font-semibold text-xs px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1"
                      >
                        <MessageSquare size={12} />
                        More info
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Open Disputes Widget */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#1C1A17] text-sm">Open Disputes</h3>
                <span className="bg-red-100 text-[#991B1B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                  {disputes.length} open
                </span>
              </div>
              <button
                onClick={() => setActiveTab('disputes')}
                className="text-xs text-[#1E4030] font-bold flex items-center gap-1 hover:underline"
              >
                <span>Manage</span>
                <ChevronRight size={14} />
              </button>
            </div>
            <p className="text-[11px] text-[#8A7E74] leading-relaxed -mt-2">
              Review evidence and settle the escrow.
            </p>

            <div className="divide-y divide-[#EFECE6] pt-1">
              {queueDisputes.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#8A7E74]">No active disputes.</div>
              ) : (
                queueDisputes.map((disp) => {
                  let slaColor = 'bg-gray-100 text-gray-700 border-gray-200';
                  if (disp.urgency === 'high') {
                    slaColor = 'bg-amber-100 text-amber-800 border-amber-200';
                  } else if (disp.urgency === 'breached') {
                    slaColor = 'bg-red-100 text-[#991B1B] border-red-200';
                  }

                  return (
                    <div key={disp.id} className="py-4 space-y-3 first:pt-2 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] bg-secondary border border-[#E2D9CF] px-2 py-0.5 rounded-full font-mono text-[#8A7E74]">
                            {disp.id}
                          </span>
                          <h4 className="font-semibold text-xs text-[#1C1A17]">{disp.title}</h4>
                        </div>
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${slaColor} flex items-center gap-1 shrink-0`}>
                          <Clock size={10} />
                          {disp.raisedTime} &middot; {disp.timeLeft}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A7E74] leading-relaxed">{disp.description}</p>
                      
                      <div className="flex items-center justify-between gap-4 pt-1">
                        <span className="text-xs text-[#1C1A17] font-medium">
                          Escrow held: <strong className="text-[#1E4030]">{disp.escrowAmount}</strong>
                        </span>
                        <button
                          onClick={() => setSelectedDispute(disp)}
                          className="bg-white border border-[#E2D9CF] hover:bg-[#EFECE6] text-[#1C1A17] font-semibold text-xs px-4 py-1.5 rounded-xl transition-all shadow-sm flex items-center gap-1"
                        >
                          <ArrowUpRight size={12} />
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column widgets */}
        <div className="space-y-6">
          
          {/* Revenue Commission Card */}
          <div className="bg-[#EDE8E1] border border-[#E2D9CF] rounded-2xl p-5 shadow-sm relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6"></div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-[#1C1A17]">Revenue</h3>
              <div className="w-8 h-8 rounded-full bg-[#1E4030] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Wallet size={14} />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">{revenueStats.commission}</span>
              <div className="text-3xl font-display font-bold text-[#1C1A17]">{revenueStats.value}</div>
              <p className="text-[10px] text-[#1D6F42] font-semibold flex items-center gap-1">
                <Sparkles size={10} />
                {revenueStats.comparison}
              </p>
            </div>

            {/* Metric Rows */}
            <div className="pt-2 space-y-2 border-t border-[#D9D2C8] text-xs">
              <div className="flex justify-between py-1">
                <span className="text-[#8A7E74]">Bookings</span>
                <span className="font-bold text-[#1C1A17]">{revenueStats.bookings}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-[#EFECE6]">
                <span className="text-[#8A7E74]">GMV</span>
                <span className="font-bold text-[#1C1A17]">{revenueStats.gmv}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-[#EFECE6]">
                <span className="text-[#8A7E74]">Payouts sent</span>
                <span className="font-bold text-[#1C1A17]">{revenueStats.payoutsSent}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-[#EFECE6]">
                <span className="text-[#8A7E74]">Refunds</span>
                <span className="font-bold text-[#1C1A17]">{revenueStats.refunds}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('payments')}
              className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold text-xs py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Payments & payouts</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Recent Activity Timeline Widget */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-[#1C1A17] text-sm">Recent Activity</h3>
            </div>
            <p className="text-[11px] text-[#8A7E74] leading-relaxed -mt-2">
              Platform-wide events
            </p>

            <div className="flow-root pt-1">
              <ul className="-mb-8">
                {recentActivity.map((act, actIdx) => {
                  let markerBg = 'bg-[#EDE8E1] text-[#8A7E74]';
                  if (act.iconType === 'completed') {
                    markerBg = 'bg-green-100 text-green-700';
                  } else if (act.iconType === 'cancelled') {
                    markerBg = 'bg-red-100 text-red-700';
                  } else if (act.iconType === 'dispute') {
                    markerBg = 'bg-amber-100 text-amber-700';
                  } else if (act.iconType === 'application') {
                    markerBg = 'bg-blue-100 text-blue-700';
                  }

                  return (
                    <li key={act.id}>
                      <div className="relative pb-8">
                        {actIdx !== recentActivity.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-[#EFECE6]" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${markerBg}`}>
                              {/* Simple representative text markers to avoid dynamic rendering issues */}
                              <span className="text-[8px] font-bold uppercase">
                                {act.iconType.substring(0, 2)}
                              </span>
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs font-semibold text-[#1C1A17]">{act.text}</p>
                              <p className="text-[10px] text-[#8A7E74] mt-0.5">{act.subtext}</p>
                            </div>
                            <div className="text-right text-[9px] whitespace-nowrap text-[#8A7E74] font-medium">
                              {act.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
