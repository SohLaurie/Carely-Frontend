import React from 'react'
import {
  Calendar, Clock, Wallet, ShieldCheck, TrendingUp, X,
  HeartHandshake, AlertCircle, Phone, Sparkles, Check,
  Baby, Shirt, User, MessageSquare, Info
} from 'lucide-react'
import { parseBookingMetadata, getExtraTaskLabel, DAY_FULL_LABELS } from '../../../utils/bookingMetadata'
import { TASK_ICON_MAP } from '../../Household/components/booking/ExtraTaskIcons'

export default function BookingDetailsModal({ details, onClose }) {
  if (!details) return null

  const notesRaw = details.notes || details.summary || details.rawBooking?.notes || ''
  const meta = parseBookingMetadata(notesRaw)

  const isRecurring = details.sessionType?.toLowerCase().includes('recurring') ||
    details.bookingType === 'recurring' ||
    (details.totalSessions && details.totalSessions > 1) ||
    (details.schedule && details.schedule.length > 1)

  const hasElderProfile = Boolean(
    meta.elderProfile &&
    (meta.elderProfile.recipient || meta.elderProfile.emergency || meta.elderProfile.medications)
  )

  const hasServiceQuestions = Boolean(
    meta.serviceQuestions && Object.keys(meta.serviceQuestions).length > 0
  )

  const selectedDaysMap = meta.selectedDays || details.rawBooking?.selected_days_map || null
  const singleExtras = meta.singleExtras || []

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#E2D9CF] w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-[#1E4030] text-white p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-green-300">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white tracking-wide">
                Booking Details
              </h3>
              <p className="text-[11px] text-green-200/80 font-mono">
                ID: {details.id || details.bookingId || 'BK-Carely'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Client Profile Card */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#EFECE6] border border-[#E2D9CF] text-[#1E4030] flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                {details.initials || 'HC'}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C1A17]">{details.clientName || 'Household Client'}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[11px] bg-[#FAF8F5] text-[#1E4030] border border-[#E2D9CF] px-2.5 py-0.5 rounded-full font-bold">
                    {details.specialty || meta.serviceLabel || 'Care Service'}
                  </span>
                  <span className="text-[11px] text-[#8A7E74] font-medium">
                    &middot; {details.location || 'Yaoundé / Douala'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8A7E74] font-bold block uppercase tracking-wider">Status</span>
              <span className="text-[10px] text-[#1D6F42] font-extrabold bg-[#EDF7F2] border border-green-200 px-2.5 py-0.5 rounded-full mt-0.5 inline-block">
                {details.status || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* ── Elderly Care Profile Section ── */}
          {hasElderProfile && (
            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#F7F4EE] border border-[#DFCBB9] rounded-2xl p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EBDCCF] pb-2.5">
                <h4 className="font-bold text-xs text-[#6B3A19] flex items-center gap-2 uppercase tracking-wide">
                  <HeartHandshake size={15} className="text-[#A75D28]" />
                  <span>Elderly Care Recipient Profile</span>
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FAF0E6] text-[#A75D28] border border-[#E8CDBB] rounded-full">
                  Step 4 Details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/90 p-3 rounded-xl border border-[#EBDCCF]/70">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Care Recipient</span>
                  <p className="font-bold text-[#1C1A17] mt-0.5">
                    {meta.elderProfile.recipient || 'Not specified'}
                  </p>
                </div>

                <div className="bg-white/90 p-3 rounded-xl border border-[#EBDCCF]/70">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Emergency Contact</span>
                  <p className="font-bold text-[#1C1A17] mt-0.5 flex items-center gap-1.5">
                    <Phone size={12} className="text-[#2D6A4F]" />
                    <span>{meta.elderProfile.emergency || 'Not specified'}</span>
                  </p>
                </div>

                <div className="bg-white/90 p-3 rounded-xl border border-[#EBDCCF]/70">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Allergies</span>
                  <p className="font-medium text-[#1C1A17] mt-0.5">
                    {meta.elderProfile.allergies && meta.elderProfile.allergies.toLowerCase() !== 'none' ? (
                      <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md font-semibold text-[11px] inline-block">
                        {meta.elderProfile.allergies}
                      </span>
                    ) : (
                      <span className="text-[#8A7E74]">None reported</span>
                    )}
                  </p>
                </div>

                <div className="bg-white/90 p-3 rounded-xl border border-[#EBDCCF]/70">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Medication Reminders</span>
                  <p className="font-medium text-[#1C1A17] mt-0.5">
                    {meta.elderProfile.medications && meta.elderProfile.medications.toLowerCase() !== 'none' ? (
                      <span className="text-[#1E4030] bg-[#EDF7F2] border border-green-200 px-2 py-0.5 rounded-md font-semibold text-[11px] inline-block">
                        {meta.elderProfile.medications}
                      </span>
                    ) : (
                      <span className="text-[#8A7E74]">No medication reminders</span>
                    )}
                  </p>
                </div>

                {meta.elderProfile.pets && (
                  <div className="sm:col-span-2 bg-white/90 p-3 rounded-xl border border-[#EBDCCF]/70">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Pets at Property</span>
                    <p className="font-medium text-[#1C1A17] mt-0.5">
                      {meta.elderProfile.pets}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Service Specific Questions Card (Babysitting / Laundry) ── */}
          {hasServiceQuestions && (
            <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 space-y-3 shadow-xs">
              <h4 className="font-bold text-xs text-[#1C1A17] border-b border-[#EFECE6] pb-2 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#2D6A4F]" />
                <span>Service Specific Requirements</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {meta.serviceQuestions.childrenCount && (
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2D9CF]/60">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Children</span>
                    <p className="text-xs font-bold text-[#1E4030] mt-0.5 flex items-center gap-1">
                      <Baby size={13} />
                      <span>{meta.serviceQuestions.childrenCount}</span>
                    </p>
                  </div>
                )}

                {meta.serviceQuestions.includesNewborns && (
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2D9CF]/60">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Newborns</span>
                    <p className="text-xs font-bold text-[#1E4030] mt-0.5">
                      {meta.serviceQuestions.includesNewborns}
                    </p>
                  </div>
                )}

                {meta.serviceQuestions.machineWashLoads && (
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2D9CF]/60">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Machine Wash</span>
                    <p className="text-xs font-bold text-[#1E4030] mt-0.5 flex items-center gap-1">
                      <Shirt size={13} />
                      <span>{meta.serviceQuestions.machineWashLoads}</span>
                    </p>
                  </div>
                )}

                {meta.serviceQuestions.ironClothesLoads && (
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2D9CF]/60">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Iron Clothes</span>
                    <p className="text-xs font-bold text-[#1E4030] mt-0.5">
                      {meta.serviceQuestions.ironClothesLoads}
                    </p>
                  </div>
                )}

                {meta.serviceQuestions.pets && (
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E2D9CF]/60">
                    <span className="text-[10px] font-bold text-[#8A7E74] uppercase block">Pets</span>
                    <p className="text-xs font-bold text-[#1E4030] mt-0.5">
                      {meta.serviceQuestions.pets}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Schedule & Per-Day Extra Tasks Card ── */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2.5">
              <h4 className="font-bold text-xs text-[#1C1A17] flex items-center gap-1.5">
                <Clock size={14} className="text-[#2D6A4F]" />
                <span>Schedule & Session Breakdown</span>
              </h4>
              <span className="text-[10px] text-[#1E4030] font-bold bg-[#EDF7F2] px-2.5 py-0.5 rounded-full border border-green-200">
                {isRecurring ? 'Recurring Schedule' : 'Single Session'}
              </span>
            </div>

            {/* If Recurring with Per-Day Extras */}
            {selectedDaysMap && Object.keys(selectedDaysMap).length > 0 ? (
              <div className="space-y-3">
                <p className="text-[11px] font-semibold text-[#8A7E74]">
                  Configured Days & Day-Specific Extra Tasks:
                </p>
                <div className="space-y-2">
                  {Object.entries(selectedDaysMap).map(([dayKey, dayCfg]) => {
                    const dayLabel = DAY_FULL_LABELS[dayKey] || dayKey.toUpperCase()
                    const dayExtras = dayCfg?.extras || []

                    return (
                      <div key={dayKey} className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl p-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#1C1A17] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#2D6A4F]"></span>
                            {dayLabel}
                          </span>
                          <span className="text-[11px] font-mono font-semibold text-[#8A7E74]">
                            {dayCfg?.startTime || '08:00'} – {dayCfg?.endTime || '12:00'}
                          </span>
                        </div>

                        {/* Specific Extra Tasks for this particular day */}
                        <div className="pt-1">
                          {dayExtras.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="text-[10px] text-[#8A7E74] font-medium">Extra Tasks:</span>
                              {dayExtras.map(taskId => {
                                const Icon = TASK_ICON_MAP[taskId]
                                return (
                                  <span
                                    key={taskId}
                                    className="inline-flex items-center gap-1 text-[10px] bg-white text-[#1E4030] border border-[#2D6A4F]/30 px-2 py-0.5 rounded-full font-bold shadow-2xs"
                                  >
                                    {Icon && <Icon size={11} color="#2D6A4F" />}
                                    {getExtraTaskLabel(taskId)}
                                  </span>
                                )
                              })}
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#8A7E74] italic">
                              Standard care session (no extra tasks)
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Single session or basic schedule list */
              <div className="space-y-2.5">
                {details.schedule && details.schedule.map((sess, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#FAF8F5] p-3 rounded-xl border border-[#EFECE6]/80">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#1E4030] text-white text-[10px] font-extrabold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#1C1A17]">{sess.date}</p>
                        <p className="text-[10px] text-[#8A7E74] mt-0.5 font-mono">{sess.time}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold">
                      {sess.status || 'Confirmed'}
                    </span>
                  </div>
                ))}

                {/* Single session extra tasks */}
                {singleExtras.length > 0 && (
                  <div className="pt-2 border-t border-[#EFECE6]">
                    <span className="text-[11px] font-bold text-[#8A7E74] block mb-1.5">
                      Selected Extra Tasks:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {singleExtras.map(taskId => {
                        const Icon = TASK_ICON_MAP[taskId]
                        return (
                          <span
                            key={taskId}
                            className="inline-flex items-center gap-1.5 text-[11px] bg-[#EDF7F2] text-[#1E4030] border border-green-200 px-2.5 py-1 rounded-full font-bold"
                          >
                            {Icon && <Icon size={13} color="#1E4030" />}
                            {getExtraTaskLabel(taskId)}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Client Special Instructions / Notes ── */}
          {meta.userNote && (
            <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 space-y-1.5 shadow-xs">
              <h4 className="font-bold text-xs text-[#1C1A17] flex items-center gap-1.5">
                <MessageSquare size={13} className="text-[#8A7E74]" />
                <span>Special Instructions</span>
              </h4>
              <p className="text-xs text-[#5A5248] italic bg-[#FAF8F5] p-3 rounded-xl border border-[#E2D9CF]/50 leading-relaxed">
                "{meta.userNote}"
              </p>
            </div>
          )}

          {/* ── Payout Breakdown Card ── */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-3.5 shadow-xs">
            <h4 className="font-bold text-xs text-[#1C1A17] border-b border-[#EFECE6] pb-2.5 flex items-center gap-1.5">
              <Wallet size={14} className="text-[#2D6A4F]" />
              <span>Payout Breakdown</span>
            </h4>

            <div className="space-y-2 text-xs font-medium text-[#8A7E74]">
              <div className="flex justify-between">
                <span>Rate ({details.rate || 'Rate'} x {details.hours || '1'}h x {details.sessionsCount || '1'} sessions)</span>
                <span className="text-[#1C1A17] font-semibold">{details.subtotal || details.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Carely Platform Fee</span>
                <span className="text-red-500 font-semibold">- {details.serviceFee || '5 XAF'}</span>
              </div>
              <div className="flex justify-between border-t border-[#EFECE6] pt-2.5 font-bold text-sm">
                <span className="text-[#1C1A17]">Your Total Payout</span>
                <span className="text-[#1E4030]">{details.total || details.price}</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E2D9CF] p-3 rounded-xl flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-[#1E4030] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#8A7E74] leading-relaxed">
                {details.payoutInfo || 'Payout released from escrow upon arrival OTP presence confirmation & 24h completion window.'}
              </p>
            </div>
          </div>

          {/* ── Next Steps Card ── */}
          {details.nextSteps && details.nextSteps.length > 0 && (
            <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-3 shadow-xs">
              <h4 className="font-bold text-xs text-[#1C1A17] border-b border-[#EFECE6] pb-2 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#2D6A4F]" />
                <span>Next Steps</span>
              </h4>
              <ul className="space-y-2">
                {details.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5 text-[11px] text-[#8A7E74] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E4030] shrink-0 mt-1.5"></span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#E2D9CF] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Close details
          </button>
        </div>
      </div>
    </div>
  )
}
