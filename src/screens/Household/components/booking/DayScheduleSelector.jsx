import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DAYS_OF_WEEK, TIME_SLOTS, getExtraTasksForService } from './bookingData';
import CalendarPreview from './CalendarPreview';
import { TASK_ICON_MAP } from './ExtraTaskIcons';

// Per-day config shape: { startTime, endTime, extras: [] }
const defaultDayConfig = () => ({ startTime: '08:00', endTime: '12:00', extras: [] });

export default function DayScheduleSelector({ data, onChange, onSubmit, onBack }) {
  const extraTasks = getExtraTasksForService(data.service?.id);
  // selectedDays: { mon: { startTime, endTime, extras }, ... }
  const [selectedDays, setSelectedDays] = useState(data.selectedDays || {});
  const [expandedDay, setExpandedDay]   = useState(null);

  const toggleDay = (dayId) => {
    setSelectedDays(prev => {
      if (prev[dayId]) {
        const next = { ...prev };
        delete next[dayId];
        if (expandedDay === dayId) setExpandedDay(null);
        return next;
      }
      setExpandedDay(dayId);
      return { ...prev, [dayId]: defaultDayConfig() };
    });
  };

  const updateDayField = (dayId, field, value) => {
    setSelectedDays(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value },
    }));
  };

  const toggleExtra = (dayId, extraId) => {
    const current = selectedDays[dayId]?.extras || [];
    const updated = current.includes(extraId)
      ? current.filter(e => e !== extraId)
      : [...current, extraId];
    updateDayField(dayId, 'extras', updated);
  };

  const canSubmit = Object.keys(selectedDays).length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onChange({ selectedDays });
    onSubmit();
  };

  return (
    <div className="dss-root">
      <h3 className="dss-title">Which days?</h3>

      {/* Day rows */}
      <div className="dss-day-list">
        {DAYS_OF_WEEK.map(day => {
          const config    = selectedDays[day.id];
          const isOn      = !!config;
          const isExpanded = expandedDay === day.id && isOn;
          const endSlots  = config ? TIME_SLOTS.filter(t => t > config.startTime) : TIME_SLOTS;

          return (
            <div key={day.id} className={`dss-day-wrap ${isOn ? 'dss-day-wrap--on' : ''}`}>
              {/* Row header */}
              <div className="dss-day-row">
                {/* Toggle checkbox */}
                <button
                  className={`dss-check ${isOn ? 'dss-check--on' : ''}`}
                  onClick={() => toggleDay(day.id)}
                  type="button"
                >
                  {isOn && <Check size={12} strokeWidth={3} />}
                </button>

                {/* Day name */}
                <span className={`dss-day-label ${isOn ? 'dss-day-label--on' : ''}`}>
                  {day.label}
                </span>

                {/* Time summary when on */}
                {isOn && config && (
                  <span className="dss-day-time-summary">
                    {config.startTime} – {config.endTime}
                  </span>
                )}

                {/* Select Day label when off */}
                {!isOn && (
                  <span className="dss-select-label" onClick={() => toggleDay(day.id)}>
                    Select Day
                  </span>
                )}

                {/* Expand/collapse when on */}
                {isOn && (
                  <button
                    className="dss-expand-btn"
                    onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                    type="button"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                )}
              </div>

              {/* Expanded detail panel */}
              {isExpanded && config && (
                <div className="dss-detail">
                  {/* Times */}
                  <div className="dss-times-row">
                    <div className="dss-field">
                      <label className="dss-label">Start time</label>
                      <select
                        className="dss-select"
                        value={config.startTime}
                        onChange={e => { updateDayField(day.id, 'startTime', e.target.value); updateDayField(day.id, 'endTime', ''); }}
                      >
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="dss-field">
                      <label className="dss-label">End time</label>
                      <select
                        className="dss-select"
                        value={config.endTime}
                        onChange={e => updateDayField(day.id, 'endTime', e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        {endSlots.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Extra tasks */}
                  <p className="dss-extras-title">Extra Tasks</p>
                  <div className="dss-extras-grid">
                    {extraTasks.map(task => {
                      const on = config.extras.includes(task.id);
                      return (
                        <button
                          key={task.id}
                          type="button"
                          className={`dss-extra ${on ? 'dss-extra--on' : ''}`}
                          onClick={() => toggleExtra(day.id, task.id)}
                        >
                          <div className="dss-extra-icon">
                            {React.createElement(TASK_ICON_MAP[task.id] || (() => null), {
                              size: 18,
                              color: on ? '#2D6A4F' : '#5A5248'
                            })}
                          </div>
                          <span className="dss-extra-label">{task.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live calendar preview */}
      {canSubmit && (
        <div className="dss-cal-wrap">
          <CalendarPreview selectedDays={Object.keys(selectedDays)} />
        </div>
      )}

      {/* Actions */}
      <div className="dss-actions">
        <button className="dss-btn dss-btn--back" onClick={onBack}>Back</button>
        <button
          className={`dss-btn ${canSubmit ? 'dss-btn--submit' : 'dss-btn--disabled'}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Find a Provider
        </button>
      </div>

      <style>{`
        .dss-root { padding: 0.25rem 0 0.5rem; }
        .dss-title {
          font-size: 1rem; font-weight: 700; color: #1C1A17;
          font-family: 'Playfair Display', serif;
          margin: 0 0 0.9rem; text-align: center;
        }
        .dss-day-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .dss-day-wrap {
          border: 1.5px solid #E0DBD5; border-radius: 14px;
          overflow: hidden; background: #fff;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .dss-day-wrap--on {
          border-color: #2D6A4F;
          box-shadow: 0 2px 12px rgba(45,106,79,0.10);
        }
        .dss-day-row {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.8rem 0.9rem;
        }
        .dss-check {
          width: 22px; height: 22px; border-radius: 6px;
          border: 2px solid #C5BEB7; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s;
        }
        .dss-check--on {
          background: #2D6A4F; border-color: #2D6A4F; color: #fff;
        }
        .dss-day-label {
          font-size: 0.88rem; font-weight: 600; color: #5A5248; flex: 1;
        }
        .dss-day-label--on { color: #1C1A17; }
        .dss-day-time-summary {
          font-size: 0.75rem; font-weight: 600; color: #2D6A4F;
          background: rgba(45,106,79,0.08); border-radius: 6px;
          padding: 2px 8px;
        }
        .dss-select-label {
          font-size: 0.78rem; font-weight: 600; color: #2D6A4F;
          cursor: pointer; margin-left: auto;
        }
        .dss-select-label:hover { text-decoration: underline; }
        .dss-expand-btn {
          background: none; border: none; cursor: pointer;
          color: #8A7E74; display: flex; align-items: center;
          padding: 2px;
        }
        /* Detail panel */
        .dss-detail {
          padding: 0 0.9rem 0.9rem;
          border-top: 1px solid rgba(45,106,79,0.10);
          background: rgba(45,106,79,0.03);
        }
        .dss-times-row {
          display: flex; gap: 0.6rem; margin-top: 0.75rem;
        }
        .dss-field { flex: 1; }
        .dss-label {
          display: block; font-size: 0.73rem; font-weight: 700;
          color: #1C1A17; margin-bottom: 0.3rem;
        }
        .dss-select {
          width: 100%; border: 1.5px solid #E0DBD5; border-radius: 9px;
          padding: 0.6rem 0.7rem; font-size: 0.82rem;
          color: #1C1A17; font-family: 'Inter', sans-serif;
          outline: none; background: #fff;
          transition: border-color 0.15s;
        }
        .dss-select:focus { border-color: #2D6A4F; }
        .dss-extras-title {
          font-size: 0.78rem; font-weight: 700; color: #1C1A17;
          margin: 0.85rem 0 0.45rem;
        }
        .dss-extras-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.45rem;
        }
        .dss-extra {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 0.5rem 0.2rem; border: 1.5px solid #E0DBD5;
          border-radius: 10px; background: #fff; cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .dss-extra:hover { border-color: #2D6A4F; }
        .dss-extra--on { border-color: #2D6A4F; background: rgba(45,106,79,0.08); }
        .dss-extra-icon {
          display: flex; align-items: center; justify-content: center;
          height: 20px;
        }
        .dss-extra-label {
          font-size: 0.6rem; font-weight: 600; color: #5A5248;
          text-align: center; line-height: 1.25;
        }
        /* Calendar preview */
        .dss-cal-wrap { margin-top: 1.1rem; }
        /* Actions */
        .dss-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
        .dss-btn {
          flex: 1; padding: 0.9rem; border-radius: 12px;
          font-size: 0.9rem; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .dss-btn--back {
          background: #fff; border: 1.8px solid #E0DBD5; color: #5A5248;
        }
        .dss-btn--back:hover { border-color: #2D6A4F; color: #2D6A4F; }
        .dss-btn--submit {
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          border: none; color: #fff;
          box-shadow: 0 4px 16px rgba(45,106,79,0.35);
        }
        .dss-btn--submit:hover { transform: translateY(-2px); }
        .dss-btn--disabled {
          background: #E8E4DF; border: none; color: #B0A89E; cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
