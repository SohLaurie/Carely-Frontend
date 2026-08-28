import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import ServiceSelectPanel from './ServiceSelectPanel';
import LocationStep from './LocationStep';
import BookingTypeStep from './BookingTypeStep';
import ProviderMatchStep from './ProviderMatchStep';
import ConfirmationStep from './ConfirmationStep';

// Steps that can be skipped:
//  - step 1 (service select) if initialService is provided
//  - step 4 (provider match) if initialProvider is provided

const STEP_LABELS = ['Service', 'Location', 'Schedule', 'Provider', 'Confirm'];

export default function BookingWizard({
  initialService  = null,
  initialProvider = null,
  onClose,
  onComplete,
}) {
  // Compute which steps are active (not skipped)
  const skippedSteps = new Set();
  if (initialService)  skippedSteps.add(1); // step index 0
  if (initialProvider) skippedSteps.add(4); // step index 3

  // Shared booking data object, mutated by each step
  const [bookingData, setBookingData] = useState({
    service:      initialService  || null,
    provider:     initialProvider || null,
    address:      null,
    bookingType:  null,
    date:         '',
    startTime:    '',
    endTime:      '',
    selectedDays: {},
    extras:       [],
    notes:        '',
  });

  // Active step: 0=service, 1=location, 2=bookingType, 3=provider, 4=confirm
  const firstStep = initialService ? 1 : 0;
  const [step, setStep] = useState(firstStep);

  const updateData = (patch) => setBookingData(prev => ({ ...prev, ...patch }));

  const goNext = () => {
    let next = step + 1;
    // Skip provider step if initialProvider provided
    if (next === 3 && initialProvider) next = 4;
    setStep(next);
  };

  const goBack = () => {
    let prev = step - 1;
    if (prev === 3 && initialProvider) prev = 2;
    if (prev < firstStep) { onClose(); return; }
    setStep(prev);
  };

  const handleServiceSelect = (svc) => {
    updateData({ service: svc });
    setStep(1);
  };

  const handleProviderSelect = (provider) => {
    updateData({ provider });
    setStep(4);
  };

  const handleConfirm = (patch = {}) => {
    const finalData = { ...bookingData, ...patch };
    onComplete && onComplete(finalData);
  };

  // Progress bar (only show step 0 if it's not skipped)
  const visibleStepLabels = initialService
    ? STEP_LABELS.slice(1)
    : STEP_LABELS;
  const progressIndex = initialService ? step - 1 : step;

  return (
    <div className="bw-overlay">
      <div className="bw-panel">
        {/* Header */}
        <div className="bw-header">
          <button className="bw-back-btn" onClick={goBack}>
            <ChevronLeft size={18} />
          </button>
          <div className="bw-progress">
            {visibleStepLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="bw-step-item">
                  <div className={`bw-step-dot ${
                    i < progressIndex ? 'bw-step-dot--done' :
                    i === progressIndex ? 'bw-step-dot--active' : ''
                  }`}>
                    {i < progressIndex ? '✓' : i + 1}
                  </div>
                  <span className={`bw-step-label ${i === progressIndex ? 'bw-step-label--active' : ''}`}>
                    {label}
                  </span>
                </div>
                {i < visibleStepLabels.length - 1 && (
                  <div className={`bw-step-line ${i < progressIndex ? 'bw-step-line--done' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <button className="bw-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Step content */}
        <div className="bw-content">
          {step === 0 && (
            // ServiceSelectPanel renders as its own backdrop modal
            <ServiceSelectPanel
              onSelect={handleServiceSelect}
              onClose={onClose}
            />
          )}

          {step === 1 && (
            <LocationStep
              data={bookingData}
              onChange={updateData}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 2 && (
            <BookingTypeStep
              data={bookingData}
              onChange={updateData}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {step === 3 && (
            <ProviderMatchStep
              data={bookingData}
              onSelectProvider={handleProviderSelect}
              onBack={goBack}
            />
          )}

          {step === 4 && (
            <ConfirmationStep
              data={bookingData}
              onConfirm={handleConfirm}
              onBack={goBack}
            />
          )}
        </div>
      </div>

      <style>{`
        .bw-overlay {
          position: fixed; inset: 0; z-index: 150;
          background: rgba(15,26,20,0.6);
          backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .bw-panel {
          background: #F7F5F2; border-radius: 24px;
          width: 100%; max-width: 600px;
          max-height: 90vh; display: flex; flex-direction: column;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
          animation: bw-pop 0.28s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
        }
        @keyframes bw-pop {
          from { transform: scale(0.92) translateY(20px); opacity: 0; }
          to   { transform: scale(1) translateY(0);       opacity: 1; }
        }
        /* Header */
        .bw-header {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 1.1rem 1.1rem 0.8rem;
          background: #fff;
          border-bottom: 1px solid #F0EBE5;
          flex-shrink: 0;
        }
        .bw-back-btn, .bw-close-btn {
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid #E0DBD5; background: #F7F5F2;
          color: #5A5248; display: flex; align-items: center;
          justify-content: center; cursor: pointer; flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .bw-back-btn:hover, .bw-close-btn:hover { background: #ede9e4; color: #1C1A17; }
        /* Progress bar */
        .bw-progress {
          flex: 1; display: flex; align-items: center;
          justify-content: center; gap: 0; overflow: hidden;
        }
        .bw-step-item {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          flex-shrink: 0;
        }
        .bw-step-dot {
          width: 26px; height: 26px; border-radius: 50%;
          border: 2px solid #C5BEB7; background: #fff;
          color: #C5BEB7; font-size: 0.65rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .bw-step-dot--active {
          border-color: #2D6A4F; background: #2D6A4F; color: #fff;
        }
        .bw-step-dot--done {
          border-color: #2D6A4F; background: #2D6A4F; color: #fff;
          font-size: 0.7rem;
        }
        .bw-step-label {
          font-size: 0.58rem; font-weight: 600; color: #B0A89E;
          white-space: nowrap;
        }
        .bw-step-label--active { color: #2D6A4F; font-weight: 800; }
        .bw-step-line {
          height: 2px; flex: 1; min-width: 16px; max-width: 32px;
          background: #E0DBD5; margin-bottom: 14px;
          transition: background 0.2s;
        }
        .bw-step-line--done { background: #2D6A4F; }
        /* Content area */
        .bw-content {
          flex: 1; overflow-y: auto; padding: 0 1.25rem;
          scroll-behavior: smooth;
        }
        .bw-content::-webkit-scrollbar { width: 4px; }
        .bw-content::-webkit-scrollbar-thumb { background: #C5BEB7; border-radius: 4px; }
        @media (max-width: 480px) {
          .bw-overlay { padding: 0; align-items: flex-end; }
          .bw-panel { border-radius: 24px 24px 0 0; max-height: 95vh; }
          .bw-step-label { display: none; }
          .bw-step-line { min-width: 12px; }
        }
      `}</style>
    </div>
  );
}
