import React, { useState } from 'react';
import { Globe, Shield, Mail, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsTab() {
  // General State
  const [siteName, setSiteName] = useState('Carely');
  const [adminEmail, setAdminEmail] = useState('admin@carely.com');
  const [timezone, setTimezone] = useState('UTC+1 (Yaounde / Douala)');

  // 2FA & SMTP State
  const [enable2FA, setEnable2FA] = useState(true);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [gmailAddress, setGmailAddress] = useState('carely.security@gmail.com');
  const [appPassword, setAppPassword] = useState('your-gmail-app-password');
  const [fromAddress, setFromAddress] = useState('Carely Security <security@carely.com>');

  // Lockout State
  const [logFailedAttempts, setLogFailedAttempts] = useState(true);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState('5');
  const [lockDuration, setLockDuration] = useState('15');

  // Success Notification state
  const [showToast, setShowToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E4030] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-white/10 animate-fadeIn">
          <CheckCircle2 size={16} className="text-green-400" />
          <span className="text-xs font-semibold">Settings saved successfully!</span>
        </div>
      )}

      {/* Header Title */}
      <div>
        <h2 className="text-[#1C1A17] font-display text-xl font-bold">Settings</h2>
        <p className="text-xs text-[#8A7E74]">Configure your admin dashboard preferences.</p>
      </div>

      {/* SECTION 1: GENERAL */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#1C1A17] flex items-center gap-2 uppercase tracking-wider">
          <Globe size={14} className="text-[#8A7E74]" />
          General
        </h3>

        <div className="space-y-4 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Site Name</label>
            <input
              type="text"
              required
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Admin Email</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Timezone</label>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
            >
              <option value="UTC+1 (Yaounde / Douala)">UTC+1 (Yaounde / Douala)</option>
              <option value="UTC+0 (London)">UTC+0 (London)</option>
              <option value="UTC-5 (New York)">UTC-5 (New York)</option>
              <option value="UTC+8 (Singapore)">UTC+8 (Singapore)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: SECURITY & TWO-FACTOR AUTHENTICATION */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#1C1A17] flex items-center gap-2 uppercase tracking-wider">
          <Shield size={14} className="text-[#8A7E74]" />
          Security & Two-Factor Authentication
        </h3>

        <div className="space-y-4 pt-1">
          {/* 2FA Toggle card block */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-[#1C1A17]">Enable 2FA for All Users</h4>
              <p className="text-[10px] text-[#8A7E74] leading-relaxed">
                Require two-factor authentication system-wide. Every user receives a one-time code via email before gaining access.
              </p>
            </div>
            
            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setEnable2FA(!enable2FA)}
              className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 ${
                enable2FA ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                enable2FA ? 'left-6' : 'left-1'
              }`}></span>
            </button>
          </div>

          {/* SMTP configurations */}
          <div className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-[#1C1A17] flex items-center gap-1.5">
                <Mail size={13} className="text-[#8A7E74]" />
                SMTP Configuration (Gmail)
              </h4>
              <p className="text-[10px] text-[#8A7E74]">
                Used to deliver OTP codes during 2FA login. Use a Gmail App Password — never your account password.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">SMTP Host</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={e => setSmtpHost(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">SMTP Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={e => setSmtpPort(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Gmail Address</label>
                <input
                  type="email"
                  value={gmailAddress}
                  onChange={e => setGmailAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">App Password</label>
                <input
                  type="password"
                  value={appPassword}
                  onChange={e => setAppPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">From Address</label>
              <input
                type="text"
                value={fromAddress}
                onChange={e => setFromAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: LOGIN ATTEMPTS & LOCKOUT */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#1C1A17] flex items-center gap-2 uppercase tracking-wider">
          <Lock size={14} className="text-[#8A7E74]" />
          Login Attempts & Account Lockout
        </h3>

        <div className="space-y-4 pt-1">
          {/* Log failed attempts Toggle */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-semibold text-xs text-[#1C1A17]">Log Failed Login Attempts</h4>
              <p className="text-[10px] text-[#8A7E74] leading-relaxed">
                Record IP address, timestamp and user agent for every failed login.
              </p>
            </div>
            
            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setLogFailedAttempts(!logFailedAttempts)}
              className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 ${
                logFailedAttempts ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
              }`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                logFailedAttempts ? 'left-6' : 'left-1'
              }`}></span>
            </button>
          </div>

          {/* Locked attempts input grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Max Failed Attempts Before Lock</label>
              <div className="relative">
                <input
                  type="text"
                  value={maxFailedAttempts}
                  onChange={e => setMaxFailedAttempts(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7E74] uppercase">attempts</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Lock Duration</label>
              <div className="relative">
                <input
                  type="text"
                  value={lockDuration}
                  onChange={e => setLockDuration(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7E74] uppercase">minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        type="submit"
        className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
      >
        Save Settings
      </button>
    </form>
  );
}
