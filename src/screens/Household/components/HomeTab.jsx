import React, { useState } from 'react';
import {
  Sparkles, ChevronRight, Calendar, Star, Clock, MapPin,
  TrendingUp, Shield, ArrowRight
} from 'lucide-react';

/* ── Custom SVG icons per service ────────────────────────── */
const IndoorCleaningIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Broom handle */}
    <line x1="22" y1="6" x2="10" y2="28" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    {/* Broom head */}
    <path d="M7 26 Q10 22 13 26 Q16 30 10 31 Q5 30 7 26Z" fill={color} opacity="0.85"/>
    {/* Bubbles */}
    <circle cx="27" cy="10" r="2" stroke={color} strokeWidth="1.5" opacity="0.6"/>
    <circle cx="30" cy="16" r="1.3" stroke={color} strokeWidth="1.3" opacity="0.45"/>
    <circle cx="25" cy="18" r="1" stroke={color} strokeWidth="1.2" opacity="0.35"/>
  </svg>
);

const OutdoorCleaningIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="26" cy="10" r="4" fill={color} opacity="0.75"/>
    <line x1="26" y1="4" x2="26" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="26" y1="18" x2="26" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="20" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="34" y1="10" x2="32" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    {/* Leaf */}
    <path d="M8 30 C8 18 20 14 20 14 C20 14 22 26 10 30Z" fill={color} opacity="0.80"/>
    {/* Stem */}
    <line x1="9" y1="30" x2="14" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const MovingCleaningIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Box body */}
    <rect x="8" y="14" width="20" height="16" rx="2" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.12"/>
    {/* Box flaps open */}
    <path d="M8 14 L13 8 L23 8 L28 14" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
    {/* Center line on flaps */}
    <line x1="18" y1="8" x2="18" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
    {/* Sparkle */}
    <path d="M29 8 L30 6 L31 8 L33 9 L31 10 L30 12 L29 10 L27 9Z" fill={color} opacity="0.7"/>
  </svg>
);

const LaundryIroningIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Iron body */}
    <path d="M6 20 Q6 16 10 16 L28 16 Q32 16 30 20 L26 26 L6 26Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    {/* Iron handle */}
    <path d="M14 16 Q14 10 20 10 Q26 10 26 16" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Steam lines */}
    <path d="M12 29 Q13 31 12 33" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
    <path d="M18 29 Q19 31 18 33" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
    <path d="M24 29 Q25 31 24 33" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
  </svg>
);

const BabysittingIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Baby head */}
    <circle cx="18" cy="17" r="11" fill={color} fillOpacity="0.13" stroke={color} strokeWidth="2"/>
    {/* Hair tuft */}
    <path d="M14 7 Q18 4 22 7" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Left eye */}
    <circle cx="14.5" cy="15" r="1.5" fill={color} opacity="0.85"/>
    {/* Right eye */}
    <circle cx="21.5" cy="15" r="1.5" fill={color} opacity="0.85"/>
    {/* Smile */}
    <path d="M13.5 20 Q18 24 22.5 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85"/>
    {/* Pacifier ring */}
    <circle cx="18" cy="23.5" r="2.5" stroke={color} strokeWidth="1.4" fill="none" opacity="0.5"/>
    {/* Pacifier button */}
    <circle cx="18" cy="23.5" r="1" fill={color} opacity="0.45"/>
    {/* Chubby cheeks blush */}
    <ellipse cx="12" cy="18" rx="2" ry="1.2" fill={color} opacity="0.18"/>
    <ellipse cx="24" cy="18" rx="2" ry="1.2" fill={color} opacity="0.18"/>
  </svg>
);

const ElderCareIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Person head */}
    <circle cx="18" cy="9" r="5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2"/>
    {/* Person body */}
    <path d="M10 30 C10 22 14 18 18 18 C22 18 26 22 26 30" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Cane */}
    <line x1="24" y1="22" x2="29" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M27 32 Q30 32 31 30" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6"/>
    {/* Heart */}
    <path d="M15 12.5 C15 11 16.5 10 18 11.5 C19.5 10 21 11 21 12.5 C21 14 18 16 18 16 C18 16 15 14 15 12.5Z" fill={color} opacity="0.75"/>
  </svg>
);

/* ── Service definitions ─────────────────────────────────── */
const SERVICES = [
  {
    id: 'indoor-cleaning',
    label: 'Indoor Cleaning',
    SvgIcon: IndoorCleaningIcon,
    color: '#2D6A4F',
    bg: 'rgba(45,106,79,0.10)',
    border: 'rgba(45,106,79,0.22)',
    desc: 'Deep-clean your living spaces',
    specialty: 'cleaning',
  },
  {
    id: 'outdoor-cleaning',
    label: 'Outdoor Cleaning',
    SvgIcon: OutdoorCleaningIcon,
    color: '#1B6CA8',
    bg: 'rgba(27,108,168,0.10)',
    border: 'rgba(27,108,168,0.20)',
    desc: 'Yards, terraces & outdoor areas',
    specialty: 'cleaning',
  },
  {
    id: 'moving-cleaning',
    label: 'Moving Cleaning',
    SvgIcon: MovingCleaningIcon,
    color: '#7B4FA6',
    bg: 'rgba(123,79,166,0.10)',
    border: 'rgba(123,79,166,0.20)',
    desc: 'Move-in / move-out deep cleans',
    specialty: 'cleaning',
  },
  {
    id: 'laundry-ironing',
    label: 'Laundry & Ironing',
    SvgIcon: LaundryIroningIcon,
    color: '#C77B2A',
    bg: 'rgba(199,123,42,0.10)',
    border: 'rgba(199,123,42,0.20)',
    desc: 'Fresh, neatly pressed clothes',
    specialty: 'cleaning',
  },
  {
    id: 'babysitting',
    label: 'Babysitting',
    SvgIcon: BabysittingIcon,
    color: '#D64D76',
    bg: 'rgba(214,77,118,0.10)',
    border: 'rgba(214,77,118,0.20)',
    desc: 'Trusted childcare at home',
    specialty: 'babysitting',
  },
  {
    id: 'elder-care',
    label: 'Elder Care',
    SvgIcon: ElderCareIcon,
    color: '#2D6A4F',
    bg: 'rgba(45,106,79,0.10)',
    border: 'rgba(45,106,79,0.22)',
    desc: 'Compassionate senior support',
    specialty: 'nursing',
  },
];

/* ── Mock upcoming bookings (same shape as BookingsTab) ───── */
const UPCOMING = [
  {
    id: 'b1',
    provider: 'Marie-Claire Nkomo',
    service: 'Indoor Cleaning',
    date: 'Thu 29 Aug 2026',
    time: '09:00 – 13:00',
    location: 'Bastos, Yaoundé',
    status: 'Confirmed',
    rating: 4.9,
    initials: 'MN',
  },
  {
    id: 'b2',
    provider: 'Fatima Bello',
    service: 'Babysitting',
    date: 'Sat 31 Aug 2026',
    time: '14:00 – 18:00',
    location: 'Akwa, Douala',
    status: 'Confirmed',
    rating: 4.8,
    initials: 'FB',
  },
];

/* ── Stat cards shown at the top ─────────────────────────── */
const STATS = [
  { label: 'Bookings this month', value: '3', Icon: Calendar, accent: '#2D6A4F' },
  { label: 'Hours of care', value: '18h', Icon: Clock, accent: '#1B6CA8' },
  { label: 'Avg. provider rating', value: '4.9★', Icon: Star, accent: '#C77B2A' },
];

/* ── Component ───────────────────────────────────────────── */
export default function HomeTab({ onNavigate, userFirstName = 'there' }) {
  const [hoveredService, setHoveredService] = useState(null);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' :
    greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  const handleServiceClick = (service) => {
    if (onNavigate) {
      onNavigate('explore', { presetSpecialty: service.specialty });
    }
  };

  return (
    <div className="home-tab-root">

      {/* ── Hero Banner ─────────────────────────────────────── */}
      <div className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-content">
          <div className="home-hero-badge">
            <Sparkles size={12} />
            <span>Trusted Care Network</span>
          </div>
          <h1 className="home-hero-title">
            {greeting}, <span className="home-hero-name">{userFirstName}!</span>
          </h1>
          <p className="home-hero-sub">
            What service can we help you with today?
          </p>
        </div>
        {/* Decorative circles */}
        <div className="home-deco-circle home-deco-c1" />
        <div className="home-deco-circle home-deco-c2" />
      </div>

      {/* ── Quick Stats ─────────────────────────────────────── */}
      <div className="home-section">
        <div className="home-stats-row">
          {STATS.map(({ label, value, Icon, accent }) => (
            <div key={label} className="home-stat-card">
              <div className="home-stat-icon" style={{ background: accent + '1a', color: accent }}>
                <Icon size={16} />
              </div>
              <div>
                <p className="home-stat-value">{value}</p>
                <p className="home-stat-label">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Book a Service ──────────────────────────────────── */}
      <div className="home-section">
        <div className="home-section-header">
          <div>
            <h2 className="home-section-title">Book a Service</h2>
            <p className="home-section-sub">Choose from our trusted care offerings</p>
          </div>
          <button
            className="home-see-all"
            onClick={() => onNavigate && onNavigate('explore')}
          >
            See all <ChevronRight size={14} />
          </button>
        </div>

        <div className="home-services-grid">
          {SERVICES.map((svc) => {
            const isHovered = hoveredService === svc.id;
            return (
              <button
                key={svc.id}
                className="home-service-card"
                style={{
                  '--svc-color': svc.color,
                  '--svc-bg': svc.bg,
                  '--svc-border': svc.border,
                  transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered
                    ? `0 12px 32px ${svc.color}28`
                    : '0 2px 8px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={() => setHoveredService(svc.id)}
                onMouseLeave={() => setHoveredService(null)}
                onClick={() => handleServiceClick(svc)}
              >
                {/* Icon bubble */}
                <div
                  className="home-svc-icon-wrap"
                  style={{ background: svc.bg, border: `1.5px solid ${svc.border}` }}
                >
                  <svc.SvgIcon color={svc.color} />
                </div>
                <span className="home-svc-label">{svc.label}</span>
                <span className="home-svc-desc">{svc.desc}</span>

                {/* Hover arrow */}
                <div
                  className="home-svc-arrow"
                  style={{ opacity: isHovered ? 1 : 0, color: svc.color }}
                >
                  <ArrowRight size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Book a Service CTA ──────────────────────────────── */}
      <div className="home-section">
        <button
          className="home-book-cta"
          onClick={() => onNavigate && onNavigate('explore')}
        >
          <Sparkles size={16} />
          Book a Service
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ── Trust Banner ────────────────────────────────────── */}
      <div className="home-section">
        <div className="home-trust-banner">
          <div className="home-trust-icon">
            <Shield size={20} className="home-trust-shield" />
          </div>
          <div className="home-trust-text">
            <p className="home-trust-title">Verified &amp; background-checked providers</p>
            <p className="home-trust-sub">
              Every Carely provider passes ID checks, reference verification, and skill assessments before joining the network.
            </p>
          </div>
          <div className="home-trust-badge">
            <TrendingUp size={13} />
            <span>5% acceptance rate</span>
          </div>
        </div>
      </div>

      {/* ── Upcoming Bookings ───────────────────────────────── */}
      <div className="home-section">
        <div className="home-section-header">
          <div>
            <h2 className="home-section-title">Upcoming Bookings</h2>
            <p className="home-section-sub">Your next scheduled sessions</p>
          </div>
          <button
            className="home-see-all"
            onClick={() => onNavigate && onNavigate('bookings')}
          >
            View all <ChevronRight size={14} />
          </button>
        </div>

        {UPCOMING.length === 0 ? (
          <div className="home-empty">
            <Calendar size={28} className="home-empty-icon" />
            <p className="home-empty-text">No upcoming bookings</p>
            <p className="home-empty-sub">Book a service above to get started.</p>
          </div>
        ) : (
          <div className="home-bookings-list">
            {UPCOMING.map((b) => (
              <div key={b.id} className="home-booking-card">
                {/* Avatar */}
                <div className="home-booking-avatar">
                  {b.initials}
                </div>
                <div className="home-booking-info">
                  <div className="home-booking-top">
                    <span className="home-booking-name">{b.provider}</span>
                    <span className="home-booking-status">{b.status}</span>
                  </div>
                  <p className="home-booking-service">{b.service}</p>
                  <div className="home-booking-meta">
                    <span><Calendar size={11} /> {b.date}</span>
                    <span><Clock size={11} /> {b.time}</span>
                    <span><MapPin size={11} /> {b.location}</span>
                  </div>
                </div>
                <div className="home-booking-rating">
                  <Star size={12} className="home-star-icon" />
                  {b.rating}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Past Bookings ──────────────────────────────────── */}
      <div className="home-section home-section-last">
        <div className="home-section-header">
          <div>
            <h2 className="home-section-title">Past Bookings</h2>
            <p className="home-section-sub">Your completed sessions</p>
          </div>
        </div>
        <div className="home-empty">
          <Clock size={28} className="home-empty-icon" />
          <p className="home-empty-text">No past bookings yet</p>
          <p className="home-empty-sub">Completed bookings will appear here.</p>
        </div>
      </div>

      {/* ── Scoped styles ─────────────────────────────────── */}
      <style>{`
        /* Root wrapper */
        .home-tab-root {
          min-height: 100%;
          background: #F7F5F2;
          font-family: 'Inter', sans-serif;
        }

        /* ── Hero ── */
        .home-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0F1A14 0%, #1E3A28 60%, #2D6A4F 100%);
          padding: 2.5rem 2rem 3rem;
          color: white;
        }
        .home-hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(45,106,79,0.35) 0%, transparent 70%);
          pointer-events: none;
        }
        .home-hero-content { position: relative; z-index: 1; max-width: 480px; }
        .home-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: rgba(255,255,255,0.85);
          margin-bottom: 1rem;
          backdrop-filter: blur(6px);
        }
        .home-hero-title {
          font-size: 1.9rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 0.5rem;
          font-family: 'Playfair Display', serif;
        }
        .home-hero-name { color: #74C69D; }
        .home-hero-sub {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.65);
          margin: 0;
        }
        .home-deco-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0.07;
          background: white;
        }
        .home-deco-c1 { width: 260px; height: 260px; top: -80px; right: -60px; }
        .home-deco-c2 { width: 160px; height: 160px; bottom: -60px; right: 80px; }

        /* ── Sections ── */
        .home-section {
          padding: 1.6rem 1.5rem 0;
        }
        .home-section-last { padding-bottom: 2.5rem; }
        .home-section-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .home-section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1C1A17;
          margin: 0 0 2px;
          font-family: 'Playfair Display', serif;
        }
        .home-section-sub {
          font-size: 0.78rem;
          color: #8A7E74;
          margin: 0;
        }
        .home-see-all {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #2D6A4F;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 0;
          transition: gap 0.2s;
        }
        .home-see-all:hover { gap: 6px; }

        /* ── Stats ── */
        .home-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .home-stat-card {
          background: white;
          border-radius: 14px;
          padding: 0.9rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .home-stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .home-stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1C1A17;
          margin: 0;
        }
        .home-stat-label {
          font-size: 0.68rem;
          color: #8A7E74;
          margin: 0;
          line-height: 1.3;
        }

        /* ── Services grid ── */
        .home-services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .home-service-card {
          background: white;
          border-radius: 16px;
          padding: 1rem 0.75rem 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.45rem;
          border: 1.5px solid rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          position: relative;
          text-align: center;
        }
        .home-svc-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2px;
        }
        .home-svc-emoji { font-size: 1.55rem; line-height: 1; }
        .home-svc-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #1C1A17;
          line-height: 1.25;
        }
        .home-svc-desc {
          font-size: 0.65rem;
          color: #8A7E74;
          line-height: 1.3;
        }
        .home-svc-arrow {
          position: absolute;
          top: 8px;
          right: 10px;
          transition: opacity 0.2s;
        }

        /* ── Trust banner ── */
        /* ── Book a Service CTA ── */
        .home-book-cta {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%);
          color: white;
          font-size: 0.95rem;
          font-weight: 700;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          letter-spacing: 0.01em;
          box-shadow: 0 6px 20px rgba(45,106,79,0.35);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .home-book-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(45,106,79,0.45);
          background: linear-gradient(135deg, #388360 0%, #22523d 100%);
        }
        .home-book-cta:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(45,106,79,0.30);
        }

        .home-trust-banner {
          background: linear-gradient(135deg, #0F1A14 0%, #1E3A28 100%);
          border-radius: 18px;
          padding: 1.2rem 1.2rem;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          color: white;
        }
        .home-trust-icon {
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(116,198,157,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .home-trust-shield { color: #74C69D; }
        .home-trust-text { flex: 1; }
        .home-trust-title {
          font-size: 0.82rem;
          font-weight: 700;
          margin: 0 0 4px;
          color: white;
        }
        .home-trust-sub {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.55);
          margin: 0;
          line-height: 1.45;
        }
        .home-trust-badge {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          background: rgba(116,198,157,0.15);
          border: 1px solid rgba(116,198,157,0.25);
          border-radius: 10px;
          padding: 0.5rem 0.7rem;
          font-size: 0.65rem;
          font-weight: 700;
          color: #74C69D;
          text-align: center;
          white-space: nowrap;
        }

        /* ── Bookings ── */
        .home-bookings-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .home-booking-card {
          background: white;
          border-radius: 16px;
          padding: 1rem 1.1rem;
          display: flex;
          align-items: center;
          gap: 0.9rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
          transition: box-shadow 0.2s;
        }
        .home-booking-card:hover { box-shadow: 0 6px 20px rgba(45,106,79,0.12); }
        .home-booking-avatar {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2D6A4F, #1E3A28);
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .home-booking-info { flex: 1; min-width: 0; }
        .home-booking-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 2px;
        }
        .home-booking-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: #1C1A17;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .home-booking-status {
          flex-shrink: 0;
          font-size: 0.65rem;
          font-weight: 700;
          color: #2D6A4F;
          background: rgba(45,106,79,0.10);
          border: 1px solid rgba(45,106,79,0.20);
          border-radius: 999px;
          padding: 2px 8px;
        }
        .home-booking-service {
          font-size: 0.75rem;
          color: #5A5248;
          margin: 0 0 5px;
        }
        .home-booking-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.68rem;
          color: #8A7E74;
        }
        .home-booking-meta span {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .home-booking-rating {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #C77B2A;
        }
        .home-star-icon { color: #F4A012; }

        /* ── Empty states ── */
        .home-empty {
          background: white;
          border-radius: 16px;
          padding: 2rem 1rem;
          text-align: center;
          border: 1px dashed rgba(0,0,0,0.10);
        }
        .home-empty-icon { color: #C5BEB7; margin: 0 auto 0.6rem; }
        .home-empty-text {
          font-size: 0.88rem;
          font-weight: 600;
          color: #5A5248;
          margin: 0 0 4px;
        }
        .home-empty-sub {
          font-size: 0.75rem;
          color: #8A7E74;
          margin: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .home-hero { padding: 2rem 1.25rem 2.5rem; }
          .home-hero-title { font-size: 1.55rem; }
          .home-services-grid { grid-template-columns: repeat(2, 1fr); }
          .home-stats-row { grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
          .home-stat-card { padding: 0.7rem 0.6rem; }
          .home-trust-banner { flex-direction: column; }
          .home-trust-badge { align-self: flex-start; flex-direction: row; }
        }
      `}</style>
    </div>
  );
}
