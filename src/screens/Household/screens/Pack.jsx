import React from 'react'
import { Heart, ShieldCheck, Check, ArrowRight } from 'lucide-react'

export default function Pack({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Header */}
      <header className="bg-[#FAF8F5] border-b border-[#E2D9CF] px-6 lg:px-12 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center border border-[#E2D9CF] shadow-xs shrink-0">
            <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center space-y-3 mb-16">
          <h1 className="font-display text-4xl font-extrabold text-[#1E4030] tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-sm text-[#8A7E74] max-w-md mx-auto">
            Select the package that suits you best and start connecting with our trusted network today.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl items-stretch">
          
          {/* 1. Client Package (Basic/Free) */}
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-bold">Client Package</h3>
                </div>
                <span className="bg-[#E29578] text-[#1E4030] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs tracking-wider border border-white/10">
                  Basic
                </span>
              </div>

              {/* Price */}
              <div className="py-2">
                <span className="font-display text-4xl font-black text-[#1C1A17]">Free</span>
                <p className="text-xs text-[#8A7E74] mt-1.5">No setup fees, no monthly commitment</p>
              </div>

              <hr className="border-[#F0EBE4]" />

              {/* Features List */}
              <ul className="space-y-3.5">
                {[
                  'Browse and search verified caregiver profiles',
                  'Describe care needs to Carely AI matching assistant',
                  'Send direct booking requests to caregivers',
                  'Secure escrow payments protection',
                  'Full access to notifications and messages center',
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-[#1C1A17] font-medium leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#EDF7F2] flex items-center justify-center shrink-0 border border-green-100/50 mt-0.5">
                      <Check size={11} strokeWidth={3} className="text-[#1E4030]" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                onClick={() => onNavigate('register')}
                className="w-full bg-[#FAF8F5] border border-[#1E4030] text-[#1E4030] hover:bg-[#1E4030]/5 text-sm font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-xs"
              >
                Join as Client
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* 2. Provider Package (Pro / Paid) */}
          <div className="bg-[#1E4030] text-white rounded-3xl p-8 flex flex-col justify-between relative shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-transparent overflow-hidden">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              {/* Popular Badge */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-bold">Provider Package</h3>
                </div>
                <span className="bg-[#E29578] text-[#1E4030] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs tracking-wider border border-white/10">
                  Pro
                </span>
              </div>

              {/* Price */}
              <div className="py-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black text-white">2,000 XAF</span>
                  <span className="text-xs text-white/70">/ month</span>
                </div>
                <p className="text-xs text-white/70 mt-1.5">14-day free trial included (cancel anytime)</p>
              </div>

              <hr className="border-white/10" />

              {/* Features List */}
              <ul className="space-y-3.5">
                {[
                  'Showcase your professional profile on our directory',
                  'Directly receive and manage client booking requests',
                  'Verified verification background check badge',
                  'Access to premium dashboard income & shift features',
                  'Accept shifts and generate attendance secure OTPs',
                  'Keep 100% of your listed earnings — no commissions',
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-white/90 leading-relaxed font-medium">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 mt-0.5">
                      <Check size={11} strokeWidth={3} className="text-white" />
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <div className="pt-8 relative z-10">
              <button
                onClick={() => onNavigate('registerpro')}
                className="w-full bg-[#FAF8F5] text-[#1E4030] hover:bg-white text-sm font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-md"
              >
                Join as Provider
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform text-[#1E4030]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
