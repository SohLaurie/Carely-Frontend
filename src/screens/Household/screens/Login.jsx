import React, { useState } from 'react'
import { Eye, EyeOff, ShieldCheck, Heart } from 'lucide-react'

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return

    // Simple simulation of role routing
    if (email.toLowerCase().includes('admin')) {
      onNavigate('admin')
    } else if (email.toLowerCase().includes('provider') || email.toLowerCase().includes('caregiver')) {
      onNavigate('caregiver')
    } else {
      onNavigate('search')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Top Header */}
      <header className="bg-[#FAF8F5] border-b border-[#E2D9CF] px-6 lg:px-12 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-9 h-9 bg-[#1E4030] rounded-xl flex items-center justify-center shadow-sm">
            <Heart size={17} className="fill-white text-[#1E4030]" />
          </div>
          <div className="leading-tight">
            <p className="font-display font-bold text-sm text-[#1E4030]">Carely</p>
            <p className="text-[10px] text-[#8A7E74]">Trusted care</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
          <ShieldCheck size={14} className="text-[#1E4030]" />
          <span>Verified network</span>
        </div>
      </header>

      {/* Login Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-[460px] space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="font-display text-3xl font-extrabold text-[#1C1A17] tracking-tight">
              Welcome back to Carely
            </h1>
            <p className="text-xs text-[#8A7E74]">
              Sign in to manage your bookings, services and account.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E2D9CF] rounded-3xl p-8 shadow-xs space-y-5"
          >
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1A17]">
                Email address <span className="text-[#E29578] ml-0.5">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all placeholder:text-[#BDBDBD]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1C1A17]">
                Password <span className="text-[#E29578] ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all placeholder:text-[#BDBDBD] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74] hover:text-[#1C1A17] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#E2D9CF] text-[#1E4030] focus:ring-[#1E4030] h-4 w-4 cursor-pointer accent-[#1E4030]"
                />
                <span className="text-[#8A7E74] font-medium">Remember me</span>
              </label>
              <a
                href="#forgot"
                className="font-semibold text-[#1C1A17] hover:underline cursor-pointer"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white text-sm font-bold py-3.5 px-6 rounded-2xl transition-all shadow-sm cursor-pointer mt-4 flex items-center justify-center"
            >
              Sign In
            </button>
          </form>

          {/* Bottom Link */}
          <div className="text-center text-xs text-[#8A7E74]">
            <span>Don't have a Carely account? </span>
            <a
              href="#register"
              onClick={(e) => {
                e.preventDefault()
                onNavigate('pack')
              }}
              className="font-bold text-[#1C1A17] hover:underline cursor-pointer"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
