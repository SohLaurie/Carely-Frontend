import React, { useState, useEffect } from 'react'
import { X, Plus, Clock, Check, Trash2, Calendar, AlertCircle, Sparkles, RefreshCw } from 'lucide-react'
import { fetchMySchedule, saveMySchedule } from '../../../services/availabilityApi'

const DAYS = [
  { id: 0, label: 'Monday' },
  { id: 1, label: 'Tuesday' },
  { id: 2, label: 'Wednesday' },
  { id: 3, label: 'Thursday' },
  { id: 4, label: 'Friday' },
  { id: 5, label: 'Saturday' },
  { id: 6, label: 'Sunday' },
]

export default function WeeklyScheduleModal({ isOpen, onClose, onScheduleSaved }) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [fromTime, setFromTime] = useState('08:00')
  const [toTime, setToTime] = useState('17:00')
  
  // schedule: array of { dayOfWeek: 0..6, startTime: 'HH:MM', endTime: 'HH:MM', isActive: true }
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let active = true
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    fetchMySchedule()
      .then(res => {
        if (active) {
          const list = Array.isArray(res) ? res : []
          setSlots(list.map(s => ({
            dayOfWeek: Number(s.day_of_week ?? s.dayOfWeek),
            startTime: String(s.start_time ?? s.startTime).slice(0, 5),
            endTime: String(s.end_time ?? s.endTime).slice(0, 5),
            isActive: s.is_active !== false && s.isActive !== false,
          })))
        }
      })
      .catch(err => {
        if (active) setErrorMsg(err.message || 'Failed to load schedule.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [isOpen])

  if (!isOpen) return null

  const handleAddSlot = () => {
    setErrorMsg('')
    setSuccessMsg('')
    if (!fromTime || !toTime) {
      setErrorMsg('Please specify both FROM and TO times.')
      return
    }
    if (fromTime >= toTime) {
      setErrorMsg('TO time must be later than FROM time.')
      return
    }

    // Check for overlap on the same day
    const daySlots = slots.filter(s => s.dayOfWeek === selectedDay)
    const hasOverlap = daySlots.some(s => {
      return (fromTime < s.endTime && toTime > s.startTime)
    })
    if (hasOverlap) {
      setErrorMsg('This time window overlaps with an existing shift on this day.')
      return
    }

    const newSlot = {
      dayOfWeek: selectedDay,
      startTime: fromTime,
      endTime: toTime,
      isActive: true,
    }

    setSlots(prev => [...prev, newSlot].sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek
      return a.startTime.localeCompare(b.startTime)
    }))
  }

  const handleRemoveSlot = (indexToRemove) => {
    setErrorMsg('')
    setSuccessMsg('')
    setSlots(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleApplyPreset = (presetType) => {
    setErrorMsg('')
    setSuccessMsg('')
    if (presetType === 'weekdays_standard') {
      // Mon - Fri, 08:00 - 17:00
      const newSlots = [0, 1, 2, 3, 4].map(d => ({
        dayOfWeek: d,
        startTime: '08:00',
        endTime: '17:00',
        isActive: true,
      }))
      setSlots(newSlots)
    } else if (presetType === 'mon_sat') {
      // Mon - Sat, 08:00 - 18:00
      const newSlots = [0, 1, 2, 3, 4, 5].map(d => ({
        dayOfWeek: d,
        startTime: '08:00',
        endTime: '18:00',
        isActive: true,
      }))
      setSlots(newSlots)
    } else if (presetType === 'clear_all') {
      setSlots([])
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const payload = slots.map(s => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isActive: true,
      }))
      await saveMySchedule(payload)
      setSuccessMsg('Weekly working shifts saved successfully!')
      if (onScheduleSaved) onScheduleSaved(payload)
      setTimeout(() => {
        onClose()
      }, 900)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save weekly schedule.')
    } finally {
      setSaving(false)
    }
  }

  // Calculate total weekly hours
  const totalWeeklyHours = slots.reduce((acc, s) => {
    const [sh, sm] = s.startTime.split(':').map(Number)
    const [eh, em] = s.endTime.split(':').map(Number)
    const hours = (eh + em / 60) - (sh + sm / 60)
    return acc + Math.max(0, hours)
  }, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2D9CF] rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EBE5] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E4030] text-white flex items-center justify-center shadow-xs">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1C1A17]">Set Weekly Schedule</h3>
              <p className="text-xs text-[#8A7E74]">Define recurring shift hours when you are available for bookings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E2D9CF] text-[#8A7E74] hover:text-[#1C1A17] flex items-center justify-center hover:bg-[#F5F1EC] transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-[#8A7E74]">
              <RefreshCw size={24} className="animate-spin text-[#1E4030]" />
              <span>Loading current schedule...</span>
            </div>
          ) : (
            <>
              {/* Notification Banner */}
              <div className="bg-[#EDF7F2]/80 border border-[#A3D9BE] rounded-2xl p-3.5 text-xs text-[#1E4030] flex items-start gap-2.5">
                <Sparkles size={16} className="shrink-0 mt-0.5 text-[#1E4030]" />
                <div className="leading-relaxed">
                  <span className="font-bold">Strict Client Booking Enforcement:</span> Clients can only book sessions during your configured shifts. Outside these shift hours or on days off, you will automatically be marked unavailable.
                  {slots.length === 0 && (
                    <span className="block mt-1 font-semibold text-amber-800">
                      Currently no shifts are set — you remain bookable at any time until you add your shifts.
                    </span>
                  )}
                </div>
              </div>

              {/* Add Slot Control Bar (Inspired by the provided reference UI) */}
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  {/* Day Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8A7E74] uppercase tracking-wider mb-1.5">
                      DAY
                    </label>
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(Number(e.target.value))}
                      className="w-full bg-white border border-[#E2D9CF] focus:border-[#1E4030] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1C1A17] outline-hidden cursor-pointer"
                    >
                      {DAYS.map(d => (
                        <option key={d.id} value={d.id}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* From Time */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8A7E74] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Clock size={11} /> FROM
                    </label>
                    <input
                      type="time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="w-full bg-white border border-[#E2D9CF] focus:border-[#1E4030] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1A17] outline-hidden"
                    />
                  </div>

                  {/* To Time */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8A7E74] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Clock size={11} /> TO
                    </label>
                    <input
                      type="time"
                      value={toTime}
                      onChange={(e) => setToTime(e.target.value)}
                      className="w-full bg-white border border-[#E2D9CF] focus:border-[#1E4030] rounded-xl px-3 py-2 text-xs font-bold text-[#1C1A17] outline-hidden"
                    />
                  </div>

                  {/* Add Slot Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Slot</span>
                    </button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#F0EBE5] flex-wrap">
                  <span className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('weekdays_standard')}
                    className="text-[11px] font-semibold text-[#1E4030] bg-white border border-[#E2D9CF] hover:border-[#1E4030] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Mon – Fri (08:00 – 17:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('mon_sat')}
                    className="text-[11px] font-semibold text-[#1E4030] bg-white border border-[#E2D9CF] hover:border-[#1E4030] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Mon – Sat (08:00 – 18:00)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('clear_all')}
                    className="text-[11px] font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ml-auto"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Weekly Working Schedule List (Matching the requested design) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#1C1A17]">Weekly Working Schedule</h4>
                  <span className="text-xs font-bold text-[#1E4030] bg-[#EDF7F2] px-2.5 py-1 rounded-full border border-[#A3D9BE]">
                    Total: {totalWeeklyHours.toFixed(1)} hrs / week
                  </span>
                </div>

                <div className="space-y-2">
                  {DAYS.map(day => {
                    const daySlots = slots
                      .map((s, originalIdx) => ({ ...s, originalIdx }))
                      .filter(s => s.dayOfWeek === day.id)

                    const isClosed = daySlots.length === 0

                    return (
                      <div
                        key={day.id}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
                          isClosed
                            ? 'bg-[#FAF8F5]/60 border-[#F0EBE5] opacity-85'
                            : 'bg-white border-[#E2D9CF] shadow-2xs'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isClosed ? 'text-[#8A7E74]' : 'text-[#1C1A17]'} w-28`}>
                          {day.label}
                        </span>

                        <div className="flex items-center gap-2 flex-wrap justify-end flex-1">
                          {isClosed ? (
                            <span className="text-xs italic text-[#8A7E74]/70">
                              Day Off / Closed
                            </span>
                          ) : (
                            daySlots.map(s => (
                              <span
                                key={`${s.startTime}-${s.endTime}-${s.originalIdx}`}
                                className="inline-flex items-center gap-1.5 bg-[#EDF7F2] border border-[#A3D9BE] text-[#1E4030] text-xs font-bold px-3 py-1 rounded-full group transition-all"
                              >
                                <span>{s.startTime} — {s.endTime}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(s.originalIdx)}
                                  className="text-[#1E4030]/60 hover:text-red-600 transition-colors cursor-pointer p-0.5 rounded-full"
                                  title="Remove shift"
                                >
                                  <X size={12} strokeWidth={2.5} />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Status Alerts */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <Check size={14} className="shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0EBE5] bg-[#FAF8F5] flex items-center justify-between gap-3">
          <p className="text-[11px] text-[#8A7E74]">
            {slots.length > 0 ? `${slots.length} shift slot${slots.length > 1 ? 's' : ''} defined` : 'No shifts defined (Available anytime)'}
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-bold text-[#5A5248] hover:text-[#1C1A17] bg-white border border-[#E2D9CF] rounded-xl hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1E4030] hover:bg-[#152e22] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={13} />
                  <span>Save Schedule</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
