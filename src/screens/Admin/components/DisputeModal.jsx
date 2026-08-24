import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, Scale, RefreshCw } from 'lucide-react';

export default function DisputeModal({ dispute, onClose, onResolve }) {
  const [refundPercent, setRefundPercent] = useState(50); // 0 (100% caregiver payout), 50 (50/50 split), 100 (100% client refund)

  if (!dispute) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card Container */}
      <div className="relative w-full max-w-lg bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#EFECE6] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center border border-red-200 shrink-0">
              <ShieldAlert size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-[#8A7E74] uppercase tracking-wider">Resolve Claim</h3>
              <p className="text-sm font-bold text-[#1C1A17] -mt-0.5">{dispute.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs max-h-[460px] overflow-y-auto">
          {/* Dispute Parties */}
          <div className="space-y-1">
            <h4 className="font-bold text-[#8A7E74] uppercase text-[10px] tracking-wider">Disputing Parties</h4>
            <div className="text-xs font-bold text-[#1C1A17]">{dispute.title}</div>
            <p className="text-[10px] text-[#8A7E74] pt-0.5">{dispute.raisedTime} &middot; {dispute.timeLeft}</p>
          </div>

          {/* Description of Incident */}
          <div className="space-y-1">
            <h4 className="font-bold text-[#1C1A17]">Household Narrative & Claims</h4>
            <p className="text-xs text-[#8A7E74] bg-[#FAF8F5] border border-[#EFECE6] p-3 rounded-xl leading-relaxed">
              {dispute.description}
            </p>
          </div>

          {/* Incident Details log */}
          <div className="space-y-1 pt-1">
            <h4 className="font-bold text-[#1C1A17]">Escrow Investigation Notes</h4>
            <p className="text-xs text-[#8A7E74] bg-[#FAF8F5] border border-[#EFECE6] p-3 rounded-xl leading-relaxed">
              {dispute.details}
            </p>
          </div>

          {/* Escrow Value */}
          <div className="p-3 bg-[#EDF7F2] border border-green-200 rounded-xl flex items-center justify-between">
            <span className="font-semibold text-green-800">Total Escrow Funds Secured:</span>
            <strong className="text-lg text-[#1E4030] font-display font-bold">{dispute.escrowAmount}</strong>
          </div>

          {/* Settlement Selection */}
          <div className="space-y-3 pt-3 border-t border-[#EFECE6]">
            <h4 className="font-bold text-[#1C1A17] flex items-center gap-1.5">
              <Scale size={14} className="text-[#1E4030]" />
              Arbitration Verdict
            </h4>

            {/* Split options grid */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {/* Option 1: Payout Caregiver */}
              <button
                type="button"
                onClick={() => setRefundPercent(0)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  refundPercent === 0
                    ? 'border-[#1E4030] bg-[#EDF7F2] text-[#1E4030]'
                    : 'border-[#E2D9CF] bg-white text-[#8A7E74] hover:bg-[#FAF8F5]'
                }`}
              >
                <CheckCircle size={15} />
                <span>100% Caregiver</span>
                <span className="text-[9px] font-normal">Release Escrow</span>
              </button>

              {/* Option 2: 50/50 Split */}
              <button
                type="button"
                onClick={() => setRefundPercent(50)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  refundPercent === 50
                    ? 'border-[#1E4030] bg-[#EDF7F2] text-[#1E4030]'
                    : 'border-[#E2D9CF] bg-white text-[#8A7E74] hover:bg-[#FAF8F5]'
                }`}
              >
                <Scale size={15} />
                <span>50 / 50 Split</span>
                <span className="text-[9px] font-normal">Split Escrow</span>
              </button>

              {/* Option 3: Refund Client */}
              <button
                type="button"
                onClick={() => setRefundPercent(100)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  refundPercent === 100
                    ? 'border-[#1E4030] bg-[#EDF7F2] text-[#1E4030]'
                    : 'border-[#E2D9CF] bg-white text-[#8A7E74] hover:bg-[#FAF8F5]'
                }`}
              >
                <RefreshCw size={15} />
                <span>100% Client</span>
                <span className="text-[9px] font-normal">Refund Escrow</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Panel Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#EFECE6] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#EFECE6] font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onResolve(dispute.id, refundPercent)}
            className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Resolve Escrow Contract</span>
          </button>
        </div>
      </div>
    </div>
  );
}
