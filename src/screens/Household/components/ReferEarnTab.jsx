import React, { useState, useEffect } from 'react';
import { Gift, Share2, Mail, Copy, Check, CreditCard, Coins } from 'lucide-react';
import { getCareCreditWallet } from '../../../services/carecreditApi';

const FacebookIcon = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

const MessengerIcon = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.145 2 11.242c0 2.907 1.442 5.503 3.702 7.178.193.143.307.373.307.616a2.023 2.023 0 0 1-.223.918l-.513 1.54c-.16.483.336.938.8.718l1.793-.847a.978.978 0 0 1 .632-.058c.959.266 1.97.41 3.023.41 5.523 0 10-4.145 10-9.242S17.523 2 12 2zm1.63 12.183-2.186-2.338-4.267 2.338 4.693-4.982 2.247 2.338 4.206-2.338-4.693 4.982z"/>
  </svg>
);

const WhatsappIcon = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.86.002-2.636-1.023-5.113-2.884-6.978C16.732 1.9 14.25 .876 11.616.876c-5.437 0-9.862 4.42-9.866 9.861-.001 1.776.474 3.51 1.378 5.068L2.148 21.84l6.1-1.602zM17.06 14.37c-.274-.138-1.62-.8-1.87-.89-.254-.09-.436-.135-.62.14-.18.27-.7 1.87-.86 2.05-.157.18-.314.202-.59.064-1.155-.578-1.927-.954-2.7-2.278-.2-.345.2-.32.572-1.065.06-.12.03-.224-.015-.314-.045-.09-.436-1.05-.6-1.443-.157-.38-.344-.33-.473-.33-.122-.007-.263-.009-.404-.009-.14 0-.37.05-.56.27-.19.22-.73.71-.73 1.74s.75 2.02.85 2.16c.1.14 1.47 2.25 3.57 3.16.5.22.89.35 1.2.45.5.16.96.14 1.32.08.4-.06 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.12-.27-.18-.54-.32z"/>
  </svg>
);

export default function ReferEarnTab() {
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [invited, setInvited] = useState(false);
  const [referralCode, setReferralCode] = useState('CARELY');

  useEffect(() => {
    getCareCreditWallet()
      .then(res => {
        if (res?.referralCode) setReferralCode(res.referralCode);
      })
      .catch(err => console.warn('Could not load referral code:', err));
  }, []);

  const referralLink = `https://carely.com/signup?ref=${referralCode}`;


  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvites = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setInvited(true);
    setEmailInput('');
    setTimeout(() => setInvited(false), 3000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
          <Gift size={22} className="fill-[#1E4030]/20" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">Refer & Earn</h2>
          <p className="text-sm text-[#8A7E74]">Earn 5 CareCredits per friend referral</p>
        </div>

      </div>

      {/* Share Unique Code Card */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 w-full">
        <h3 className="text-sm font-bold text-[#1C1A17] uppercase tracking-wider">Share your Unique Code</h3>
        
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[#8A7E74]">Your Code:</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex-1 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl px-5 py-3.5 font-mono font-bold text-lg text-[#1C1A17] tracking-wider flex items-center justify-between">
              <span>{referralCode}</span>
              <span className="text-[11px] font-sans font-medium text-[#8A7E74] select-none bg-[#E2D9CF]/30 px-2.5 py-1 rounded-md">Link Mode</span>
            </div>
            <button
              onClick={handleCopy}
              className="bg-[#1E4030] hover:bg-[#152e22] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow active:scale-95 shrink-0"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <FacebookIcon size={14} className="fill-current" />
            <span>Facebook</span>
          </a>
          <a
            href={`fb-messenger://share/?link=${encodeURIComponent(referralLink)}`}
            className="flex items-center gap-2 bg-[#00B2FF] hover:bg-[#009EE0] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <MessengerIcon size={14} className="fill-current" />
            <span>Messenger</span>
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join Carely and get 5,000 FCFA off your first professional home service booking!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span className="font-extrabold text-xs">X</span>
            <span>Share</span>
          </a>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Join Carely and get 5,000 FCFA off your first professional home service booking! Signup here: ${referralLink}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <WhatsappIcon size={14} className="fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Invite Friends via Email Card */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 w-full">
        <h3 className="text-sm font-bold text-[#1C1A17] uppercase tracking-wider">Invite your friends</h3>
        
        <form onSubmit={handleSendInvites} className="space-y-3 w-full">
          <label className="block text-xs font-semibold text-[#8A7E74]">Add email addresses:</label>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              placeholder="comma separated: friend1@mail.com, friend2@mail.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl px-5 py-3.5 text-sm text-[#1C1A17] outline-none focus:border-[#1E4030]/60 transition-all placeholder-[#B0A89E]"
            />
            <button
              type="submit"
              className="bg-[#1E4030] hover:bg-[#152e22] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 shrink-0"
            >
              <Mail size={16} />
              <span>Send Invites</span>
            </button>
          </div>
          {invited && (
            <p className="text-xs text-[#2D6A4F] font-semibold flex items-center gap-1.5 animate-fadeIn">
              <Check size={14} />
              <span>Invites sent successfully to your friends!</span>
            </p>
          )}
        </form>
      </div>

      {/* How it Works Card */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 w-full">
        <h3 className="text-sm font-bold text-[#1C1A17] uppercase tracking-wider">How it works</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-3 p-5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl">
            <div className="w-12 h-12 bg-[#EDF7F2] rounded-full flex items-center justify-center text-[#2D6A4F]">
              <Share2 size={20} />
            </div>
            <p className="text-sm text-[#5A5248] leading-relaxed">
              Spread the word with your unique code: <strong className="text-[#1E4030] font-mono">{referralCode}</strong>
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-3 p-5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl">
            <div className="w-12 h-12 bg-[#EDF7F2] rounded-full flex items-center justify-center text-[#2D6A4F]">
              <Gift size={20} />
            </div>
            <p className="text-sm text-[#5A5248] leading-relaxed">
              Each friend that books their first Carely service gets <strong className="text-[#1E4030]">platform fee waived (-5 FCFA)</strong>
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-3 p-5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl">
            <div className="w-12 h-12 bg-[#EDF7F2] rounded-full flex items-center justify-center text-[#2D6A4F]">
              <CreditCard size={20} />
            </div>
            <p className="text-sm text-[#5A5248] leading-relaxed">
              When their service completes, you earn <strong className="text-[#1E4030]">5 CareCredits</strong> redeemable for cash
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

