import React, { useState, useEffect, useMemo } from 'react';
import { getExtraTasksForService, TIME_SLOTS } from './bookingData';
import { TASK_ICON_MAP } from './ExtraTaskIcons';
import ServiceQuestions from './ServiceQuestions';
import { fetchProviderSchedule } from '../../../../services/availabilityApi';

export default function SingleSessionForm({ data, onChange, onSubmit, onBack }) {
  const extraTasks = getExtraTasksForService(data.service?.id);
  const todayDefault = new Date().toISOString().split('T')[0];
  const [date, setDate]           = useState(data.date || todayDefault);
  const [startTime, setStartTime] = useState(data.startTime || '09:00');
  const [endTime, setEndTime]     = useState(data.endTime || '12:00');
  const [extras, setExtras]       = useState(data.extras || []);
  const [serviceQuestions, setServiceQuestions] = useState(data.serviceQuestions || {});
  const [notes, setNotes]         = useState(data.notes || '');

  // Provider Weekly Schedule validation
  const [providerSchedule, setProviderSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    if (!data.provider?.id) return;
    let active = true;
    setLoadingSchedule(true);
    fetchProviderSchedule(data.provider.id)
      .then(res => {
        if (active) setProviderSchedule(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        if (active) setProviderSchedule([]);
      })
      .finally(() => {
        if (active) setLoadingSchedule(false);
      });
    return () => { active = false; };
  }, [data.provider?.id]);

  const toggleExtra = (id) => {
    setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const normalizeTime = (t) => {
    if (!t) return '';
    const parts = t.trim().split(':');
    if (parts.length === 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return t;
  };

  const isTimeOrderValid = !startTime || !endTime || endTime > startTime;

  const scheduleValidation = useMemo(() => {
    if (!data.provider?.id || providerSchedule.length === 0 || !date) {
      return { valid: true, message: null, shiftsText: null };
    }
    const [y, m, d] = date.split('-').map(Number);
    const jsDay = new Date(y, m - 1, d).getDay();
    const appDay = (jsDay + 6) % 7;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayName = dayNames[appDay];

    const dayShifts = providerSchedule.filter(
      s => Number(s.day_of_week ?? s.dayOfWeek) === appDay && (s.is_active !== false && s.isActive !== false)
    );

    if (dayShifts.length === 0) {
      return {
        valid: false,
        isDayOff: true,
        message: `${data.provider.name || 'Provider'} does not work on ${dayName}s (Day Off). Please select another date.`,
        shiftsText: 'Day Off / Closed'
      };
    }

    const shiftsFormatted = dayShifts.map(s => `${String(s.start_time ?? s.startTime).slice(0, 5)} – ${String(s.end_time ?? s.endTime).slice(0, 5)}`).join(', ');

    if (startTime && endTime) {
      const normStart = normalizeTime(startTime);
      const normEnd = normalizeTime(endTime);
      const fits = dayShifts.some(s => {
        const sStart = String(s.start_time ?? s.startTime).slice(0, 5);
        const sEnd = String(s.end_time ?? s.endTime).slice(0, 5);
        return sStart <= normStart && sEnd >= normEnd;
      });

      if (!fits) {
        return {
          valid: false,
          isOutsideShift: true,
          message: `Selected hours (${normStart} – ${normEnd}) fall outside ${data.provider.name || 'provider'}'s working shift (${shiftsFormatted}) on ${dayName}.`,
          shiftsText: shiftsFormatted
        };
      }
    }

    return {
      valid: true,
      message: null,
      shiftsText: shiftsFormatted
    };
  }, [data.provider, providerSchedule, date, startTime, endTime]);

  const canSubmit = Boolean(date && startTime && endTime && isTimeOrderValid && scheduleValidation.valid);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onChange({
      date,
      startTime: normalizeTime(startTime),
      endTime: normalizeTime(endTime),
      extras,
      serviceQuestions,
      notes
    });
    onSubmit();
  };

  return (
    <div className="ssf-root">
      {/* Date */}
      <div className="ssf-field">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <label className="ssf-label" style={{ margin: 0 }}>Select date</label>
          {data.provider && scheduleValidation.shiftsText && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              background: scheduleValidation.isDayOff ? '#FEE2E2' : '#E8F5E9',
              color: scheduleValidation.isDayOff ? '#DC2626' : '#2E7D32',
              border: scheduleValidation.isDayOff ? '1px solid #FCA5A5' : '1px solid #A5D6A7'
            }}>
              {scheduleValidation.isDayOff ? '⚠️ Day Off' : `Shift: ${scheduleValidation.shiftsText}`}
            </span>
          )}
        </div>
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
          <input
            type="time"
            className="ssf-input"
            list="ssf-start-slots"
            value={startTime}
            placeholder="e.g. 05:10"
            onChange={e => setStartTime(e.target.value)}
          />
          <datalist id="ssf-start-slots">
            {TIME_SLOTS.map(t => <option key={t} value={t} />)}
          </datalist>
        </div>
        <div className="ssf-field ssf-field--half">
          <label className="ssf-label">End time</label>
          <input
            type="time"
            className="ssf-input"
            list="ssf-end-slots"
            value={endTime}
            min={startTime || undefined}
            placeholder="e.g. 05:40"
            onChange={e => setEndTime(e.target.value)}
          />
          <datalist id="ssf-end-slots">
            {TIME_SLOTS.map(t => <option key={t} value={t} />)}
          </datalist>
        </div>
      </div>

      {!isTimeOrderValid && (
        <p style={{ color: '#E11D48', fontSize: '0.75rem', marginTop: '-0.5rem', marginBottom: '0.75rem', fontWeight: 600 }}>
          End time must be after start time.
        </p>
      )}

      {/* Schedule Error / Out of shift Warning */}
      {!scheduleValidation.valid && scheduleValidation.message && (
        <div style={{
          padding: '0.65rem 0.85rem',
          background: '#FFF1F2',
          border: '1px solid #FECDD3',
          borderRadius: '0.75rem',
          color: '#BE123C',
          fontSize: '0.75rem',
          fontWeight: 600,
          marginTop: '-0.25rem',
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.9rem' }}>⚠️</span>
          <span>{scheduleValidation.message}</span>
        </div>
      )}

      {/* Service-specific questions (Babysitting / Laundry & Ironing) */}
      <ServiceQuestions
        serviceId={data.service?.id}
        values={serviceQuestions}
        onChange={setServiceQuestions}
      />

      {/* Extra tasks */}
      <div className="ssf-field">
        <label className="ssf-label">Extra Tasks <span className="ssf-optional">(Optional)</span></label>
        <div className="ssf-extras-grid">
          {extraTasks.map(task => {
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
          {data.provider ? 'Continue' : 'Find a Provider'}
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
