import React, { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, Heart, Users, Star, TrendingUp, Lock, CheckCircle } from 'lucide-react'

const FEATURES = [
  { Icon: ShieldCheck, text: 'Every provider is identity verified' },
  { Icon: Lock,        text: 'Secure escrow payment system' },
  { Icon: CheckCircle, text: 'Dispute protection guarantee' },
]

const STATS = [
  { Icon: Users,      num: '847+',   label: 'Verified providers' },
  { Icon: Star,       num: '4.8★',   label: 'Average rating' },
  { Icon: TrendingUp, num: '2,400+', label: 'Families served' },
]

export default function Login({ onNavigate }) {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(true)
  const [loading, setLoading]           = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (email.toLowerCase().includes('admin')) {
        onNavigate('admin')
      } else if (email.toLowerCase().includes('provider') || email.toLowerCase().includes('caregiver')) {
        onNavigate('caregiver')
      } else {
        onNavigate('search')
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - desktop */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] bg-[#1E4030] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 right-16 w-40 h-40 bg-[#E29578]/10 rounded-full -translate-y-1/2" />

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer relative z-10" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
            <Heart size={20} className="fill-white text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-lg text-white leading-none">Carely</p>
            <p className="text-[11px] text-white/50 mt-0.5">Trusted care</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight">
              Your trusted care<br />
              <span className="text-[#E29578]">platform</span>
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-md">
              Connecting Cameroonian families with verified providers — nurses, babysitters, and domestic workers.
            </p>
          </div>
          <ul className="space-y-4">
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0 border border-white/10">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-sm text-white/80 font-medium">{text}</span>
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(({ Icon, num, label }) => (
              <div key={label} className="bg-white/8 border border-white/10 rounded-2xl p-4 text-center">
                <div className="font-display text-xl font-bold text-white">{num}</div>
                <div className="text-[10px] text-white/55 mt-1 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10 bg-white/8 border border-white/10 rounded-2xl p-5">
          <p className="text-white/75 text-sm italic leading-relaxed">
            &ldquo;Since I started using Carely, I leave for the office without worry. My mother is in the best hands.&rdquo;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-xs font-bold text-white border border-white/10">C</div>
            <div>
              <p className="text-xs font-semibold text-white">Carine Ngo</p>
              <p className="text-[10px] text-white/45">Yaounde</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - form */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-[#E2D9CF] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 bg-[#1E4030] rounded-xl flex items-center justify-center">
              <Heart size={15} className="fill-white text-white" />
            </div>
            <p className="font-display font-bold text-sm text-[#1E4030]">Carely</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
            <ShieldCheck size={13} className="text-[#1E4030]" />
            <span>Verified network</span>
          </div>
        </header>

        {/* Form area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-[400px] space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-extrabold text-[#1C1A17] tracking-tight">Welcome back</h2>
              <p className="text-sm text-[#8A7E74]">Sign in to manage your bookings and account.</p>
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
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-[#1E4030] hover:underline cursor-pointer">Forgot password?</a>
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
    </div>
  )
}
