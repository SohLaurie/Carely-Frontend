import React, { useState, useEffect, useRef } from 'react'
import { Eye, EyeOff, ShieldCheck, Heart, Users, Star, TrendingUp, Lock, CheckCircle, AlertCircle, ShieldAlert, X, RefreshCw } from 'lucide-react'
import { loginUser, verifyTwoFactorCode, resendTwoFactorCode } from '../../../services/auth.service.js'

const FEATURES = [
  { Icon: ShieldCheck, text: 'Every provider is identity verified' },
  { Icon: Lock,        text: 'Secure escrow payment system' },
  { Icon: CheckCircle, text: 'Dispute protection guarantee' },
]

const STATS = [
  { Icon: Users,      num: '847+',   label: 'Verified providers' },
  { Icon: Star,       num: '4.8',    label: 'Average rating' },
  { Icon: TrendingUp, num: '2,400+', label: 'Families served' },
]

function TwoFactorModal({ isOpen, onClose, tempToken, maskedEmail, onSuccess }) {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef([])

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', ''])
      setError('')
      setSuccessMsg('')
      setCountdown(60)
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus()
      }, 150)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || countdown <= 0) return
    const timer = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [isOpen, countdown])

  if (!isOpen) return null

  const handleDigitChange = (index, value) => {
    setError('')
    const numeric = value.replace(/\D/g, '')
    if (numeric.length > 1) {
      const newDigits = [...digits]
      const chars = numeric.slice(0, 6).split('')
      chars.forEach((ch, i) => {
        newDigits[i] = ch
      })
      setDigits(newDigits)
      const nextFocus = Math.min(chars.length, 5)
      if (inputRefs.current[nextFocus]) inputRefs.current[nextFocus].focus()
      return
    }

    const newDigits = [...digits]
    newDigits[index] = numeric.slice(-1)
    setDigits(newDigits)

    if (numeric && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    const newDigits = [...digits]
    text.split('').forEach((ch, i) => {
      newDigits[i] = ch
    })
    setDigits(newDigits)
    const nextFocus = Math.min(text.length, 5)
    if (inputRefs.current[nextFocus]) inputRefs.current[nextFocus].focus()
  }

  const handleVerify = async (e) => {
    if (e) e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) {
      setError('Please enter the full 6-digit verification code.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await verifyTwoFactorCode(tempToken, code)
      onSuccess(result)
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || resending) return
    setResending(true)
    setError('')
    setSuccessMsg('')
    try {
      await resendTwoFactorCode(tempToken)
      setSuccessMsg('A new 6-digit verification code has been dispatched to your email.')
      setCountdown(60)
      setDigits(['', '', '', '', '', ''])
      if (inputRefs.current[0]) inputRefs.current[0].focus()
    } catch (err) {
      setError(err.message || 'Failed to resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E2D9CF] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1E4030] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-xl p-1 flex items-center justify-center border border-white/20">
              <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-white font-display font-bold text-sm leading-none">Two-Factor Authentication</h3>
              <p className="text-[10px] text-white/70 mt-0.5">Security Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-white/70 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-[#EDF7F2] border border-[#CDE7DB] rounded-2xl flex items-center justify-center text-[#1E4030]">
            <ShieldCheck size={28} />
          </div>

          <h4 className="font-display font-bold text-xl text-[#1C1A17] mb-1.5">
            Enter Verification Code
          </h4>
          <p className="text-xs text-[#8A7E74] leading-relaxed mb-2">
            A 6-digit security code was dispatched to your email address:
          </p>
          <div className="inline-block px-3.5 py-1 bg-[#FAF8F5] border border-[#E2D9CF] rounded-full text-xs font-bold text-[#1E4030] mb-6">
            {maskedEmail || 'your email'}
          </div>

          {/* 6 Digit Inputs */}
          <form onSubmit={handleVerify}>
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-6" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold rounded-xl border-2 border-[#E2D9CF] bg-[#FAF8F5] text-[#1C1A17] focus:outline-none focus:border-[#1E4030] focus:bg-white transition-all shadow-xs"
                />
              ))}
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 flex items-center justify-center gap-1.5 text-left">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Alert */}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-medium text-green-800 flex items-center justify-center gap-1.5 text-left">
                <CheckCircle size={15} className="shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || digits.join('').length < 6}
              className="w-full bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-60 text-white text-sm font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>
          </form>

          {/* Resend & Countdown */}
          <div className="mt-5 pt-4 border-t border-[#EAE4DC] flex items-center justify-between text-xs text-[#8A7E74]">
            <span>Didn&apos;t receive the code?</span>
            {countdown > 0 ? (
              <span className="font-semibold text-[#8A7E74]">
                Resend in <strong className="text-[#1E4030]">{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-bold text-[#1E4030] hover:text-[#152e22] hover:underline cursor-pointer flex items-center gap-1"
              >
                {resending ? <RefreshCw size={12} className="animate-spin" /> : null}
                <span>Resend Code</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Login({ onNavigate }) {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(true)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [twoFactorData, setTwoFactorData] = useState(null)
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false)

  const handleNavigateByRole = (role) => {
    if (role === 'admin') {
      onNavigate('admin')
    } else if (role === 'provider') {
      onNavigate('caregiver')
    } else {
      onNavigate('search')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      const result = await loginUser(email, password)

      // Intercept 2FA requirement
      if (result.require2FA) {
        setTwoFactorData({
          tempToken: result.tempToken,
          maskedEmail: result.maskedEmail,
          email: result.email,
        })
        setShowTwoFactorModal(true)
        return
      }

      handleNavigateByRole(result.user?.role)
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorSuccess = (verifiedResult) => {
    setShowTwoFactorModal(false)
    handleNavigateByRole(verifiedResult.user?.role)
  }


  return (
    <div className="h-screen max-h-screen flex flex-col lg:flex-row bg-white overflow-y-auto lg:overflow-hidden">
      {/* Left Panel - desktop */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] bg-[#1E4030] flex-col justify-between p-8 xl:p-10 relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        <div className="absolute top-1/2 right-12 w-36 h-36 bg-[#E29578]/10 rounded-full -translate-y-1/2 pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer relative z-10" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center border border-white/20 shadow-sm shrink-0">
            <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-white leading-none">Carely</p>
            <p className="text-[10px] text-white/50 mt-0.5">Trusted care</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-6 xl:space-y-8 my-auto py-2">
          <div className="space-y-2.5">
            <h1 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight">
              Your trusted care<br />
              <span className="text-[#E29578]">platform</span>
            </h1>
            <p className="text-white/65 text-xs xl:text-sm leading-relaxed max-w-sm">
              Connecting Cameroonian families with verified providers — nurses, babysitters, and domestic workers.
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

        {/* Quote */}
        <div className="relative z-10 bg-white/8 border border-white/10 rounded-xl p-3.5 xl:p-4">
          <p className="text-white/75 text-xs italic leading-relaxed">
            &ldquo;Since I started using Carely, I leave for the office without worry. My mother is in the best hands.&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">C</div>
            <div>
              <p className="text-[11px] font-semibold text-white leading-tight">Carine Ngo</p>
              <p className="text-[9px] text-white/45">Yaounde</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - form */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-[#E2D9CF] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 bg-white rounded-xl p-0.5 flex items-center justify-center border border-[#E2D9CF] shrink-0">
              <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
            </div>
            <p className="font-display font-bold text-sm text-[#1E4030]">Carely</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
            <ShieldCheck size={13} className="text-[#1E4030]" />
            <span>Verified network</span>
          </div>
        </header>

        {/* Form area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-8 lg:py-6">
          <div className="w-full max-w-[390px] space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1C1A17] tracking-tight">Welcome back</h2>
              <p className="text-xs sm:text-sm text-[#8A7E74]">Sign in to manage your bookings and account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#8A7E74] tracking-widest uppercase">
                  Email address <span className="text-[#E29578] normal-case tracking-normal font-medium">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 border-2 border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-[#FAFAF9] focus:outline-none focus:border-[#1E4030] transition-colors placeholder:text-[#C5BCBA]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#8A7E74] tracking-widest uppercase">
                  Password <span className="text-[#E29578] normal-case tracking-normal font-medium">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 border-2 border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-[#FAFAF9] focus:outline-none focus:border-[#1E4030] transition-colors placeholder:text-[#C5BCBA] pr-11"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A7E74] hover:text-[#1C1A17] transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-[#E2D9CF] accent-[#1E4030] cursor-pointer" />
                  <span className="text-xs text-[#8A7E74] font-medium">Remember me</span>
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('forgot-password');
                  }}
                  className="text-xs font-semibold text-[#1E4030] hover:underline cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-70 text-white text-sm font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            {/* API Error Message */}
            {error && (
              <div className={`border rounded-xl px-4 py-3 text-xs font-medium flex items-start gap-2.5 text-left ${
                error.toLowerCase().includes('locked') 
                  ? 'bg-rose-50 border-rose-200 text-rose-800' 
                  : error.toLowerCase().includes('remaining')
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {error.toLowerCase().includes('locked') ? (
                  <ShieldAlert size={17} className="text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={17} className={error.toLowerCase().includes('remaining') ? 'text-amber-600 shrink-0 mt-0.5' : 'text-red-500 shrink-0 mt-0.5'} />
                )}
                <div>
                  <div className="font-bold">
                    {error.toLowerCase().includes('locked') ? 'Account Locked' : (error.toLowerCase().includes('remaining') ? 'Login Warning' : 'Authentication Error')}
                  </div>
                  <div className="mt-0.5 leading-relaxed">{error}</div>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2D9CF]"></div></div>
              <div className="relative flex justify-center"><span className="px-3 bg-white text-xs text-[#8A7E74]">or</span></div>
            </div>

            <div className="text-center">
              <span className="text-sm text-[#8A7E74]">Don&apos;t have a Carely account? </span>
              <a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('pack') }} className="text-sm font-bold text-[#1E4030] hover:underline cursor-pointer">
                Create an account
              </a>
            </div>

            <div className="lg:hidden flex items-center justify-center gap-4 pt-2 text-[#8A7E74]">
              <div className="flex items-center gap-1.5 text-xs"><ShieldCheck size={13} className="text-[#1E4030]" /><span>Verified</span></div>
              <div className="w-px h-3 bg-[#E2D9CF]"></div>
              <div className="flex items-center gap-1.5 text-xs"><Lock size={13} className="text-[#1E4030]" /><span>Secure payment</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication (2FA) Verification Modal */}
      <TwoFactorModal
        isOpen={showTwoFactorModal}
        onClose={() => setShowTwoFactorModal(false)}
        tempToken={twoFactorData?.tempToken}
        maskedEmail={twoFactorData?.maskedEmail}
        onSuccess={handleTwoFactorSuccess}
      />
    </div>
  )
}

