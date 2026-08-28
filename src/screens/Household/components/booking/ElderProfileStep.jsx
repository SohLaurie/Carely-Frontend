import React, { useState } from 'react';

export default function ElderProfileStep({ data, onChange, onNext, onBack }) {
  const [recipient, setRecipient]     = useState(data.elderProfile?.recipient || '');
  const [allergies, setAllergies]     = useState(data.elderProfile?.allergies || '');
  const [medications, setMedications] = useState(data.elderProfile?.medications || '');
  const [emergency, setEmergency]     = useState(data.elderProfile?.emergency || '');
  const [pets, setPets]               = useState(data.elderProfile?.pets || '');

  const canContinue = recipient.trim().length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    onChange({
      elderProfile: {
        recipient,
        allergies,
        medications,
        emergency,
        pets,
      }
    });
    onNext();
  };

  return (
    <div className="eps-root">
      <div className="eps-card">
        <h2 className="eps-title">Please complete your profile</h2>
        <p className="eps-subtitle">A few questions to get started</p>

        <div className="eps-scroll-area">
          {/* Question 1 */}
          <div className="eps-field">
            <label className="eps-label">Name and age of care recipient</label>
            <input
              type="text"
              className="eps-input"
              placeholder="Julie, age 68"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
            <span className="eps-help">Please add personal details</span>
          </div>

          {/* Question 2 */}
          <div className="eps-field">
            <label className="eps-label">Does the care recipient have any allergies?</label>
            <input
              type="text"
              className="eps-input"
              placeholder="Dairy, Penicillin"
              value={allergies}
              onChange={e => setAllergies(e.target.value)}
            />
            <span className="eps-help">If no allergies, type "none"</span>
          </div>

          {/* Question 3 */}
          <div className="eps-field">
            <label className="eps-label">Should the carer remind the care recipient to take their medication?</label>
            <input
              type="text"
              className="eps-input"
              placeholder="Yes, she takes blood pressure medication at 1pm and he..."
              value={medications}
              onChange={e => setMedications(e.target.value)}
            />
            <span className="eps-help">If no medication, type "none"</span>
          </div>

          {/* Question 4 */}
          <div className="eps-field">
            <label className="eps-label">Who should the carer contact in case of an emergency?</label>
            <input
              type="text"
              className="eps-input"
              placeholder="Jane Austin (daughter), 082 334 1132"
              value={emergency}
              onChange={e => setEmergency(e.target.value)}
            />
            <span className="eps-help">Please specify emergency contact details</span>
          </div>

          {/* Question 5 */}
          <div className="eps-field">
            <label className="eps-label">Are there any pets at the property?</label>
            <input
              type="text"
              className="eps-input"
              placeholder="Yes, two dogs"
              value={pets}
              onChange={e => setPets(e.target.value)}
            />
            <span className="eps-help">If no pets, type "none"</span>
          </div>
        </div>

        {/* Actions */}
        <div className="eps-actions">
          <button className="eps-btn eps-btn--back" onClick={onBack} type="button">
            Back
          </button>
          <button
            className={`eps-btn ${canContinue ? 'eps-btn--submit' : 'eps-btn--disabled'}`}
            onClick={handleContinue}
            disabled={!canContinue}
            type="button"
          >
            Continue
          </button>
        </div>
      </div>

      <style>{`
        .eps-root { padding: 0.25rem 0 0.5rem; }
        .eps-card {
          background: #fff; border-radius: 20px;
          border: 1.5px solid #E0DBD5; padding: 1.5rem;
          font-family: 'Inter', sans-serif;
          max-width: 540px; margin: 0 auto;
        }
        .eps-title {
          font-size: 1.35rem; font-weight: 700; color: #1C1A17;
          text-align: center; margin: 0 0 0.35rem;
          font-family: 'Playfair Display', serif;
        }
        .eps-subtitle {
          font-size: 0.88rem; color: #8A7E74; text-align: center;
          margin: 0 0 1.5rem; font-weight: 500;
        }
        .eps-scroll-area {
          max-height: 48vh; overflow-y: auto; padding-right: 0.5rem;
          margin-bottom: 1.4rem; display: flex; flex-direction: column; gap: 1.1rem;
        }
        /* Custom scrollbar */
        .eps-scroll-area::-webkit-scrollbar { width: 6px; }
        .eps-scroll-area::-webkit-scrollbar-track { background: #F7F5F2; border-radius: 3px; }
        .eps-scroll-area::-webkit-scrollbar-thumb { background: #C5BEB7; border-radius: 3px; }
        .eps-scroll-area::-webkit-scrollbar-thumb:hover { background: #8A7E74; }

        .eps-field {
          display: flex; flex-direction: column; gap: 0.35rem;
        }
        .eps-label {
          font-size: 0.86rem; font-weight: 600; color: #3A3228;
          line-height: 1.35;
        }
        .eps-input {
          width: 100%; border: 1.5px solid #E0DBD5; border-radius: 12px;
          padding: 0.75rem 0.9rem; font-size: 0.88rem;
          color: #1C1A17; font-family: 'Inter', sans-serif;
          outline: none; background: #F7F5F2;
          transition: border-color 0.15s, background-color 0.15s;
        }
        .eps-input:focus {
          border-color: #F3A83B; background: #fff;
          box-shadow: 0 0 0 3px rgba(243,168,59,0.12);
        }
        .eps-help {
          font-size: 0.72rem; color: #F3A83B; font-weight: 600;
          margin-top: 1px;
        }
        /* Actions */
        .eps-actions { display: flex; gap: 0.75rem; border-top: 1px solid #F0EBE5; padding-top: 1.1rem; }
        .eps-btn {
          flex: 1; padding: 0.9rem; border-radius: 12px;
          font-size: 0.9rem; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .eps-btn--back {
          background: #fff; border: 1.8px solid #E0DBD5; color: #5A5248;
        }
        .eps-btn--back:hover { border-color: #2D6A4F; color: #2D6A4F; }
        .eps-btn--submit {
          background: linear-gradient(135deg, #2D6A4F, #1B4332);
          border: none; color: #fff;
          box-shadow: 0 4px 16px rgba(45,106,79,0.35);
        }
        .eps-btn--submit:hover { transform: translateY(-2px); }
        .eps-btn--disabled {
          background: #E8E4DF; border: none; color: #B0A89E; cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
