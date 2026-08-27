import React from 'react';
import { MapPin, Calendar, Clock, RefreshCw, Check, ShieldCheck } from 'lucide-react';
import { DAYS_OF_WEEK } from './bookingData';

function getInitials(name) {
  const parts = name.trim().split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name[0];
}

function formatSchedule(data) {
  if (data.bookingType === 'single') {
    return `${data.date || '–'}, ${data.startTime || '–'} – ${data.endTime || '–'}`;
  }
  if (data.bookingType === 'recurring' && data.selectedDays) {
    const days = Object.keys(data.selectedDays);
    const dayLabels = DAYS_OF_WEEK.filter(d => days.includes(d.id)).map(d => d.short);
    const firstDay = data.selectedDays[days[0]];
    return `Every ${dayLabels.join(', ')}, ${firstDay?.startTime || '–'} – ${firstDay?.endTime || '–'}`;
  }
  return '–';
}

export default function ConfirmationStep({ data, onConfirm, onBack }) {
  const { service, address, provider, bookingType } = data;

  const summaryRows = [
    {
      icon: service?.emoji || '🏠',
      label: 'Service',
      value: service?.label || '–',
    },
    {
      icon: '📍',
      label: 'Location',
      value: address?.addressText || '–',
      sub: address?.unit || null,
    },
    {
      icon: bookingType === 'recurring' ? '🔄' : '📅',
      label: 'Schedule',
      value: formatSchedule(data),
    },
  ];

  return (
    <div className="cs-root">
      <div className="cs-top">
        <div className="cs-check-circle">
          <Check size={28} strokeWidth={3} />
        </div>
        <h2 className="cs-title">Confirm your booking</h2>
        <p className="cs-sub">Review the details below before sending your request</p>
      </div>

      {/* Summary cards */}
      <div className="cs-summary">
        {summaryRows.map((row, i) => (
          <div key={i} className="cs-row">
            <span className="cs-row-emoji">{row.icon}</span>
            <div className="cs-row-content">
              <p className="cs-row-label">{row.label}</p>
              <p className="cs-row-value">{row.value}</p>
              {row.sub && <p className="cs-row-sub">{row.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Provider card */}
      {provider && (
        <div className="cs-provider">
          <div className="cs-provider-avatar">
            {getInitials(provider.name)}
          </div>
          <div className="cs-provider-info">
            <p className="cs-provider-name">{provider.name}</p>
            <p className="cs-provider-meta">
              ⭐ {provider.rating} · {provider.experience}y exp.
            </p>
            {provider.verified && (
              <p className="cs-provider-verified">
                <ShieldCheck size={11} /> Background checked
              </p>
            )}
          </div>
          <div className="cs-provider-rate">
            <span className="cs-rate-num">{provider.pricePerHour?.toLocaleString()}</span>
            <span className="cs-rate-unit">FCFA/hr</span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="cs-disclaimer">
        Your request will be sent to the provider. Booking is confirmed once they accept.
        Funds are held in escrow until service completion.
      </p>

      {/* Actions */}
      <div className="cs-actions">
        <button className="cs-btn cs-btn--back" onClick={onBack}>Back</button>
        <button className="cs-btn cs-btn--confirm" onClick={onConfirm}>
          Confirm Booking
        </button>
      </div>

      <style>{`
        .cs-root { padding: 1rem 0 1.5rem; }
        .cs-top { text-align: center; margin-bottom: 1.4rem; }
        .cs-check-circle {
          width: 58px; height: 58px; border-radius: 50%;
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          color: #fff; display: flex; align-items: center;
          justify-content: center; margin: 0 auto 0.9rem;
          box-shadow: 0 6px 20px rgba(45,106,79,0.35);
        }
        .cs-title {
          font-size: 1.2rem; font-weight: 700; color: #1C1A17;
          font-family: 'Playfair Display', serif; margin: 0 0 4px;
        }
        .cs-sub { font-size: 0.78rem; color: #8A7E74; margin: 0; }
        .cs-summary {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #E0DBD5; overflow: hidden;
          margin-bottom: 0.85rem;
        }
        .cs-row {
          display: flex; align-items: flex-start; gap: 0.85rem;
          padding: 0.9rem 1rem;
          border-bottom: 1px solid #F0EBE5;
        }
        .cs-row:last-child { border-bottom: none; }
        .cs-row-emoji { font-size: 1.2rem; flex-shrink: 0; margin-top: 1px; }
        .cs-row-content { flex: 1; }
        .cs-row-label { font-size: 0.7rem; color: #8A7E74; margin: 0 0 2px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
        .cs-row-value { font-size: 0.88rem; font-weight: 700; color: #1C1A17; margin: 0; }
        .cs-row-sub { font-size: 0.75rem; color: #5A5248; margin: 2px 0 0; }
        /* Provider card */
        .cs-provider {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #E0DBD5; padding: 0.9rem 1rem;
          display: flex; align-items: center; gap: 0.85rem;
          margin-bottom: 0.9rem;
        }
        .cs-provider-avatar {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          color: #fff; font-size: 0.88rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cs-provider-info { flex: 1; }
        .cs-provider-name { font-size: 0.88rem; font-weight: 700; color: #1C1A17; margin: 0 0 3px; }
        .cs-provider-meta { font-size: 0.72rem; color: #8A7E74; margin: 0 0 3px; }
        .cs-provider-verified {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.65rem; color: #2D6A4F; font-weight: 600; margin: 0;
        }
        .cs-provider-rate { text-align: right; }
        .cs-rate-num { display: block; font-size: 0.92rem; font-weight: 800; color: #1C1A17; }
        .cs-rate-unit { font-size: 0.65rem; color: #8A7E74; }
        /* Disclaimer */
        .cs-disclaimer {
          font-size: 0.72rem; color: #8A7E74; line-height: 1.5;
          text-align: center; margin: 0 0 1.25rem; padding: 0 0.5rem;
        }
        /* Actions */
        .cs-actions { display: flex; gap: 0.75rem; }
        .cs-btn {
          flex: 1; padding: 0.95rem; border-radius: 12px;
          font-size: 0.92rem; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .cs-btn--back {
          background: #fff; border: 1.8px solid #E0DBD5; color: #5A5248;
        }
        .cs-btn--back:hover { border-color: #2D6A4F; color: #2D6A4F; }
        .cs-btn--confirm {
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          border: none; color: #fff;
          box-shadow: 0 6px 20px rgba(45,106,79,0.35);
        }
        .cs-btn--confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(45,106,79,0.45);
        }
      `}</style>
    </div>
  );
}
