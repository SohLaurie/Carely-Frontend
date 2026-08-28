import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X, Search } from 'lucide-react';
import { ADDRESSES } from './bookingData';

export default function LocationStep({ data, onChange, onNext, onBack }) {
  const [query, setQuery]       = useState(data.addressText || '');
  const [results, setResults]   = useState([]);
  const [selected, setSelected] = useState(data.address || null);
  const [unit, setUnit]         = useState(data.unit || '');
  const [open, setOpen]         = useState(false);
  const inputRef = useRef(null);

  // Filter address list as user types across all Cameroon quarters
  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }
    const q = query.toLowerCase().trim();
    const hits = ADDRESSES.filter(a =>
      a.full.toLowerCase().includes(q) ||
      (a.quarter && a.quarter.toLowerCase().includes(q)) ||
      (a.city && a.city.toLowerCase().includes(q))
    ).slice(0, 8);

    // If query does not exactly match an existing hit, add custom quarter fallback
    const hasExact = hits.some(h => h.full.toLowerCase() === q || (h.quarter && h.quarter.toLowerCase() === q));
    if (!hasExact && q.length >= 2) {
      hits.unshift({
        id: `custom_${q}`,
        full: `${query.trim()}, Cameroon`,
        city: 'Cameroon',
        quarter: query.trim(),
        isCustom: true
      });
    }

    setResults(hits);
    setOpen(hits.length > 0);
  }, [query]);

  const handleSelect = (addr) => {
    setSelected(addr);
    setQuery(addr.full);
    setOpen(false);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  // If query is present and user typed custom text, canContinue is true
  const canContinue = !!selected || query.trim().length >= 2;

  const handleSetLocation = () => {
    if (!canContinue) return;
    const finalAddress = selected || {
      id: `custom_${Date.now()}`,
      full: `${query.trim()}, Cameroon`,
      city: 'Cameroon',
      quarter: query.trim(),
      isCustom: true
    };
    onChange({ address: finalAddress, addressText: finalAddress.full, unit });
    onNext();
  };

  return (
    <div className="ls-root">
      <div className="ls-card">
        <h2 className="ls-title">Where do you need help?</h2>

        {/* Street Address */}
        <div className="ls-field-label">Street Address</div>
        <div className="ls-search-wrap">
          <div className={`ls-input-row ${open ? 'ls-input-row--open' : ''}`}>
            <Search size={15} className="ls-input-icon" />
            <input
              ref={inputRef}
              className="ls-input"
              type="text"
              placeholder="Search street, building or landmark…"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null); }}
              onFocus={() => results.length > 0 && setOpen(true)}
              autoComplete="off"
            />
            {query && (
              <button className="ls-clear" onClick={handleClear}><X size={14} /></button>
            )}
          </div>

          {/* Dropdown */}
          {open && (
            <ul className="ls-dropdown">
              {results.map(addr => (
                <li key={addr.id} className="ls-dropdown-item" onClick={() => handleSelect(addr)}>
                  <MapPin size={13} className="ls-pin-icon" />
                  <span>
                    <strong className="ls-addr-main">{addr.full.split(',')[0]}</strong>
                    <span className="ls-addr-rest">{addr.full.split(',').slice(1).join(',')}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected address confirmed display */}
        {selected && (
          <p className="ls-confirmed">{selected.full}</p>
        )}

        {/* Unit / Apartment */}
        <div className="ls-field-label ls-field-label--mt">
          Unit / Apartment No. and Name <span className="ls-optional">(Optional)</span>
        </div>
        <input
          className="ls-unit-input"
          type="text"
          placeholder="Eg. 2a Entrée Principale"
          value={unit}
          onChange={e => setUnit(e.target.value)}
        />

        {/* Set Location button */}
        <button
          className={`ls-btn ${canContinue ? 'ls-btn--active' : 'ls-btn--disabled'}`}
          onClick={handleSetLocation}
          disabled={!canContinue}
        >
          Set Location & Continue
        </button>
      </div>

      <style>{`
        .ls-root {
          display: flex; flex-direction: column;
          align-items: center; padding: 1.5rem 1rem 2rem;
          min-height: 100%;
        }
        .ls-card {
          background: #fff; border-radius: 20px;
          padding: 1.8rem 1.5rem; width: 100%; max-width: 520px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .ls-title {
          font-size: 1.25rem; font-weight: 700; color: #1C1A17;
          font-family: 'Playfair Display', serif;
          margin: 0 0 1.4rem; text-align: center;
        }
        .ls-field-label {
          font-size: 0.8rem; font-weight: 700; color: #1C1A17;
          margin-bottom: 0.45rem;
        }
        .ls-field-label--mt { margin-top: 1.1rem; }
        .ls-optional { font-weight: 400; color: #8A7E74; }
        .ls-search-wrap { position: relative; }
        .ls-input-row {
          display: flex; align-items: center; gap: 0.5rem;
          border: 1.8px solid #E0DBD5; border-radius: 10px;
          padding: 0 0.75rem; background: #fff;
          transition: border-color 0.15s;
        }
        .ls-input-row:focus-within { border-color: #2D6A4F; }
        .ls-input-row--open { border-radius: 10px 10px 0 0; border-bottom-color: transparent; }
        .ls-input-icon { color: #8A7E74; flex-shrink: 0; }
        .ls-input {
          flex: 1; border: none; outline: none;
          padding: 0.75rem 0; font-size: 0.88rem; color: #1C1A17;
          font-family: 'Inter', sans-serif; background: transparent;
        }
        .ls-input::placeholder { color: #B0A89E; }
        .ls-clear {
          background: none; border: none; cursor: pointer;
          color: #8A7E74; padding: 2px; display: flex;
          align-items: center; transition: color 0.15s;
        }
        .ls-clear:hover { color: #1C1A17; }
        .ls-dropdown {
          position: absolute; left: 0; right: 0; top: 100%;
          background: #fff; border: 1.8px solid #2D6A4F;
          border-top: none; border-radius: 0 0 10px 10px;
          list-style: none; margin: 0; padding: 0.25rem 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          z-index: 50; max-height: 220px; overflow-y: auto;
        }
        .ls-dropdown-item {
          display: flex; align-items: flex-start; gap: 0.55rem;
          padding: 0.6rem 0.85rem; cursor: pointer;
          transition: background 0.12s;
        }
        .ls-dropdown-item:hover { background: #F0F7F4; }
        .ls-pin-icon { color: #2D6A4F; flex-shrink: 0; margin-top: 2px; }
        .ls-addr-main { font-weight: 600; font-size: 0.82rem; color: #1C1A17; display: block; }
        .ls-addr-rest { font-size: 0.75rem; color: #8A7E74; }
        .ls-confirmed {
          font-size: 0.78rem; color: #2D6A4F; font-weight: 500;
          margin: 0.5rem 0 0; padding: 0.5rem 0.75rem;
          background: rgba(45,106,79,0.07); border-radius: 8px;
        }
        .ls-unit-input {
          width: 100%; box-sizing: border-box;
          border: 1.8px solid #E0DBD5; border-radius: 10px;
          padding: 0.72rem 0.85rem; font-size: 0.88rem; color: #1C1A17;
          font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.15s;
        }
        .ls-unit-input:focus { border-color: #2D6A4F; }
        .ls-unit-input::placeholder { color: #B0A89E; }
        .ls-btn {
          width: 100%; margin-top: 1.5rem;
          padding: 0.95rem; border: none; border-radius: 12px;
          font-size: 0.95rem; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .ls-btn--active {
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          color: #fff; box-shadow: 0 6px 20px rgba(45,106,79,0.35);
        }
        .ls-btn--active:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(45,106,79,0.45);
        }
        .ls-btn--disabled {
          background: #E8E4DF; color: #B0A89E; cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
