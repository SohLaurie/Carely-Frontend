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
  const [skippedDates, setSkippedDates] = useState(data.skippedDates || []);
  const [frequency, setFrequency]         = useState(data.frequency || 'weekly');
  const [durationWeeks, setDurationWeeks] = useState(data.durationWeeks || '4');

  const todayObj = new Date();
  const y = todayObj.getFullYear();
  const m = String(todayObj.getMonth() + 1).padStart(2, '0');
  const d = String(todayObj.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;

  const [startDate, setStartDate] = useState(data.startDate || todayStr);

  const handleToggleSkipDate = (dateKey) => {
    setSkippedDates(prev =>
      prev.includes(dateKey) ? prev.filter(d => d !== dateKey) : [...prev, dateKey]
    );
  };

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
    onChange({ selectedDays, skippedDates, frequency, durationWeeks, startDate });
    onSubmit();
  };

  return (
    <div className="dss-root">
      {/* Frequency Selector */}
      <div className="dss-section">
        <h4 className="dss-sub-title">Choose your frequency</h4>
        <div className="dss-freq-cards">
          <button
            type="button"
            className={`dss-freq-card ${frequency === 'weekly' ? 'dss-freq-card--active' : ''}`}
            onClick={() => setFrequency('weekly')}
          >
            <p className="dss-freq-card-title">Every Week / Daily</p>
            <p className="dss-freq-card-desc">Get help every week or more</p>
          </button>
          <button
            type="button"
            className={`dss-freq-card ${frequency === 'biweekly' ? 'dss-freq-card--active' : ''}`}
            onClick={() => setFrequency('biweekly')}
          >
            <p className="dss-freq-card-title">Every 2 Weeks</p>
            <p className="dss-freq-card-desc">Get help every two weeks</p>
          </button>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="dss-section dss-section--mt">
        <label className="dss-field-label">Duration (Weeks)</label>
        <div className="dss-duration-wrap">
          <select
            className="dss-select-duration"
            value={durationWeeks}
            onChange={e => setDurationWeeks(e.target.value)}
          >
            <option value="1">1 Week</option>
            <option value="2">2 Weeks</option>
            <option value="3">3 Weeks</option>
            <option value="4">4 Weeks (1 Month)</option>
            <option value="6">6 Weeks</option>
            <option value="8">8 Weeks (2 Months)</option>
            <option value="12">12 Weeks (3 Months)</option>
            <option value="ongoing">Ongoing</option>
          </select>
          <p className="dss-duration-helper">
            Service runs {frequency === 'weekly' ? 'every week' : 'every 2 weeks'} for {durationWeeks === 'ongoing' ? 'an ongoing period' : `${durationWeeks} weeks`}.
          </p>
        </div>
      </div>

      {/* Start Date Selector */}
      <div className="dss-section dss-section--mt">
        <label className="dss-field-label">Start Date</label>
        <div className="dss-date-wrap">
          <input
            type="date"
            className="dss-select-duration"
            value={startDate}
            min={todayStr}
            onChange={e => setStartDate(e.target.value)}
          />
          <p className="dss-duration-helper">
            Select when you would like the first session to begin.
          </p>
        </div>
      </div>

      <h3 className="dss-title dss-title--days">Which days?</h3>

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
          <CalendarPreview 
            selectedDays={Object.keys(selectedDays)} 
            skippedDates={skippedDates}
            onToggleSkipDate={handleToggleSkipDate}
            frequency={frequency}
            durationWeeks={durationWeeks}
            baseDate={startDate}
          />
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

        /* Frequency & Duration Section Styles */
        .dss-section {
          max-width: 520px; margin: 0 auto 1.25rem;
        }
        .dss-section--mt { margin-top: 1.25rem; }
        .dss-sub-title {
          font-size: 0.8rem; font-weight: 700; color: #1C1A17;
          text-transform: uppercase; letter-spacing: 0.04em;
          margin: 0 0 0.55rem;
        }
        .dss-freq-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;
        }
        .dss-freq-card {
          background: #fff; border: 1.8px solid #E0DBD5;
          border-radius: 12px; padding: 0.85rem; text-align: left;
          cursor: pointer; transition: all 0.15s;
          display: flex; flex-direction: column; gap: 2px;
        }
        .dss-freq-card:hover { border-color: #2D6A4F; }
        .dss-freq-card--active {
          border-color: #1E3A28; background: rgba(45,106,79,0.05);
          box-shadow: 0 2px 8px rgba(45,106,79,0.06);
        }
        .dss-freq-card-title {
          font-size: 0.82rem; font-weight: 700; color: #1C1A17; margin: 0;
        }
        .dss-freq-card-desc {
          font-size: 0.7rem; color: #8A7E74; margin: 0;
        }
        .dss-field-label {
          display: block; font-size: 0.8rem; font-weight: 700;
          color: #1C1A17; margin-bottom: 0.4rem;
          text-transform: uppercase; letter-spacing: 0.04em;
        }
        .dss-select-duration {
          width: 100%; border: 1.8px solid #E0DBD5; border-radius: 10px;
          padding: 0.7rem 0.85rem; font-size: 0.86rem;
          color: #1C1A17; font-family: 'Inter', sans-serif;
          outline: none; background: #fff;
          transition: border-color 0.15s;
        }
        .dss-select-duration:focus { border-color: #2D6A4F; }
        .dss-duration-helper {
          font-size: 0.73rem; color: #8A7E74; margin: 0.35rem 0 0;
          font-style: italic; font-weight: 500;
        }
        .dss-title--days {
          margin-top: 1.4rem; text-align: left; font-size: 0.8rem;
          text-transform: uppercase; letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}
