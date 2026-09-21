import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { SERVICE_QUESTIONS_CONFIG } from './bookingData';

export default function ServiceQuestions({ serviceId, values = {}, onChange }) {
  const [activeInfo, setActiveInfo] = useState(null);

  const configs = SERVICE_QUESTIONS_CONFIG[serviceId];
  if (!configs || configs.length === 0) return null;

  const handleChange = (questionId, val) => {
    onChange && onChange({
      ...values,
      [questionId]: val
    });
  };

  return (
    <div className="sq-container">
      {configs.map((q) => {
        const currentVal = values[q.id] || q.defaultValue || q.options[0];

        return (
          <div key={q.id} className="sq-item">
            <div className="sq-label-row">
              <label className="sq-label">
                {q.label}
              </label>
              {q.info && (
                <div className="sq-info-wrap">
                  <button
                    type="button"
                    className="sq-info-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveInfo(activeInfo === q.id ? null : q.id);
                    }}
                    title="Click for info"
                  >
                    <Info size={14} className="text-[#2D6A4F]" />
                  </button>
                  {activeInfo === q.id && (
                    <div className="sq-tooltip">
                      {q.info}
                    </div>
                  )}
                </div>
              )}
            </div>

            {q.sublabel && (
              <p className="sq-sublabel">{q.sublabel}</p>
            )}

            <div className="sq-select-wrapper">
              <select
                className="sq-select"
                value={currentVal}
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="sq-chevron" />
            </div>
          </div>
        );
      })}

      <style>{`
        .sq-container {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-bottom: 1.4rem;
          padding-top: 0.2rem;
        }
        .sq-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .sq-label-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .sq-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #1C1A17;
          margin: 0;
          font-family: inherit;
        }
        .sq-sublabel {
          font-size: 0.8rem;
          font-style: italic;
          color: #5A5248;
          margin: -0.1rem 0 0.2rem 0;
        }
        .sq-info-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .sq-info-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          display: inline-flex;
          align-items: center;
          border-radius: 50%;
          outline: none;
        }
        .sq-info-btn:hover {
          opacity: 0.8;
        }
        .sq-tooltip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #1E4030;
          color: #fff;
          font-size: 0.75rem;
          padding: 6px 10px;
          border-radius: 8px;
          white-space: nowrap;
          z-index: 50;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          pointer-events: none;
        }
        .sq-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .sq-select {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background-color: #FFFFFF;
          border: 1.5px solid #2D6A4F;
          border-radius: 9999px;
          padding: 0.65rem 2.5rem 0.65rem 1.1rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1C1A17;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .sq-select:focus {
          border-color: #1E4030;
          box-shadow: 0 0 0 3px rgba(45,106,79,0.15);
        }
        .sq-chevron {
          position: absolute;
          right: 1.1rem;
          color: #2D6A4F;
          pointer-events: none;
          transition: transform 0.2s;
        }
        .sq-select:focus + .sq-chevron {
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
