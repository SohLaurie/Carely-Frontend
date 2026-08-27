import React from 'react';
import { X } from 'lucide-react';
import { BOOKING_SERVICES } from './bookingData';

// ── SVG icons (same as HomeTab) ───────────────────────────────────────────────
const IndoorCleaningIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <line x1="22" y1="6" x2="10" y2="28" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M7 26 Q10 22 13 26 Q16 30 10 31 Q5 30 7 26Z" fill={color} opacity="0.85"/>
    <circle cx="27" cy="10" r="2" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="30" cy="16" r="1.3" stroke={color} strokeWidth="1.3" opacity="0.45"/>
  </svg>
);
const OutdoorCleaningIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <circle cx="26" cy="10" r="4" fill={color} opacity="0.75"/>
    <line x1="26" y1="4" x2="26" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="26" y1="18" x2="26" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="20" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="34" y1="10" x2="32" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <path d="M8 30 C8 18 20 14 20 14 C20 14 22 26 10 30Z" fill={color} opacity="0.80"/>
  </svg>
);
const MovingCleaningIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <rect x="8" y="14" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.12"/>
    <path d="M8 14 L13 8 L23 8 L28 14" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
    <line x1="18" y1="8" x2="18" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
    <path d="M29 8 L30 6 L31 8 L33 9 L31 10 L30 12 L29 10 L27 9Z" fill={color} opacity="0.7"/>
  </svg>
);
const LaundryIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <path d="M6 20 Q6 16 10 16 L28 16 Q32 16 30 20 L26 26 L6 26Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 16 Q14 10 20 10 Q26 10 26 16" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M12 29 Q13 31 12 33" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
    <path d="M18 29 Q19 31 18 33" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
    <path d="M24 29 Q25 31 24 33" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
  </svg>
);
const BabysittingIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="17" r="11" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="2"/>
    <path d="M14 7 Q18 4 22 7" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="14.5" cy="15" r="1.5" fill={color} opacity="0.85"/>
    <circle cx="21.5" cy="15" r="1.5" fill={color} opacity="0.85"/>
    <path d="M13.5 20 Q18 24 22.5 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85"/>
    <ellipse cx="12" cy="18" rx="2" ry="1.2" fill={color} opacity="0.18"/>
    <ellipse cx="24" cy="18" rx="2" ry="1.2" fill={color} opacity="0.18"/>
  </svg>
);
const ElderCareIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="9" r="5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2"/>
    <path d="M10 30 C10 22 14 18 18 18 C22 18 26 22 26 30" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    <line x1="24" y1="22" x2="29" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M27 32 Q30 32 31 30" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M15 12.5 C15 11 16.5 10 18 11.5 C19.5 10 21 11 21 12.5 C21 14 18 16 18 16 C18 16 15 14 15 12.5Z" fill={color} opacity="0.75"/>
  </svg>
);

const ICON_MAP = {
  'indoor-cleaning':  IndoorCleaningIcon,
  'outdoor-cleaning': OutdoorCleaningIcon,
  'moving-cleaning':  MovingCleaningIcon,
  'laundry-ironing':  LaundryIcon,
  'babysitting':      BabysittingIcon,
  'elder-care':       ElderCareIcon,
};

// ── Component ────────────────────────────────────────────────────────────────
export default function ServiceSelectPanel({ onSelect, onClose }) {
  return (
    <div className="ssp-backdrop" onClick={onClose}>
      <div className="ssp-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="ssp-handle" />

        {/* Header */}
        <div className="ssp-header">
          <div>
            <h2 className="ssp-title">What service do you need?</h2>
            <p className="ssp-sub">Select a service to begin booking</p>
          </div>
          <button className="ssp-close" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Service grid */}
        <div className="ssp-grid">
          {BOOKING_SERVICES.map(svc => {
            const SvgIcon = ICON_MAP[svc.id];
            return (
              <button
                key={svc.id}
                className="ssp-card"
                style={{ '--svc-color': svc.color, '--svc-bg': svc.bg, '--svc-border': svc.border }}
                onClick={() => onSelect(svc)}
              >
                <div className="ssp-icon-wrap" style={{ background: svc.bg, border: `1.5px solid ${svc.border}` }}>
                  {SvgIcon && <SvgIcon color={svc.color} />}
                </div>
                <span className="ssp-label">{svc.label}</span>
              </button>
            );
          })}
        </div>

        <style>{`
          .ssp-backdrop {
            position: fixed; inset: 0; z-index: 200;
            background: rgba(15,26,20,0.55);
            backdrop-filter: blur(4px);
            display: flex; align-items: flex-end; justify-content: center;
          }
          .ssp-sheet {
            background: #fff;
            border-radius: 24px 24px 0 0;
            width: 100%; max-width: 680px;
            padding: 0 1.5rem 2.5rem;
            box-shadow: 0 -8px 40px rgba(0,0,0,0.18);
            animation: ssp-slide-up 0.3s cubic-bezier(0.34,1.56,0.64,1);
          }
          @keyframes ssp-slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
          .ssp-handle {
            width: 40px; height: 4px; border-radius: 99px;
            background: #e0dbd5; margin: 12px auto 0;
          }
          .ssp-header {
            display: flex; align-items: flex-start;
            justify-content: space-between; gap: 1rem;
            padding: 1.25rem 0 1rem;
          }
          .ssp-title {
            font-size: 1.15rem; font-weight: 700; color: #1C1A17;
            font-family: 'Playfair Display', serif; margin: 0 0 3px;
          }
          .ssp-sub { font-size: 0.78rem; color: #8A7E74; margin: 0; }
          .ssp-close {
            width: 34px; height: 34px; border-radius: 50%;
            border: 1.5px solid #e0dbd5;
            background: #F7F5F2; color: #5A5248;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; flex-shrink: 0;
            transition: background 0.15s;
          }
          .ssp-close:hover { background: #ede9e4; }
          .ssp-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
          }
          .ssp-card {
            background: #fff; border-radius: 16px;
            border: 1.5px solid rgba(0,0,0,0.07);
            padding: 1.1rem 0.6rem 0.9rem;
            display: flex; flex-direction: column; align-items: center; gap: 0.55rem;
            cursor: pointer; transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
            text-align: center;
          }
          .ssp-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.10);
            border-color: var(--svc-color);
          }
          .ssp-icon-wrap {
            width: 56px; height: 56px; border-radius: 16px;
            display: flex; align-items: center; justify-content: center;
          }
          .ssp-label {
            font-size: 0.73rem; font-weight: 700; color: #1C1A17;
            line-height: 1.3;
          }
          @media (max-width: 480px) {
            .ssp-grid { grid-template-columns: repeat(2, 1fr); }
          }
        `}</style>
      </div>
    </div>
  );
}
