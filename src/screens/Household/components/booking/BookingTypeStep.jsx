import React, { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import SingleSessionForm from './SingleSessionForm';
import DayScheduleSelector from './DayScheduleSelector';

const TYPE_OPTIONS = [
  {
    id: 'single',
    icon: Calendar,
    title: 'Single Session',
    desc: 'One-time visit for a specific date and time window.',
  },
  {
    id: 'recurring',
    icon: RefreshCw,
    title: 'Recurring Booking',
    desc: 'Multi-week recurring schedule with weekly billing.',
  },
];

export default function BookingTypeStep({ data, onChange, onNext, onBack }) {
  const [type, setType] = useState(data.bookingType || null);

  const handleTypeSelect = (t) => {
    setType(t);
    onChange({ bookingType: t });
  };

  return (
    <div className="bts-root">
      {/* Type selector cards */}
      <div className="bts-section">
        <h2 className="bts-title">How often do you need this service?</h2>
        <div className="bts-cards">
          {TYPE_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const active = type === opt.id;
            return (
              <button
                key={opt.id}
                className={`bts-card ${active ? 'bts-card--active' : ''}`}
                onClick={() => handleTypeSelect(opt.id)}
              >
                <div className="bts-card-top">
                  <Icon size={22} className={`bts-card-icon ${active ? 'bts-card-icon--active' : ''}`} />
                  <span className={`bts-dot ${active ? 'bts-dot--active' : ''}`} />
                </div>
                <p className={`bts-card-title ${active ? 'bts-card-title--active' : ''}`}>{opt.title}</p>
                <p className="bts-card-desc">{opt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional sub-form */}
      {type === 'single' && (
        <div className="bts-subform">
          <SingleSessionForm
            data={data}
            onChange={onChange}
            onSubmit={onNext}
            onBack={onBack}
          />
        </div>
      )}

      {type === 'recurring' && (
        <div className="bts-subform">
          <DayScheduleSelector
            data={data}
            onChange={onChange}
            onSubmit={onNext}
            onBack={onBack}
          />
        </div>
      )}

      <style>{`
        .bts-root { padding: 1.5rem 1rem 2rem; }
        .bts-section { max-width: 520px; margin: 0 auto; }
        .bts-title {
          font-size: 1.15rem; font-weight: 700; color: #1C1A17;
          font-family: 'Playfair Display', serif;
          margin: 0 0 1.25rem; text-align: center;
        }
        .bts-cards {
          display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;
          margin-bottom: 0;
        }
        .bts-card {
          background: #fff; border: 2px solid #E0DBD5;
          border-radius: 16px; padding: 1.1rem 1rem;
          text-align: left; cursor: pointer;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .bts-card:hover { border-color: #2D6A4F; }
        .bts-card--active {
          border-color: #1E3A28;
          background: #F0F7F3;
          box-shadow: 0 4px 16px rgba(45,106,79,0.15);
        }
        .bts-card-top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 0.3rem;
        }
        .bts-card-icon { color: #8A7E74; }
        .bts-card-icon--active { color: #2D6A4F; }
        .bts-dot {
          width: 10px; height: 10px; border-radius: 50%;
          border: 2px solid #C5BEB7; background: transparent;
          transition: all 0.18s;
        }
        .bts-dot--active {
          background: #1E3A28; border-color: #1E3A28;
        }
        .bts-card-title {
          font-size: 0.9rem; font-weight: 700; color: #1C1A17; margin: 0;
        }
        .bts-card-title--active { color: #1E3A28; }
        .bts-card-desc {
          font-size: 0.72rem; color: #8A7E74;
          margin: 0; line-height: 1.4;
        }
        .bts-subform { max-width: 520px; margin: 1.25rem auto 0; }
        @media (max-width: 400px) {
          .bts-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
