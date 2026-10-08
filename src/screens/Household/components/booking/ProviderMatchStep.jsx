import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { apiGet, getAvatarUrl } from '../../../../services/api';
import { getTopQualifiedProviders, providerOffersService } from '../../../../utils/careMatching';

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
        const params = new URLSearchParams();
        const targetDate = data.date || data.startDate;
        if (targetDate) params.append('date', targetDate);
        if (data.startTime) params.append('startTime', data.startTime);
        if (data.endTime) params.append('endTime', data.endTime);

        if (data.selectedDays && typeof data.selectedDays === 'object') {
          const DAY_KEY_TO_INDEX = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
          const dayKeys = Object.keys(data.selectedDays);
          const dayIndices = dayKeys.map(k => DAY_KEY_TO_INDEX[k] !== undefined ? DAY_KEY_TO_INDEX[k] : Number(k)).filter(n => !isNaN(n));
          if (dayIndices.length > 0) {
            params.append('days', dayIndices.join(','));
          }
        }

        const qs = params.toString() ? `?${params.toString()}` : '';
        const res = await apiGet(`/providers${qs}`);
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
            experience_yrs: p.experience_yrs,
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
            isCertified: Boolean(p.is_certified),
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
  }, [data.date, data.startDate, data.startTime, data.endTime, data.selectedDays]);

  const serviceKey = service?.specialty || (service?.id ? service.id.replace(/-/g, '_') : null);
  const locationCity = address?.address?.city || (address?.address?.full ? address.address.full.split(',').pop().trim() : null);

  // 1. Strictly filter providers offering this service (never show cleaners for babysitting)
  const matchedList = providers.filter(p => providerOffersService(p, serviceKey));

  // 2. Rank by qualification/proficiency in descending order (certified, highest rating, experience)
  // Max 5 recommendations as requested!
  const displayList = getTopQualifiedProviders(matchedList, {
    serviceKey,
    location: locationCity,
  }, 5);

  const handleRequest = (provider) => {
    setSelected(provider.id);
    onSelectProvider(provider);
  };

  return (
    <div className="pms-root">
      <div className="pms-header">
        <h2 className="pms-title">Recommended Providers</h2>
        {service && (
          <p className="pms-sub">
            {displayList.length} top-ranked provider{displayList.length !== 1 ? 's' : ''} recommended for{' '}
            <strong>{service.label}</strong>
            {locationCity ? ` in ${locationCity}` : ''} (ordered by qualification)
          </p>
        )}
      </div>

      <div className="pms-list">
        {displayList.length === 0 ? (
          <div className="pms-empty-state">
            <p className="pms-empty-title">
              No approved providers for {service?.label || 'this service'} available in {locationCity || 'this area'} yet.
            </p>
            <p className="pms-empty-desc">
              To guarantee safety and quality, Carely strictly verifies credentials and never substitutes with unqualified providers (e.g. cleaners for babysitting).
            </p>
          </div>
        ) : (
          displayList.map((p, idx) => {
            const [from, to] = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const isSelected = selected === p.id;
            return (
              <div key={p.id} className={`pms-card ${isSelected ? 'pms-card--selected' : ''}`}>
                {/* Avatar */}
                <div
                  className="pms-avatar overflow-hidden relative"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  {p.photo ? (
                    <img
                      src={getAvatarUrl(p.photo)}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    getInitials(p.name)
                  )}
                </div>

                {/* Info */}
                <div className="pms-info">
                  <div className="pms-name-row flex-wrap">
                    <span className="pms-name">{p.name}</span>
                    {idx === 0 && (
                      <span className="pms-rank-badge pms-rank-badge--top">
                        <Sparkles size={10} /> #1 Most Qualified
                      </span>
                    )}
                    {idx === 1 && (
                      <span className="pms-rank-badge">
                        #2 High Proficiency
                      </span>
                    )}
                    {idx > 1 && (
                      <span className="pms-rank-badge">
                        #{idx + 1} Recommended
                      </span>
                    )}
                    {p.isCertified && (
                      <span className="pms-certified-badge">
                        <ShieldCheck size={10} /> Certified
                      </span>
                    )}
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
                      {p.location ? p.location.split(',')[0] : 'Cameroon'}
                    </span>
                  </div>
                  {p.profession && (
                    <div className="text-[11px] text-[#5A5248] font-medium truncate">
                      {p.profession}
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
          })
        )}
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
        .pms-rank-badge {
          font-size: 0.6rem; font-weight: 700; color: #5A5248;
          background: #F5F1EC; border: 1px solid #E2D9CF;
          border-radius: 999px; padding: 1px 7px;
          display: inline-flex; align-items: center; gap: 3px;
        }
        .pms-rank-badge--top {
          color: #1E4030; background: #EDF7F2; border-color: #A3D9BE;
          font-weight: 800;
        }
        .pms-certified-badge {
          font-size: 0.6rem; font-weight: 700; color: #047857;
          background: #ECFDF5; border: 1px solid #A7F3D0;
          border-radius: 999px; padding: 1px 7px;
          display: inline-flex; align-items: center; gap: 3px;
        }
        .pms-empty-state {
          background: #FAF8F5; border: 1.5px dashed #E2D9CF; border-radius: 16px;
          padding: 2.2rem 1.25rem; text-align: center; margin: 0.5rem 0;
        }
        .pms-empty-title {
          font-size: 0.88rem; font-weight: 700; color: #1C1A17; margin: 0 0 6px;
        }
        .pms-empty-desc {
          font-size: 0.75rem; color: #8A7E74; margin: 0; line-height: 1.5;
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
