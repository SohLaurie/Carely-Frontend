import React, { useState } from 'react';
import { EXTRA_TASKS, TIME_SLOTS } from './bookingData';
import { TASK_ICON_MAP } from './ExtraTaskIcons';

export default function SingleSessionForm({ data, onChange, onSubmit, onBack }) {
  const [date, setDate]           = useState(data.date || '');
  const [startTime, setStartTime] = useState(data.startTime || '');
  const [endTime, setEndTime]     = useState(data.endTime || '');
  const [extras, setExtras]       = useState(data.extras || []);
  const [notes, setNotes]         = useState(data.notes || '');

  const toggleExtra = (id) => {
    setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const canSubmit = date && startTime && endTime;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onChange({ date, startTime, endTime, extras, notes });
    onSubmit();
  };

  // Filter end times to only show slots after start time
  const endSlots = startTime
    ? TIME_SLOTS.filter(t => t > startTime)
    : TIME_SLOTS;

  return (
    <div className="ssf-root">
      {/* Date */}
      <div className="ssf-field">
        <label className="ssf-label">Select date</label>
        <input
          type="date"
          className="ssf-input"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      {/* Times */}
      <div className="ssf-row">
        <div className="ssf-field ssf-field--half">
          <label className="ssf-label">Start time</label>
          <select className="ssf-select" value={startTime} onChange={e => { setStartTime(e.target.value); setEndTime(''); }}>
            <option value="">-- Select --</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="ssf-field ssf-field--half">
          <label className="ssf-label">End time</label>
          <select className="ssf-select" value={endTime} onChange={e => setEndTime(e.target.value)} disabled={!startTime}>
            <option value="">-- Select --</option>
            {endSlots.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Extra tasks */}
      <div className="ssf-field">
        <label className="ssf-label">Extra Tasks <span className="ssf-optional">(Optional)</span></label>
        <div className="ssf-extras-grid">
          {EXTRA_TASKS.map(task => {
            const on = extras.includes(task.id);
            const Icon = TASK_ICON_MAP[task.id];
            return (
              <button
                key={task.id}
                className={`ssf-extra ${on ? 'ssf-extra--on' : ''}`}
                onClick={() => toggleExtra(task.id)}
                type="button"
              >
                <div className="ssf-extra-icon">
                  {Icon && <Icon size={20} color={on ? '#2D6A4F' : '#5A5248'} />}
                </div>
                <span className="ssf-extra-label">{task.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="ssf-field">
        <label className="ssf-label">Add specific instructions <span className="ssf-optional">(Optional)</span></label>
        <textarea
          className="ssf-textarea"
          placeholder="Add your notes here…"
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="ssf-actions">
        <button className="ssf-btn ssf-btn--back" onClick={onBack}>Back</button>
        <button
          className={`ssf-btn ${canSubmit ? 'ssf-btn--submit' : 'ssf-btn--disabled'}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Find a Provider
        </button>
      </div>

      <style>{`
        .ssf-root { padding: 0.25rem 0 0.5rem; }
        .ssf-field { margin-bottom: 1rem; }
        .ssf-field--half { flex: 1; }
        .ssf-row { display: flex; gap: 0.75rem; }
        .ssf-label {
          display: block; font-size: 0.8rem; font-weight: 700;
          color: #1C1A17; margin-bottom: 0.4rem;
        }
        .ssf-optional { font-weight: 400; color: #8A7E74; }
        .ssf-input, .ssf-select {
          width: 100%; box-sizing: border-box;
          border: 1.8px solid #E0DBD5; border-radius: 10px;
          padding: 0.7rem 0.85rem; font-size: 0.86rem;
          color: #1C1A17; font-family: 'Inter', sans-serif;
          outline: none; background: #fff;
          transition: border-color 0.15s;
        }
        .ssf-input:focus, .ssf-select:focus { border-color: #2D6A4F; }
        .ssf-select:disabled { background: #F7F5F2; color: #B0A89E; cursor: not-allowed; }
        .ssf-extras-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;
        }
        .ssf-extra {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; padding: 0.6rem 0.3rem;
          border: 1.5px solid #E0DBD5; border-radius: 12px;
          background: #fff; cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .ssf-extra:hover { border-color: #2D6A4F; }
        .ssf-extra--on {
          border-color: #2D6A4F;
          background: rgba(45,106,79,0.08);
        }
        .ssf-extra-icon {
          display: flex; align-items: center; justify-content: center;
          height: 24px;
        }
        .ssf-extra-label {
          font-size: 0.62rem; font-weight: 600;
          color: #5A5248; text-align: center; line-height: 1.25;
        }
        .ssf-textarea {
          width: 100%; box-sizing: border-box;
          border: 1.8px solid #E0DBD5; border-radius: 10px;
          padding: 0.7rem 0.85rem; font-size: 0.86rem;
          color: #1C1A17; font-family: 'Inter', sans-serif;
          outline: none; resize: vertical; min-height: 80px;
          transition: border-color 0.15s;
        }
        .ssf-textarea:focus { border-color: #2D6A4F; }
        .ssf-textarea::placeholder { color: #B0A89E; }
        .ssf-actions {
          display: flex; gap: 0.75rem; margin-top: 1.25rem;
        }
        .ssf-btn {
          flex: 1; padding: 0.9rem; border-radius: 12px;
          font-size: 0.9rem; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .ssf-btn--back {
          background: #fff; border: 1.8px solid #E0DBD5; color: #5A5248;
        }
        .ssf-btn--back:hover { border-color: #2D6A4F; color: #2D6A4F; }
        .ssf-btn--submit {
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          border: none; color: #fff;
          box-shadow: 0 4px 16px rgba(45,106,79,0.35);
        }
        .ssf-btn--submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(45,106,79,0.4); }
        .ssf-btn--disabled {
          background: #E8E4DF; border: none; color: #B0A89E; cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
