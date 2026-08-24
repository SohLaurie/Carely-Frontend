import React, { useState } from 'react';
import { Wallet, Sliders, ArrowUpRight, Download } from 'lucide-react';

export default function PaymentsTab({ revenueStats }) {
  // Inputs state
  const [standardCommission, setStandardCommission] = useState('18');
  const [recurringCommission, setRecurringCommission] = useState('15');
  const [payoutSchedule, setPayoutSchedule] = useState('Every Friday');
  const [minThreshold, setMinThreshold] = useState('5,000');

  const payouts = [
    { date: 'Mar 15, 2026', caregiver: 'Marie-Claire Nkomo', method: 'MTN Mobile Money', amount: '28,400', status: 'Sent' },
    { date: 'Mar 15, 2026', caregiver: 'Elise Ngo', method: 'Orange Money', amount: '18,700', status: 'Sent' },
    { date: 'Mar 15, 2026', caregiver: 'Patrick Nguema', method: 'MTN Mobile Money', amount: '12,000', status: 'Processing' },
    { date: 'Mar 14, 2026', caregiver: 'Claire Mbede', method: 'Bank transfer', amount: '34,200', status: 'Sent' },
    { date: 'Mar 14, 2026', caregiver: 'Serge Talla', method: 'MTN Mobile Money', amount: '9,600', status: 'Failed' }
  ];

  return (
    <div className="space-y-6">
      {/* Header section with card/wallet icon */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#EFECE6] border border-[#E2D9CF] rounded-xl flex items-center justify-center text-[#8A7E74] shrink-0">
          <Wallet size={18} />
        </div>
        <div>
          <h2 className="text-[#1C1A17] font-display text-xl font-bold">Payments & Commission</h2>
          <p className="text-xs text-[#8A7E74]">Payout logs and platform commission configuration.</p>
        </div>
      </div>

      {/* Grid of 4 financial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-1.5">
          <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Payouts Sent (Nov)</span>
          <div className="text-2xl font-bold text-[#1C1A17] font-display">{revenueStats.payoutsSent}</div>
        </div>

        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-1.5">
          <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Commission Earned</span>
          <div className="text-2xl font-bold text-[#1C1A17] font-display">{revenueStats.value}</div>
        </div>

        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-1.5">
          <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Pending Payouts</span>
          <div className="text-2xl font-bold text-[#1C1A17] font-display">184 <span className="text-xs font-normal text-[#8A7E74] font-sans">caregivers</span></div>
        </div>

        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-1.5">
          <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Refunds</span>
          <div className="text-2xl font-bold text-[#1C1A17] font-display">{revenueStats.refunds}</div>
        </div>
      </div>

      {/* Split columns: Payout log left, Commission settings right */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        
        {/* Left Card: Payout log */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#1C1A17] text-sm">Payout log</h3>
              <p className="text-[10px] text-[#8A7E74]">Most recent transfers to caregivers</p>
            </div>
            <button className="bg-[#FAF8F5] border border-[#E2D9CF] hover:bg-[#EFECE6] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5 transition-all">
              <Download size={12} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EFECE6] text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider">
                  <th className="pb-3 pr-2">Date</th>
                  <th className="pb-3 px-2">Caregiver</th>
                  <th className="pb-3 px-2">Method</th>
                  <th className="pb-3 px-2">Amount (XAF)</th>
                  <th className="pb-3 pl-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] text-xs">
                {payouts.map((p, idx) => {
                  let badgeStyle = 'bg-gray-100 text-gray-700 border-gray-200';
                  if (p.status === 'Sent') {
                    badgeStyle = 'bg-green-100 text-green-800 border border-green-200';
                  } else if (p.status === 'Processing') {
                    badgeStyle = 'bg-amber-100 text-amber-800 border border-amber-200';
                  } else if (p.status === 'Failed') {
                    badgeStyle = 'bg-red-50 text-red-700 border border-red-200';
                  }

                  return (
                    <tr key={idx} className="hover:bg-[#FAF8F5]/30 transition-colors">
                      <td className="py-3.5 pr-2 text-[#8A7E74]">{p.date}</td>
                      <td className="py-3.5 px-2 font-bold text-[#1C1A17]">{p.caregiver}</td>
                      <td className="py-3.5 px-2 text-[#8A7E74]">{p.method}</td>
                      <td className="py-3.5 px-2 font-bold text-[#1C1A17]">{p.amount}</td>
                      <td className="py-3.5 pl-2 whitespace-nowrap">
                        <span className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Card: Commission settings */}
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sliders size={15} className="text-[#8A7E74]" />
            <h3 className="font-semibold text-[#1C1A17] text-sm">Commission settings</h3>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Standard commission (%)</label>
              <input
                type="text"
                value={standardCommission}
                onChange={e => setStandardCommission(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#1E4030] bg-[#FAF8F5] text-[#1C1A17] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Recurring booking commission (%)</label>
              <input
                type="text"
                value={recurringCommission}
                onChange={e => setRecurringCommission(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#1E4030] bg-[#FAF8F5] text-[#1C1A17] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Payout schedule</label>
              <input
                type="text"
                value={payoutSchedule}
                onChange={e => setPayoutSchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#1E4030] bg-[#FAF8F5] text-[#1C1A17] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Minimum payout threshold (XAF)</label>
              <input
                type="text"
                value={minThreshold}
                onChange={e => setMinThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#1E4030] bg-[#FAF8F5] text-[#1C1A17] font-medium"
              />
            </div>

            <button
              type="button"
              className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm cursor-pointer text-center"
            >
              Save changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
