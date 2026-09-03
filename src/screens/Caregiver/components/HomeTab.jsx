import React, { useState } from 'react';
import {
  Clock, MapPin, Wallet, ArrowRight, ShieldCheck,
  TrendingUp, Award, PlayCircle, CheckCircle, AlertCircle
} from 'lucide-react';

export default function HomeTab({ onNavigateTab }) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);

  const handleCheckInToggle = () => {
    if (isCheckedIn) {
      // Check out
      setIsCheckedIn(false);
      setOtpSuccess(false);
      setOtpVal('');
    } else {
      // Trigger check-in
      setIsCheckedIn(true);
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otpVal === '8821') {
      setOtpSuccess(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please ask the client for the correct code.');
      setOtpSuccess(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F1A14] to-[#1E4030] text-white rounded-3xl p-6 shadow-md border border-white/10 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-xl" />
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="bg-white/10 text-white/90 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
              Active Status
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight font-display">
              Good day, Marie-Claire!
            </h2>
            <p className="text-white/70 text-xs md:text-sm font-medium">
              You have 2 scheduled sessions in Yaounde today. Keep up the amazing work!
            </p>
          </div>

          {/* Quick Check-in simulation widget */}
          <div className="pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 max-w-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Active Session Tracker
              </h3>
              
              {!isCheckedIn ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white">Paul M. (Home Nursing)</p>
                    <p className="text-[10px] text-white/60">Bastos, Yaounde · Scheduled 15:00</p>
                  </div>
                  <button
                    onClick={handleCheckInToggle}
                    className="bg-[#1D6F42] hover:bg-[#155231] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <PlayCircle size={14} />
                    Start Check-in
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-white">Check-in at Paul M.</p>
                      <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        GPS Lock Confirmed (Within 10m)
                      </p>
                    </div>
                    <button
                      onClick={handleCheckInToggle}
                      className="text-white/60 hover:text-white text-[10px] font-semibold underline"
                    >
                      Cancel
                    </button>
                  </div>

                  {!otpSuccess ? (
                    <form onSubmit={handleOtpVerify} className="space-y-2">
                      <p className="text-[10px] text-white/70">
                        Enter the client's 4-digit arrival OTP to unlock and start the timer:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpVal}
                          onChange={e => setOtpVal(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="e.g. 8821"
                          className="bg-white/10 border border-white/20 text-white rounded-xl px-3 py-1.5 text-xs font-semibold placeholder:text-white/40 focus:outline-none focus:border-white/40 flex-1 max-w-[120px]"
                        />
                        <button
                          type="submit"
                          className="bg-[#F3A83B] hover:bg-[#d9922c] text-[#1C1A17] text-xs font-bold px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          Verify OTP
                        </button>
                      </div>
                      {otpError && (
                        <p className="text-[10px] text-red-300 font-medium flex items-center gap-1">
                          <AlertCircle size={10} />
                          {otpError}
                        </p>
                      )}
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                          <CheckCircle size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Active Session Unlocked</p>
                          <p className="text-[9px] text-emerald-400 font-semibold">Timer: 02h 45m remaining</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCheckInToggle}
                        className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Complete Session
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E74]">Wallet Balance</span>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-xl font-black text-[#1C1A17] font-display">84,500 XAF</h4>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp size={10} /> +12.4% this week
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E74]">Completed Tasks</span>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-xl font-black text-[#1C1A17] font-display">48 sessions</h4>
            <p className="text-[10px] text-[#8A7E74] font-medium">98.5% completion rate</p>
          </div>
        </div>

        <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E74]">Reviews Rating</span>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-xl font-black text-[#1C1A17] font-display">⭐ 4.93 / 5</h4>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ShieldCheck size={10} /> Verified care provider
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7E74]">Active Hours</span>
          <div className="mt-2 space-y-0.5">
            <h4 className="text-xl font-black text-[#1C1A17] font-display">32.5 hrs</h4>
            <p className="text-[10px] text-[#8A7E74] font-medium">This month schedule</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile Money Wallet details */}
        <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm md:text-base text-[#1C1A17]">Mobile Wallets</h3>
            <Wallet size={16} className="text-[#8A7E74]" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-[#F7F5F2] rounded-2xl border border-[#E2D9CF]/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-400 text-yellow-950 font-black text-xs flex items-center justify-center">
                  MTN
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1A17]">MTN Mobile Money</p>
                  <p className="text-[10px] text-[#8A7E74] font-medium">Account: xxxx 8821</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">Primary</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#F7F5F2] rounded-2xl border border-[#E2D9CF]/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                  OM
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1A17]">Orange Money</p>
                  <p className="text-[10px] text-[#8A7E74] font-medium">Account: xxxx 4432</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-[#8A7E74] hover:text-[#1C1A17] underline">
                Make Primary
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips or shortcut links */}
        <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm md:text-base text-[#1C1A17]">Quick Links</h3>
              <Award size={16} className="text-[#8A7E74]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigateTab('explore')}
                className="p-4 bg-emerald-550/5 hover:bg-emerald-550/10 border border-emerald-500/10 rounded-2xl text-left cursor-pointer transition-all space-y-1.5"
              >
                <span className="text-xs font-bold text-[#1E4030]">Explore Hub</span>
                <p className="text-[9px] text-[#8A7E74] leading-normal">Browse job opportunities & pro training modules.</p>
              </button>

              <button
                onClick={() => onNavigateTab('discussion')}
                className="p-4 bg-emerald-550/5 hover:bg-emerald-550/10 border border-emerald-500/10 rounded-2xl text-left cursor-pointer transition-all space-y-1.5"
              >
                <span className="text-xs font-bold text-[#1E4030]">Discussions</span>
                <p className="text-[9px] text-[#8A7E74] leading-normal">Chat with active clients or support concierge.</p>
              </button>

              <button
                onClick={() => onNavigateTab('requests')}
                className="p-4 bg-emerald-550/5 hover:bg-emerald-550/10 border border-emerald-500/10 rounded-2xl text-left cursor-pointer transition-all space-y-1.5"
              >
                <span className="text-xs font-bold text-[#1E4030]">Pending Requests</span>
                <p className="text-[9px] text-[#8A7E74] leading-normal">Review and accept client booking requests.</p>
              </button>

              <button
                onClick={() => onNavigateTab('calendar')}
                className="p-4 bg-emerald-550/5 hover:bg-emerald-550/10 border border-emerald-500/10 rounded-2xl text-left cursor-pointer transition-all space-y-1.5"
              >
                <span className="text-xs font-bold text-[#1E4030]">Your Calendar</span>
                <p className="text-[9px] text-[#8A7E74] leading-normal">Configure availability slots and check tasks.</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
