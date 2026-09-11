import React from 'react';
import { MapPin, Calendar, Clock, RefreshCw, Check, ShieldCheck, HeartHandshake } from 'lucide-react';
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
    const skipCount = data.skippedDates ? data.skippedDates.length : 0;
    const skipText = skipCount > 0 ? ` (${skipCount} session${skipCount > 1 ? 's' : ''} skipped)` : '';
    
    const freqLabel = data.frequency === 'biweekly' ? 'Every 2 Weeks' : 'Every Week';
    const durLabel = data.durationWeeks === 'ongoing' ? 'ongoing' : `for ${data.durationWeeks} weeks`;

    return `${freqLabel} on ${dayLabels.join(', ')} ${durLabel}, ${firstDay?.startTime || '–'} – ${firstDay?.endTime || '–'}${skipText}`;
  }
  return '–';
}

export default function ConfirmationStep({ data, onConfirm, onBack, isSubmitting = false, error = null }) {
  const { service, address, provider, bookingType } = data;

  const ratePerHour = provider?.pricePerHour || 3500;
  const isRecurring = bookingType === 'recurring';
  
  let hours = 3;
  let sessionFeeLabel = 'Single Session Fee';
  let hoursLabel = 'Hours per session';

  if (isRecurring) {
    let totalHours = 0;
    if (data.selectedDays) {
      Object.values(data.selectedDays).forEach(day => {
        const [sh, sm] = (day.startTime || '08:00').split(':').map(Number);
        const [eh, em] = (day.endTime || '12:00').split(':').map(Number);
        totalHours += Math.max(1, +((eh * 60 + em) - (sh * 60 + sm)) / 60);
      });
    }
    hours = totalHours || 3;
    sessionFeeLabel = 'Weekly Session Fee';
    hoursLabel = 'Hours per week';
  } else {
    const [sh, sm] = (data.startTime || '09:00').split(':').map(Number);
    const [eh, em] = (data.endTime || '12:00').split(':').map(Number);
    const diffMins = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0));
    hours = Math.max(0.25, +(diffMins / 60).toFixed(2));
  }

  const sessionFee = Math.round(ratePerHour * hours);
  const escrowFee = 5;
  
  let skippedDiscount = 0;
  if (isRecurring && data.skippedDates && data.skippedDates.length > 0) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const startDay = new Date(today);
    const dow = today.getDay();
    const diffToMon = (dow === 0 ? -6 : 1 - dow);
    startDay.setDate(startDay.getDate() + diffToMon);
    
    const firstWeekDateKeys = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const dayVal = String(date.getDate()).padStart(2, '0');
      firstWeekDateKeys.push(`${y}-${m}-${dayVal}`);
    }

    let skippedHours = 0;
    data.skippedDates.forEach(dateKey => {
      if (firstWeekDateKeys.includes(dateKey)) {
        const parts = dateKey.split('-').map(Number);
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        const dayIds = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const dayId = dayIds[dateObj.getDay()];
        const dayConfig = data.selectedDays[dayId];
        if (dayConfig) {
          const [sh, sm] = (dayConfig.startTime || '08:00').split(':').map(Number);
          const [eh, em] = (dayConfig.endTime || '12:00').split(':').map(Number);
          skippedHours += Math.max(1, +((eh * 60 + em) - (sh * 60 + sm)) / 60);
        }
      }
    });
    skippedDiscount = skippedHours * ratePerHour;
  }

  const totalPrice = Math.max(5, Math.round(sessionFee - skippedDiscount + escrowFee));

  const handleConfirmClick = () => {
    onConfirm && onConfirm({ totalPrice });
  };

  const summaryRows = [
    {
      icon: HeartHandshake,
      label: 'Service',
      value: service?.label || '–',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: data.addressText || address?.full || '–',
      sub: address?.unit || null,
    },
    {
      icon: Calendar,
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
        {summaryRows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div key={i} className="cs-row">
              <div className="cs-row-icon-wrap">
                <Icon size={16} />
              </div>
              <div className="cs-row-content">
                <p className="cs-row-label">{row.label}</p>
                <p className="cs-row-value">{row.value}</p>
                {row.sub && <p className="cs-row-sub">{row.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Elder Care Profile details */}
      {service?.id === 'elder-care' && data.elderProfile && (
        <div className="cs-profile-summary">
          <h4 className="cs-profile-title">Recipient Profile</h4>
          <div className="cs-profile-grid">
            <div className="cs-profile-item">
              <span className="cs-profile-label">Recipient</span>
              <span className="cs-profile-val">{data.elderProfile.recipient}</span>
            </div>
            {data.elderProfile.allergies && data.elderProfile.allergies.toLowerCase() !== 'none' && (
              <div className="cs-profile-item">
                <span className="cs-profile-label">Allergies</span>
                <span className="cs-profile-val">{data.elderProfile.allergies}</span>
              </div>
            )}
            {data.elderProfile.medications && data.elderProfile.medications.toLowerCase() !== 'none' && (
              <div className="cs-profile-item">
                <span className="cs-profile-label">Medications</span>
                <span className="cs-profile-val">{data.elderProfile.medications}</span>
              </div>
            )}
            {data.elderProfile.emergency && (
              <div className="cs-profile-item">
                <span className="cs-profile-label">Emergency Contact</span>
                <span className="cs-profile-val">{data.elderProfile.emergency}</span>
              </div>
            )}
            {data.elderProfile.pets && data.elderProfile.pets.toLowerCase() !== 'none' && (
              <div className="cs-profile-item">
                <span className="cs-profile-label">Pets at Property</span>
                <span className="cs-profile-val">{data.elderProfile.pets}</span>
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* Pricing Summary Card */}
      <div className="cs-price-card">
        <div className="cs-price-row">
          <span className="cs-price-label">Rate per hour</span>
          <span className="cs-price-val">{ratePerHour.toLocaleString()} XAF</span>
        </div>
        <div className="cs-price-row">
          <span className="cs-price-label">{hoursLabel}</span>
          <span className="cs-price-val">{Number(hours).toFixed(Number.isInteger(Number(hours)) ? 0 : 2)} hrs</span>
        </div>
        <div className="cs-price-row">
          <span className="cs-price-label">{sessionFeeLabel}</span>
          <span className="cs-price-val">{sessionFee.toLocaleString()} XAF</span>
        </div>
        {skippedDiscount > 0 && (
          <div className="cs-price-row cs-price-row--discount">
            <span className="cs-price-label cs-price-label--discount">Skipped Session Discount</span>
            <span className="cs-price-val cs-price-val--discount">-{skippedDiscount.toLocaleString()} XAF</span>
          </div>
        )}
        <div className="cs-price-row">
          <span className="cs-price-label">Carely Escrow Protection</span>
          <span className="cs-price-val">{escrowFee.toLocaleString()} XAF</span>
        </div>
        <div className="cs-price-divider" />
        <div className="cs-price-row cs-price-row--total">
          <span className="cs-price-label cs-price-label--total">Total (Held in Escrow)</span>
          <span className="cs-price-val cs-price-val--total">{totalPrice.toLocaleString()} XAF</span>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="cs-disclaimer">
        Your request will be sent to the provider. Booking is confirmed once they accept.
        Funds are held in escrow until service completion.
      </p>

      {error && (
        <div style={{ background: '#FDE8E8', color: '#9B1C1C', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '1rem', textAlign: 'center', border: '1px solid #F8B4B4' }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="cs-actions">
        <button className="cs-btn cs-btn--back" onClick={onBack} disabled={isSubmitting}>Back</button>
        <button className="cs-btn cs-btn--confirm" onClick={handleConfirmClick} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? 'Sending Request...' : 'Confirm Booking'}
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
          display: flex; align-items: center; gap: 0.85rem;
          padding: 0.9rem 1rem;
          border-bottom: 1px solid #F0EBE5;
        }
        .cs-row:last-child { border-bottom: none; }
        .cs-row-icon-wrap {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(45,106,79,0.08); color: #2D6A4F;
          flex-shrink: 0;
        }
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
        /* Pricing Summary Card */
        .cs-price-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #E0DBD5; padding: 1.1rem 1.25rem;
          margin-bottom: 0.9rem; display: flex; flex-direction: column;
          gap: 0.55rem;
        }
        .cs-price-row {
          display: flex; justify-content: space-between; align-items: center;
        }
        .cs-price-label {
          font-size: 0.82rem; color: #8A7E74; font-weight: 500;
        }
        .cs-price-val {
          font-size: 0.85rem; font-weight: 600; color: #1C1A17;
        }
        .cs-price-divider {
          height: 1px; background: #F0EBE5; margin: 0.25rem 0;
        }
        .cs-price-row--total {
          margin-top: 0.15rem;
        }
        .cs-price-label--total {
          font-weight: 700; color: #1E4030;
        }
        .cs-price-val--total {
          font-size: 1.05rem; font-weight: 800; color: #1E4030;
        }
        .cs-price-row--discount {
          margin-top: 0.1rem;
        }
        .cs-price-label--discount, .cs-price-val--discount {
          color: #2D6A4F; font-weight: 600;
        }

        /* Elder Care Profile Summary Card */
        .cs-profile-summary {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #E0DBD5; padding: 1.1rem 1.25rem;
          margin-bottom: 0.9rem; display: flex; flex-direction: column;
          gap: 0.65rem;
        }
        .cs-profile-title {
          font-size: 0.78rem; font-weight: 700; color: #1C1A17;
          text-transform: uppercase; letter-spacing: 0.04em;
          margin: 0 0 0.15rem;
        }
        .cs-profile-grid {
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .cs-profile-item {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 0.5rem;
        }
        .cs-profile-label {
          font-size: 0.78rem; color: #8A7E74; font-weight: 500;
        }
        .cs-profile-val {
          font-size: 0.8rem; font-weight: 600; color: #1C1A17;
          text-align: right; line-height: 1.3;
        }
      `}</style>
    </div>
  );
}
