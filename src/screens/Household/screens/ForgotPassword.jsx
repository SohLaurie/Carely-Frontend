import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  KeyRound,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Users,
  Star,
  TrendingUp,
} from 'lucide-react';
import {
  requestPasswordReset,
  verifyRecoveryCode,
  resetPasswordWithToken,
} from '../../../services/auth.service';

const FEATURES = [
  { Icon: ShieldCheck, text: 'Identity verified providers across Cameroon' },
  { Icon: Lock, text: 'End-to-end encrypted password security' },
  { Icon: CheckCircle, text: 'Real-time 6-digit email verification code' },
];

const STATS = [
  { Icon: Users, num: '840+', label: 'Verified providers' },
  { Icon: Star, num: '4.9', label: 'Average rating' },
  { Icon: TrendingUp, num: '2,500+', label: 'Families served' },
];

export default function ForgotPassword({ onNavigate }) {
  // Steps: 'email' | 'otp' | 'reset' | 'success'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [activeCode, setActiveCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [autoRedirectTimer, setAutoRedirectTimer] = useState(5);

  const digitInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Inspect URL query parameters on mount for direct link from email (?token=...&email=...)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlToken = searchParams.get('token') || searchParams.get('code');
      const urlEmail = searchParams.get('email');

      if (urlEmail) {
        setEmail(decodeURIComponent(urlEmail));
      }

      if (urlToken) {
        setActiveCode(urlToken);
        setStep('reset');
        setStatusMessage('Recovery token detected. Please enter your new password below.');
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Resend countdown timer for step 2
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (step === 'otp' && resendTimer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Success auto-redirect timer
  useEffect(() => {
    let interval = null;
    if (step === 'success') {
      interval = setInterval(() => {
        setAutoRedirectTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onNavigate('login');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, onNavigate]);

  // ── Step 1: Request Password Reset via Real Backend API ──
  const handleRequestReset = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setGeneralError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      const result = await requestPasswordReset(cleanEmail);
      setLoading(false);
      setStep('otp');
      setResendTimer(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setStatusMessage(result.message || 'Verification code sent to your email.');

      setTimeout(() => {
        digitInputRefs[0]?.current?.focus();
      }, 150);
    } catch (err) {
      setLoading(false);
      setGeneralError(err.message || 'Failed to send recovery email. Please check your connection and try again.');
    }
  };

  // Handle digit input change & paste
  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal && value !== '') return;

    const newDigits = [...otpDigits];

    // Handle multi-digit paste (e.g., pasting 6-digit code)
    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6).split('');
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      setOtpError('');
      const nextFocus = Math.min(pasted.length, 5);
      digitInputRefs[nextFocus]?.current?.focus();

      // If full 6 digits pasted, verify automatically
      if (pasted.length === 6) {
        verifyCodeDirect(newDigits.join(''));
      }
      return;
    }

    newDigits[index] = cleanVal.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    // Advance to next box if filled
    if (cleanVal && index < 5) {
      digitInputRefs[index + 1]?.current?.focus();
    }
  };

  // Handle Backspace navigation across digit boxes
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        digitInputRefs[index - 1]?.current?.focus();
      }
    }
  };

  // Helper to verify code with API
  const verifyCodeDirect = async (codeToVerify) => {
    setLoading(true);
    setOtpError('');
    try {
      const res = await verifyRecoveryCode(codeToVerify);
      setLoading(false);
      if (res.valid) {
        setActiveCode(codeToVerify);
        setStep('reset');
        setPasswordError('');
      } else {
        setOtpError(res.message || 'Invalid or expired 6-digit code. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setOtpError(err.message || 'Invalid or expired 6-digit code. Please check your email.');
    }
  };

  // ── Step 2: Verify 6-Digit Code via Real Backend API ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits sent to your email.');
      return;
    }
    await verifyCodeDirect(enteredCode);
  };

  // Handle Resend Code
  const handleResendCode = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    setOtpError('');
    try {
      const res = await requestPasswordReset(email);
      setLoading(false);
      setResendTimer(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setStatusMessage('A fresh 6-digit recovery code has been sent to your email.');
      digitInputRefs[0]?.current?.focus();
    } catch (err) {
      setLoading(false);
      setOtpError(err.message || 'Failed to resend code. Please try again in a moment.');
    }
  };

  // ── Step 3: Save New Password via Real Backend API ──
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!password) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }
    if (!activeCode) {
      setPasswordError('Recovery session expired or missing code. Please restart the recovery flow.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithToken(activeCode, password);
      setLoading(false);
      setStep('success');
    } catch (err) {
      setLoading(false);
      setPasswordError(err.message || 'Failed to update password. Your recovery session may have expired.');
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col lg:flex-row bg-white overflow-y-auto lg:overflow-hidden text-[#1C1A17]">
      {/* Left Panel - Desktop Brand & Trust Visuals */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] bg-[#1E4030] flex-col justify-between p-8 xl:p-10 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 right-12 w-36 h-36 bg-[#E29578]/10 rounded-full -translate-y-1/2 pointer-events-none" />

        {/* Authentic Carely Logo & Header */}
        <div
          className="flex items-center gap-3 cursor-pointer relative z-10"
          onClick={() => onNavigate('landing')}
        >
          <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center border border-white/20 shadow-sm shrink-0">
            <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-white leading-none">Carely</p>
            <p className="text-[10px] text-white/50 mt-0.5">Trusted care &bull; Cameroon</p>
          </div>
        </div>

        {/* Main Brand Content */}
        <div className="relative z-10 space-y-6 xl:space-y-8 my-auto py-2">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/15">
              <KeyRound size={12} className="text-[#E29578]" />
              <span>Account Security & Recovery</span>
            </div>
            <h1 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight">
              Reset your password<br />
              <span className="text-[#E29578]">securely</span>
            </h1>
            <p className="text-white/65 text-xs xl:text-sm leading-relaxed max-w-sm">
              Protecting your account and sensitive family care bookings is our highest priority.
            </p>
          </div>

          <ul className="space-y-2.5">
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                  <Icon size={14} className="text-white" />
                </div>
                <span className="text-xs xl:text-sm text-white/85 font-medium">{text}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {STATS.map(({ Icon, num, label }) => (
              <div key={label} className="bg-white/8 border border-white/10 rounded-xl p-3 text-center">
                <div className="font-display text-lg xl:text-xl font-bold text-white flex items-center justify-center gap-1">
                  <span>{num}</span>
                  {label.includes('rating') && (
                    <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-white/55 mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="relative z-10 bg-white/8 border border-white/10 rounded-xl p-3.5 xl:p-4">
          <p className="text-white/80 text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldCheck size={15} className="text-[#E29578] shrink-0 mt-0.5" />
            <span>
              Never share your 6-digit verification code with anyone. Carely support will never ask for your password or recovery OTP.
            </span>
          </p>
        </div>
      </div>

      {/* Right Panel - Interactive Forgot Password Forms */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-[#E2D9CF] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 bg-white rounded-xl p-0.5 flex items-center justify-center border border-[#E2D9CF] shrink-0">
              <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
            </div>
            <p className="font-display font-bold text-sm text-[#1E4030]">Carely</p>
          </div>
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1.5 text-xs text-[#1E4030] font-semibold hover:underline cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back to Sign In</span>
          </button>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-8 lg:py-6">
          <div className="w-full max-w-[420px] space-y-6">

            {/* ─── STEP 1: EMAIL ENTRY ─── */}
            {step === 'email' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="w-10 h-10 bg-[#EDF7F2] text-[#1E4030] rounded-xl flex items-center justify-center border border-green-200 shadow-xs mb-1">
                    <Mail size={19} />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1A17] tracking-tight">
                    Forgot Password?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8A7E74] leading-relaxed">
                    Enter your Carely account email address. We will send you a secure 6-digit recovery code and link to reset your password.
                  </p>
                </div>

                {generalError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-red-700">
                    <AlertCircle size={16} className="shrink-0 text-red-600" />
                    <span>{generalError}</span>
                  </div>
                )}

                <form onSubmit={handleRequestReset} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-[#8A7E74] tracking-widest uppercase">
                      Email address <span className="text-[#E29578] normal-case tracking-normal font-medium">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setGeneralError('');
                        }}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3.5 border-2 border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-[#FAFAF9] focus:outline-none focus:border-[#1E4030] transition-colors placeholder:text-[#C5BCBA]"
                      />
                      <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-60 text-white text-sm font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Sending Recovery Email...</span>
                      </>
                    ) : (
                      <span>Send Recovery Code &rarr;</span>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <span className="text-xs text-[#8A7E74]">Remember your password? </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-xs font-bold text-[#1E4030] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            {/* ─── STEP 2: 6-DIGIT OTP VERIFICATION ─── */}
            {step === 'otp' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="w-10 h-10 bg-[#EDF7F2] text-[#1E4030] rounded-xl flex items-center justify-center border border-green-200 shadow-xs mb-1">
                    <KeyRound size={19} />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1A17] tracking-tight">
                    Enter 6-Digit Code
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8A7E74] leading-relaxed">
                    We sent a 6-digit recovery code to <strong className="text-[#1C1A17]">{email}</strong>. Please check your inbox or spam folder.
                  </p>
                </div>

                {statusMessage && (
                  <div className="bg-[#EDF7F2] border border-green-200 rounded-xl p-3 flex items-center gap-2 text-xs text-[#1E4030]">
                    <CheckCircle size={14} className="shrink-0 text-[#1E4030]" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-[#8A7E74] tracking-widest uppercase text-center">
                      6-Digit Recovery Code
                    </label>

                    {/* 6 Digit Input Boxes */}
                    <div className="flex justify-center gap-2 sm:gap-2.5 pt-0.5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={digitInputRefs[idx]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-extrabold rounded-xl border-2 transition-all outline-none ${
                            otpError
                              ? 'border-red-400 bg-red-50/40 text-red-700 focus:border-red-500'
                              : digit
                              ? 'border-[#1E4030] bg-[#EDF7F2]/40 text-[#1E4030]'
                              : 'border-[#E2D9CF] bg-[#FAFAF9] text-[#1C1A17] focus:border-[#1E4030] focus:bg-white'
                          }`}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-xs text-red-600 font-medium flex items-center justify-center gap-1.5 pt-1 text-center">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{otpError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length < 6}
                    className="w-full bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-60 text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-1"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <span>Verify Code & Continue</span>
                    )}
                  </button>
                </form>

                {/* Resend Code / Change Email Options */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 border-t border-[#EFECE6] pt-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtpError('');
                      setStatusMessage('');
                    }}
                    className="text-[#8A7E74] hover:text-[#1C1A17] font-semibold transition-colors cursor-pointer"
                  >
                    Change Email
                  </button>

                  <div>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={loading}
                        className="text-[#1E4030] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw size={12} />
                        <span>Resend 6-digit code</span>
                      </button>
                    ) : (
                      <span className="text-[#8A7E74]">
                        Resend code in <strong className="text-[#1E4030] font-mono">{resendTimer}s</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ─── STEP 3: NEW PASSWORD & CONFIRM PASSWORD ─── */}
            {step === 'reset' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <div className="w-10 h-10 bg-[#EDF7F2] text-[#1E4030] rounded-xl flex items-center justify-center border border-green-200 shadow-xs mb-1">
                    <Lock size={19} />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1A17] tracking-tight">
                    Create New Password
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8A7E74] leading-relaxed">
                    Choose a strong new password for your account.
                  </p>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-700">
                    <AlertCircle size={14} className="shrink-0 text-red-600" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleSavePassword} className="space-y-3.5">
                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#8A7E74] tracking-widest uppercase">
                      New Password <span className="text-[#E29578] normal-case tracking-normal font-medium">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-3 border-2 border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-[#FAFAF9] focus:outline-none focus:border-[#1E4030] transition-colors placeholder:text-[#C5BCBA] pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74] hover:text-[#1C1A17] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[#8A7E74] tracking-widest uppercase">
                      Confirm New Password <span className="text-[#E29578] normal-case tracking-normal font-medium">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Re-enter your new password"
                        className="w-full px-4 py-3 border-2 border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-[#FAFAF9] focus:outline-none focus:border-[#1E4030] transition-colors placeholder:text-[#C5BCBA] pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74] hover:text-[#1C1A17] transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Match / Strength Indicator */}
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-[#D9D2C8]'}`} />
                      <span className={password.length >= 6 ? 'text-green-700 font-medium' : 'text-[#8A7E74]'}>
                        At least 6 characters
                      </span>
                    </div>
                    {confirmPassword && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${password === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={password === confirmPassword ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                          {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-60 text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Saving New Password...</span>
                      </>
                    ) : (
                      <span>Save & Update Password</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ─── STEP 4: SUCCESS CONFIRMATION ─── */}
            {step === 'success' && (
              <div className="text-center space-y-6 py-4">
                <div className="w-18 h-18 bg-[#EDF7F2] text-[#1D6F42] rounded-3xl flex items-center justify-center mx-auto border-2 border-green-200 shadow-sm">
                  <CheckCircle2 size={38} className="text-[#1D6F42]" />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-3xl font-extrabold text-[#1E4030]">
                    Password Reset!
                  </h2>
                  <p className="text-sm text-[#8A7E74] leading-relaxed max-w-xs mx-auto">
                    Your password has been updated securely. You can now log in with your new credentials.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 text-xs text-[#8A7E74]">
                  Redirecting to Sign In in <strong className="text-[#1E4030] font-mono text-sm">{autoRedirectTimer}s</strong>...
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white text-sm font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Sign In to Carely</span>
                </button>
              </div>
            )}

            {/* Footer trust badge (Mobile) */}
            <div className="lg:hidden flex items-center justify-center gap-4 pt-4 text-[#8A7E74]">
              <div className="flex items-center gap-1.5 text-xs">
                <ShieldCheck size={13} className="text-[#1E4030]" />
                <span>Verified</span>
              </div>
              <div className="w-px h-3 bg-[#E2D9CF]" />
              <div className="flex items-center gap-1.5 text-xs">
                <Lock size={13} className="text-[#1E4030]" />
                <span>Secure account</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
