import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { apiGet } from '../../../../services/api';

function getInitials(name) {
  const parts = (name || '').trim().split(/\s+/);
  return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : (name[0] || 'CP');
}

// Avatar gradient colors cycling through Carely palette
const AVATAR_COLORS = [
  ['#2D6A4F','#1B4332'],
  ['#1B6CA8','#0D4A7A'],
  ['#7B4FA6','#52357A'],
  ['#C77B2A','#8A5210'],
  ['#D64D76','#9A2952'],
];

export default function ProviderMatchStep({ data, onSelectProvider, onBack }) {
  const { service, address } = data;
  const [selected, setSelected] = useState(data.provider?.id || null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await apiGet('/providers');
        if (isMounted && res?.providers) {
          const list = res.providers
            .filter(p => p.approval_status === 'approved' && p.subscription_paid)
            .map(p => ({
            id: p.id,
            name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Verified Provider',
            specialty: (Array.isArray(p.specialties) ? p.specialties[0] : null) || (p.profession ? p.profession.toLowerCase().replace(/\s+/g, '_') : 'cleaning'),
            specialties: Array.isArray(p.specialties) ? p.specialties : [],
            profession: p.profession || 'Care Provider',
            pricePerHour: Number(p.price_per_hour) || 50,
            location: p.location || p.city || 'Yaoundé',
            experience: p.experience || (p.experience_yrs ? `${p.experience_yrs} yrs` : '1+ yrs'),
            bio: p.bio || '',
            rating: parseFloat(p.rating) > 0 ? parseFloat(p.rating) : 5.0,
            reviewCount: p.review_count || 0,
            photo: p.photo_url || null,
            available: p.is_available !== false,
            certifications: Array.isArray(p.certifications) && p.certifications.length > 0
              ? p.certifications
              : ['ID Verified', 'Background Checked'],
            approvalStatus: p.approval_status || 'approved',
            subscriptionPaid: Boolean(p.subscription_paid),
          }));
          setProviders(list);
        }
      } catch (err) {
        console.error('Failed to load providers for booking step:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const displayList = providers.filter(p => {
    if (!service) return true;
    const target = (service.specialty || service.id || '').toLowerCase();
    if (p.specialty && p.specialty.toLowerCase().includes(target)) return true;
    if (p.specialties?.some(s => s.toLowerCase().includes(target))) return true;
    if (p.profession && p.profession.toLowerCase().includes(target)) return true;
    return true;
  });

  const handleRequest = (provider) => {
    setSelected(provider.id);
    onSelectProvider(provider);
  };

  return (
    <div className="pms-root">
      <div className="pms-header">
        <h2 className="pms-title">Available Providers</h2>
        {service && (
          <p className="pms-sub">
            {displayList.length} provider{displayList.length !== 1 ? 's' : ''} found for{' '}
            <strong>{service.label}</strong>
            {address?.address?.city ? ` in ${address.address.city}` : ''}
          </p>
        )}
      </div>

      <div className="pms-list">
        {displayList.map((p, idx) => {
          const [from, to] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const isSelected = selected === p.id;
          return (
            <div key={p.id} className={`pms-card ${isSelected ? 'pms-card--selected' : ''}`}>
              {/* Avatar */}
              <div
                className="pms-avatar"
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              >
                {getInitials(p.name)}
              </div>

              {/* Info */}
              <div className="pms-info">
                <div className="pms-name-row">
                  <span className="pms-name">{p.name}</span>
                  {p.available && <span className="pms-badge">Available</span>}
                </div>
                <div className="pms-meta">
                  <span className="pms-meta-item">
                    <Star size={11} className="pms-star" />
                    {p.rating}
                  </span>
                  <span className="pms-meta-item">
                    <Clock size={11} />
                    {p.experience}y exp.
                  </span>
                  <span className="pms-meta-item">
                    <MapPin size={11} />
                    {p.location.split(',')[0]}
                  </span>
                </div>
                {p.verified && (
                  <div className="pms-verified">
                    <ShieldCheck size={11} />
                    Background checked
                  </div>
                )}
              </div>

              {/* Rate + CTA */}
              <div className="pms-right">
                <div className="pms-rate">
                  <span className="pms-rate-amount">{p.pricePerHour.toLocaleString()}</span>
                  <span className="pms-rate-unit">FCFA/hr</span>
                </div>
                <button
                  className={`pms-btn ${isSelected ? 'pms-btn--selected' : ''}`}
                  onClick={() => handleRequest(p)}
                >
                  {isSelected ? 'Selected ✓' : 'Request'}
                  {!isSelected && <ArrowRight size={13} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="pms-back" onClick={onBack}>← Back</button>

      <style>{`
        .pms-root { padding: 1rem 0 1.5rem; }
        .pms-header { text-align: center; margin-bottom: 1.1rem; }
        .pms-title {
          font-size: 1.15rem; font-weight: 700; color: #1C1A17;
          font-family: 'Playfair Display', serif; margin: 0 0 4px;
        }
        .pms-sub { font-size: 0.78rem; color: #8A7E74; margin: 0; }
        .pms-list { display: flex; flex-direction: column; gap: 0.7rem; }
        .pms-card {
          background: #fff; border-radius: 16px;
          border: 1.5px solid #E0DBD5; padding: 1rem;
          display: flex; align-items: center; gap: 0.85rem;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .pms-card:hover { border-color: #2D6A4F; box-shadow: 0 4px 16px rgba(45,106,79,0.10); }
        .pms-card--selected { border-color: #2D6A4F; background: #F0F7F4; }
        .pms-avatar {
          width: 46px; height: 46px; border-radius: 14px;
          flex-shrink: 0; display: flex; align-items: center;
          justify-content: center; color: #fff;
          font-size: 0.88rem; font-weight: 800;
        }
        .pms-info { flex: 1; min-width: 0; }
        .pms-name-row { display: flex; align-items: center; gap: 0.45rem; margin-bottom: 3px; }
        .pms-name { font-size: 0.88rem; font-weight: 700; color: #1C1A17; }
        .pms-badge {
          font-size: 0.6rem; font-weight: 700; color: #2D6A4F;
          background: rgba(45,106,79,0.10); border: 1px solid rgba(45,106,79,0.2);
          border-radius: 999px; padding: 1px 7px;
        }
        .pms-meta {
          display: flex; flex-wrap: wrap; gap: 7px;
          font-size: 0.7rem; color: #8A7E74; margin-bottom: 4px;
        }
        .pms-meta-item { display: flex; align-items: center; gap: 3px; }
        .pms-star { color: #F4A012; }
        .pms-verified {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.65rem; color: #2D6A4F; font-weight: 600;
        }
        .pms-right {
          flex-shrink: 0; display: flex; flex-direction: column;
          align-items: flex-end; gap: 0.4rem;
        }
        .pms-rate { text-align: right; }
        .pms-rate-amount { font-size: 0.9rem; font-weight: 800; color: #1C1A17; display: block; }
        .pms-rate-unit { font-size: 0.65rem; color: #8A7E74; }
        .pms-btn {
          display: flex; align-items: center; gap: 4px;
          padding: 0.45rem 0.85rem; border-radius: 8px;
          font-size: 0.75rem; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          color: #fff; border: none;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .pms-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(45,106,79,0.3); }
        .pms-btn--selected {
          background: #1E3A28;
          box-shadow: none;
        }
        .pms-back {
          margin-top: 1.25rem; background: none; border: none;
          color: #2D6A4F; font-size: 0.85rem; font-weight: 600;
          cursor: pointer; padding: 0; font-family: 'Inter', sans-serif;
        }
        .pms-back:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
