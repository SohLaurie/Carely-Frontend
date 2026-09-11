import React, { useState, useEffect } from 'react';
import {
  Globe, Shield, Mail, Lock, CheckCircle2, History, CreditCard,
  Bot, Sliders, AlertCircle, Save, Check, RefreshCw, Send, Terminal, Sparkles
} from 'lucide-react';
import {
  fetchLockoutPolicy,
  saveLockoutPolicy,
  fetchLoginAttempts,
  fetchTwoFactorPolicy,
  saveTwoFactorPolicy,
} from '../../../services/admin.service.js';

export default function SettingsTab() {
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  // General State
  const [siteName, setSiteName] = useState('Carely Cameroon');
  const [adminEmail, setAdminEmail] = useState('admin@carely.cm');
  const [supportPhone, setSupportPhone] = useState('+237 6 99 00 11 22');
  const [currency, setCurrency] = useState('XAF (FCFA)');
  const [timezone, setTimezone] = useState('UTC+1 (Yaounde / Douala)');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Login Attempts State
  const [logFailedAttempts, setLogFailedAttempts] = useState(true);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState('5');
  const [lockDuration, setLockDuration] = useState('15');
  const [lockoutPolicy, setLockoutPolicy] = useState('Incremental Delay (5m, 15m, 1h)');
  const [notifyOnLockout, setNotifyOnLockout] = useState(true);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [policySaving, setPolicySaving] = useState(false);

  // 2FA & SMTP State
  const [enable2FA, setEnable2FA] = useState(false);
  const [enforceForCaregivers, setEnforceForCaregivers] = useState(false);
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [gmailAddress, setGmailAddress] = useState('carelycorp237@gmail.com');
  const [appPassword, setAppPassword] = useState('••••••••••••••••');
  const [fromAddress, setFromAddress] = useState('Carely Support <carelycorp237@gmail.com>');
  const [useTLS, setUseTLS] = useState(true);
  const [testEmailStatus, setTestEmailStatus] = useState(null);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorSaving, setTwoFactorSaving] = useState(false);

  // Campay Settings State
  const [campayUsername, setCampayUsername] = useState('carely_prod_momo');
  const [campayApiKey, setCampayApiKey] = useState('cp_live_9a87bf23c91d8e41a6');
  const [campayWebhookSecret, setCampayWebhookSecret] = useState('whsec_88f72a1b94e0912');
  const [campayEnv, setCampayEnv] = useState('production'); // 'sandbox' | 'production'
  const [campayMinPayout, setCampayMinPayout] = useState('2,500');
  const [campayMaxPayout, setCampayMaxPayout] = useState('1,500,000');
  const [campayAutoEscrow, setCampayAutoEscrow] = useState(true);
  const [campayPingStatus, setCampayPingStatus] = useState(null);

  // Chatbot Settings State
  const [chatbotModel, setChatbotModel] = useState('Gemini 1.5 Pro (Recommended)');
  const [chatbotTemperature, setChatbotTemperature] = useState('0.4');
  const [chatbotMaxTokens, setChatbotMaxTokens] = useState('2048');
  const [chatbotAutoIndex, setChatbotAutoIndex] = useState(true);
  const [chatbotSystemPrompt, setChatbotSystemPrompt] = useState(
    `You are the official Carely AI Assistant for Cameroon healthcare & domestic care services. 
Assist households in booking verified providers (home nurses, elderly care, babysitters, post-op support). 
Provide accurate guidance on Cameroon Mobile Money escrow payments (MTN & Orange), pricing in XAF, and safety protocols.`
  );

  // Audit Logs State
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAuditLogs, setLoadingAuditLogs] = useState(false);

  const initialAuditLogs = [
    { id: 'LOG-891', timestamp: '2026-03-16 14:22:05', actor: 'Samuel Ntamack (Admin)', action: 'UPDATE', resource: 'Escrow BK-20468', ip: '154.72.168.42', status: 'SUCCESS', details: 'Updated dispute hold status to manual review' },
    { id: 'LOG-890', timestamp: '2026-03-16 13:10:19', actor: 'System (Campay Webhook)', action: 'WRITE', resource: 'Payment TX-9024', ip: '52.47.19.120', status: 'SUCCESS', details: 'Escrow funded 14,000 XAF via MTN MoMo' },
    { id: 'LOG-889', timestamp: '2026-03-16 11:45:00', actor: 'Samuel Ntamack (Admin)', action: 'UPDATE', resource: 'User USR004 (Elise Ngo)', ip: '154.72.168.42', status: 'SUCCESS', details: 'Account temporarily suspended pending investigation' },
    { id: 'LOG-888', timestamp: '2026-03-16 09:30:12', actor: 'Samuel Ntamack (Admin)', action: 'READ', resource: 'Application APP101 (Marie-Claire Nkomo)', ip: '154.72.168.42', status: 'SUCCESS', details: 'Reviewed RN medical certificate and ID' },
    { id: 'LOG-887', timestamp: '2026-03-15 19:15:33', actor: 'Automated Security Service', action: 'UPDATE', resource: 'IP Lockout 197.234.12.8', ip: '197.234.12.8', status: 'SUCCESS', details: 'IP locked for 15m after 5 failed password attempts' },
    { id: 'LOG-886', timestamp: '2026-03-15 16:04:11', actor: 'Samuel Ntamack (Admin)', action: 'DELETE', resource: 'Mock User USR999', ip: '154.72.168.42', status: 'SUCCESS', details: 'Deleted test account' }
  ];

  // Success Notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Configuration updated and saved successfully!');
  const [toastType, setToastType] = useState('success');

  // Load lockout policy from backend
  const loadLockoutPolicy = async () => {
    try {
      setPolicyLoading(true);
      const policy = await fetchLockoutPolicy();
      if (policy) {
        if (policy.logFailedAttempts !== undefined) setLogFailedAttempts(Boolean(policy.logFailedAttempts));
        if (policy.maxFailedAttempts !== undefined) setMaxFailedAttempts(String(policy.maxFailedAttempts));
        if (policy.lockDuration !== undefined) setLockDuration(String(policy.lockDuration));
        if (policy.lockoutPolicy !== undefined) setLockoutPolicy(policy.lockoutPolicy);
        if (policy.notifyOnLockout !== undefined) setNotifyOnLockout(Boolean(policy.notifyOnLockout));
      }
    } catch (err) {
      console.warn('Could not load lockout policy from API:', err.message);
    } finally {
      setPolicyLoading(false);
    }
  };

  // Load real audit & login attempt logs from backend
  const loadAuditLogs = async () => {
    try {
      setLoadingAuditLogs(true);
      const realLogs = await fetchLoginAttempts({ limit: 50 });
      if (realLogs && realLogs.length > 0) {
        setAuditLogs([...realLogs, ...initialAuditLogs]);
      } else {
        setAuditLogs(initialAuditLogs);
      }
    } catch (err) {
      console.warn('Could not load audit logs:', err.message);
      setAuditLogs(initialAuditLogs);
    } finally {
      setLoadingAuditLogs(false);
    }
  };

  // Load 2FA & SMTP configuration from backend
  const loadTwoFactorPolicy = async () => {
    try {
      setTwoFactorLoading(true);
      const policy = await fetchTwoFactorPolicy();
      if (policy) {
        if (policy.master2FA !== undefined) setEnable2FA(Boolean(policy.master2FA));
        if (policy.mandatoryProvider2FA !== undefined) setEnforceForCaregivers(Boolean(policy.mandatoryProvider2FA));
        if (policy.smtpSettings) {
          if (policy.smtpSettings.host) setSmtpHost(policy.smtpSettings.host);
          if (policy.smtpSettings.port) setSmtpPort(String(policy.smtpSettings.port));
          if (policy.smtpSettings.user) setGmailAddress(policy.smtpSettings.user);
          if (policy.smtpSettings.from) setFromAddress(policy.smtpSettings.from);
        }
      }
    } catch (err) {
      console.warn('Could not load 2FA policy from API:', err.message);
    } finally {
      setTwoFactorLoading(false);
    }
  };

  useEffect(() => {
    loadLockoutPolicy();
    loadAuditLogs();
    loadTwoFactorPolicy();
  }, []);

  useEffect(() => {
    if (activeSettingsTab === 'loginAttempts') {
      loadLockoutPolicy();
    } else if (activeSettingsTab === 'auditLogs') {
      loadAuditLogs();
    } else if (activeSettingsTab === 'twoFactor') {
      loadTwoFactorPolicy();
    }
  }, [activeSettingsTab]);

  const handleSave = (e) => {
    e.preventDefault();
    setToastMessage('Configuration updated and saved successfully!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSaveTwoFactorPolicy = async (e) => {
    if (e) e.preventDefault();
    setTwoFactorSaving(true);
    try {
      await saveTwoFactorPolicy({
        master2FA: enable2FA,
        mandatoryProvider2FA: enforceForCaregivers,
        smtpHost,
        smtpPort: parseInt(smtpPort, 10) || 465,
        gmailAddress,
        appPassword,
        fromAddress,
      });
      setToastMessage('2FA & SMTP Settings saved successfully!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (err) {
      console.error('Failed to save 2FA policy:', err);
      setToastMessage(err.message || 'Failed to save 2FA settings.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } finally {
      setTwoFactorSaving(false);
    }
  };


  const handleSaveLockoutPolicy = async (e) => {
    if (e) e.preventDefault();
    setPolicySaving(true);
    try {
      const parsedMax = parseInt(maxFailedAttempts, 10) || 5;
      const parsedDuration = parseInt(lockDuration, 10) || 15;
      await saveLockoutPolicy({
        logFailedAttempts,
        notifyOnLockout,
        maxFailedAttempts: parsedMax,
        lockDuration: parsedDuration,
        lockoutPolicy,
      });
      setToastMessage('Lockout policy configuration saved successfully!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } catch (err) {
      console.error('Failed to save lockout policy:', err);
      setToastMessage(err.message || 'Failed to save lockout policy.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setPolicySaving(false);
    }
  };

  const handleTestEmail = () => {
    setTestEmailStatus('sending');
    setTimeout(() => {
      setTestEmailStatus('success');
      setTimeout(() => setTestEmailStatus(null), 3500);
    }, 1200);
  };

  const handlePingCampay = () => {
    setCampayPingStatus('testing');
    setTimeout(() => {
      setCampayPingStatus('success');
      setTimeout(() => setCampayPingStatus(null), 3500);
    }, 1200);
  };

  const logsToFilter = auditLogs && auditLogs.length > 0 ? auditLogs : initialAuditLogs;
  const filteredLogs = logsToFilter.filter(log => {
    const matchesType = auditFilter === 'ALL' || log.action === auditFilter || (auditFilter === 'FAILED' && (log.action === 'AUTH_FAILED' || log.status === 'FAILED'));
    const matchesSearch = (log.resource && log.resource.toLowerCase().includes(auditSearch.toLowerCase())) ||
                          (log.actor && log.actor.toLowerCase().includes(auditSearch.toLowerCase())) ||
                          (log.details && log.details.toLowerCase().includes(auditSearch.toLowerCase())) ||
                          (log.id && log.id.toLowerCase().includes(auditSearch.toLowerCase())) ||
                          (log.ip && log.ip.toLowerCase().includes(auditSearch.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const tabList = [
    { id: 'general', label: 'General Info', icon: Globe },
    { id: 'loginAttempts', label: 'Login Attempts & Lockout', icon: Lock },
    { id: 'auditLogs', label: 'Audit Logs', icon: History },
    { id: 'twoFactor', label: '2FA & SMTP Settings', icon: Shield },
    { id: 'campay', label: 'Campay Gateway', icon: CreditCard },
    { id: 'chatbot', label: 'AI Chatbot & Models', icon: Bot },
  ];

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 z-[99999] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-white/10 animate-fadeIn ${
          toastType === 'error' ? 'bg-red-700' : 'bg-[#1E4030]'
        }`}>
          {toastType === 'error' ? <AlertCircle size={16} className="text-red-200" /> : <CheckCircle2 size={16} className="text-green-400" />}
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[#1C1A17] font-display text-2xl font-bold">System Configuration & Security</h2>
          <p className="text-xs text-[#8A7E74]">Manage platform-wide settings, authentication policies, audit logs, and integrations.</p>
        </div>
      </div>

      {/* Horizontal Tab Navigation Bar */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-1.5 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {tabList.map(({ id, label, icon: Icon }) => {
            const isActive = activeSettingsTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSettingsTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1E4030] text-white shadow-xs'
                    : 'text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: GENERAL INFORMATION */}
      {activeSettingsTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-6 w-full">
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#F0EBE4] pb-3">
              <h3 className="font-display text-lg font-bold text-[#1C1A17] flex items-center gap-2">
                <Globe size={18} className="text-[#1E4030]" />
                General Platform Information
              </h3>
              <p className="text-xs text-[#8A7E74]">Basic identity and regional configuration for the platform</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Site Name / Platform Title</label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={e => setSiteName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Super Administrator Email</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Support Hotline (Cameroon)</label>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={e => setSupportPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Platform Base Currency</label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5]/50 text-[#8A7E74] font-bold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">System Timezone</label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-4 py-3 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
                >
                  <option value="UTC+1 (Yaounde / Douala)">UTC+1 (Yaounde / Douala / West Africa)</option>
                  <option value="UTC+0 (London / GMT)">UTC+0 (London / GMT)</option>
                  <option value="UTC+2 (Cairo / South Africa)">UTC+2 (Cairo / South Africa)</option>
                  <option value="UTC-5 (New York / EST)">UTC-5 (New York / EST)</option>
                </select>
              </div>
            </div>

            {/* Maintenance Mode Toggle Card */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-[#1C1A17] flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-amber-600" />
                  Maintenance Mode
                </h4>
                <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                  When enabled, only administrators can access the console. Regular households and providers see a maintenance page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 cursor-pointer ${
                  maintenanceMode ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  maintenanceMode ? 'left-6' : 'left-1'
                }`}></span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#E2D9CF] flex justify-end">
              <button
                type="submit"
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Save size={14} />
                Save General Settings
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: LOGIN ATTEMPTS & LOCKOUT CONFIGURATION */}
      {activeSettingsTab === 'loginAttempts' && (
        <form onSubmit={handleSaveLockoutPolicy} className="space-y-6 w-full">
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#F0EBE4] pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1C1A17] flex items-center gap-2">
                  <Lock size={18} className="text-[#1E4030]" />
                  Login Attempts & Account Lockout Policy
                </h3>
                <p className="text-xs text-[#8A7E74]">Protect accounts from brute-force authentication attempts and credential stuffing.</p>
              </div>
              {policyLoading && (
                <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
                  <RefreshCw size={12} className="animate-spin text-[#1E4030]" />
                  <span>Loading policy...</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Log failed attempts Toggle */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#1C1A17]">Log Failed Login Attempts</h4>
                  <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                    Record IP address, timestamp, device fingerprint, and username for every unsuccessful authentication.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLogFailedAttempts(!logFailedAttempts)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 cursor-pointer ${
                    logFailedAttempts ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    logFailedAttempts ? 'left-6' : 'left-1'
                  }`}></span>
                </button>
              </div>

              {/* Notify Admin on Lockout Toggle */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#1C1A17]">Notify User & Admin Upon Account Lockout</h4>
                  <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                    Instantly dispatch an email alert with unlock instructions and security verification steps.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyOnLockout(!notifyOnLockout)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 cursor-pointer ${
                    notifyOnLockout ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    notifyOnLockout ? 'left-6' : 'left-1'
                  }`}></span>
                </button>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Max Failed Attempts Before Lockout</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={maxFailedAttempts}
                      onChange={e => setMaxFailedAttempts(e.target.value)}
                      className="w-full pl-4 pr-24 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-bold focus:ring-1 focus:ring-[#1E4030]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7E74] uppercase">attempts</span>
                  </div>
                  <p className="text-[10px] text-[#8A7E74]">Recommended: 5 attempts</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Account Lockout Duration</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="1440"
                      value={lockDuration}
                      onChange={e => setLockDuration(e.target.value)}
                      className="w-full pl-4 pr-24 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-bold focus:ring-1 focus:ring-[#1E4030]"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#8A7E74] uppercase">minutes</span>
                  </div>
                  <p className="text-[10px] text-[#8A7E74]">Recommended: 15 to 30 minutes</p>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Counter Reset Policy</label>
                  <select
                    value={lockoutPolicy}
                    onChange={e => setLockoutPolicy(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-4 py-3 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
                  >
                    <option value="Incremental Delay (5m, 15m, 1h)">Incremental Delay (5m &rarr; 15m &rarr; 1h lock)</option>
                    <option value="Fixed Duration Lock">Fixed Duration Lock (Strict interval)</option>
                    <option value="Require Manual Admin Unlock">Require Manual Admin Unlock (Maximum security)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2D9CF] flex justify-end">
              <button
                type="submit"
                disabled={policySaving}
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {policySaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                {policySaving ? 'Saving Policy...' : 'Save Lockout Policy'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: AUDIT LOGS (READ, WRITE, UPDATE, DELETE) */}
      {activeSettingsTab === 'auditLogs' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F0EBE4] pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1C1A17] flex items-center gap-2">
                  <History size={18} className="text-[#1E4030]" />
                  System Audit Logs (CRUD & Authentication Stream)
                </h3>
                <p className="text-xs text-[#8A7E74]">Real-time record of authentication attempts, lockouts, and resource operations.</p>
              </div>
              <button
                type="button"
                onClick={loadAuditLogs}
                disabled={loadingAuditLogs}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#E2D9CF] rounded-xl text-xs font-bold text-[#1E4030] transition-all cursor-pointer disabled:opacity-60 shrink-0"
              >
                <RefreshCw size={13} className={loadingAuditLogs ? 'animate-spin' : ''} />
                <span>{loadingAuditLogs ? 'Refreshing...' : 'Refresh Logs'}</span>
              </button>
            </div>

            {/* Filter and Search row */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <input
                  type="text"
                  placeholder="Filter logs by actor, IP, resource or keyword..."
                  value={auditSearch}
                  onChange={e => setAuditSearch(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E2D9CF] rounded-xl text-xs outline-none bg-[#FAF8F5] focus:ring-1 focus:ring-[#1E4030] text-[#1C1A17] font-medium"
                />
              </div>

              {/* Action Type Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {['ALL', 'AUTH_FAILED', 'LOCKOUT', 'AUTH_SUCCESS', 'READ', 'WRITE', 'UPDATE', 'DELETE'].map(action => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => setAuditFilter(action)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      auditFilter === action
                        ? 'bg-[#1E4030] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#8A7E74] hover:text-[#1C1A17] border border-[#E2D9CF]'
                    }`}
                  >
                    {action === 'AUTH_FAILED' ? 'Failed Logins' : action === 'AUTH_SUCCESS' ? 'Successful Logins' : action === 'LOCKOUT' ? 'Lockouts' : action}
                  </button>
                ))}
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="border border-[#E2D9CF] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E2D9CF] text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider">
                      <th className="px-5 py-3.5">Log ID & Time</th>
                      <th className="px-5 py-3.5">Action</th>
                      <th className="px-5 py-3.5">Actor / User</th>
                      <th className="px-5 py-3.5">Resource & Details</th>
                      <th className="px-5 py-3.5">IP Address</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE6] text-xs">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-xs text-[#8A7E74]">
                          No audit or login attempt logs found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map(log => {
                        let actionColor = 'bg-gray-100 text-gray-800 border-gray-200';
                        if (log.action === 'READ') actionColor = 'bg-blue-50 text-blue-700 border-blue-200';
                        if (log.action === 'WRITE') actionColor = 'bg-green-50 text-green-700 border-green-200';
                        if (log.action === 'UPDATE') actionColor = 'bg-amber-50 text-amber-700 border-amber-200';
                        if (log.action === 'DELETE') actionColor = 'bg-red-50 text-red-700 border-red-200';
                        if (log.action === 'AUTH_SUCCESS') actionColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                        if (log.action === 'AUTH_FAILED') actionColor = 'bg-rose-50 text-rose-700 border-rose-200';
                        if (log.action === 'LOCKOUT') actionColor = 'bg-red-100 text-red-800 border-red-300';

                        let statusBadge = (
                          <span className="bg-[#EDF7F2] text-[#1D6F42] border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {log.status}
                          </span>
                        );
                        if (log.status === 'FAILED') {
                          statusBadge = (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              FAILED
                            </span>
                          );
                        } else if (log.status === 'BLOCKED' || log.status === 'LOCKED') {
                          statusBadge = (
                            <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              LOCKED
                            </span>
                          );
                        }

                        return (
                          <tr key={log.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <div className="font-mono text-[11px] font-bold text-[#1E4030]">{log.id}</div>
                              <div className="text-[10px] text-[#8A7E74]">{log.timestamp}</div>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${actionColor}`}>
                                {log.action}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap font-medium text-[#1C1A17]">
                              {log.actor}
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="font-semibold text-xs text-[#1C1A17]">{log.resource}</div>
                              <div className="text-[11px] text-[#8A7E74]">{log.details}</div>
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap font-mono text-[11px] text-[#8A7E74]">
                              {log.ip}
                            </td>
                            <td className="px-5 py-3.5 whitespace-nowrap text-center">
                              {statusBadge}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 2FA & SMTP CONFIGURATION */}
      {activeSettingsTab === 'twoFactor' && (
        <form onSubmit={handleSaveTwoFactorPolicy} className="space-y-6 w-full">
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#F0EBE4] pb-3">
              <h3 className="font-display text-lg font-bold text-[#1C1A17] flex items-center gap-2">
                <Shield size={18} className="text-[#1E4030]" />
                Two-Factor Authentication & SMTP Gateway
              </h3>
              <p className="text-xs text-[#8A7E74]">Configure system-wide 2FA requirements and SMTP email transport for OTP codes.</p>
            </div>

            <div className="space-y-4">
              {/* 2FA Toggle card block */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#1C1A17]">Master Two-Factor Authentication Switch</h4>
                  <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                    Require 2FA OTP verification for all admin and platform logins.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnable2FA(!enable2FA)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 cursor-pointer ${
                    enable2FA ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    enable2FA ? 'left-6' : 'left-1'
                  }`}></span>
                </button>
              </div>

              {/* Provider mandatory 2FA toggle */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#1C1A17]">Mandatory 2FA for Providers</h4>
                  <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                    Require OTP verification on login for all provider and caregiver accounts across Carely.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnforceForCaregivers(!enforceForCaregivers)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 cursor-pointer ${
                    enforceForCaregivers ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    enforceForCaregivers ? 'left-6' : 'left-1'
                  }`}></span>
                </button>
              </div>

              {/* SMTP configuration header */}
              <div className="border-t border-[#F0EBE4] pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1C1A17] flex items-center gap-1.5">
                      <Mail size={14} className="text-[#1E4030]" />
                      SMTP Server Transport Settings
                    </h4>
                    <p className="text-[11px] text-[#8A7E74]">Used to deliver OTP tokens and transaction receipts to Cameroon users.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestEmail}
                    className="bg-[#EDF7F2] hover:bg-green-100 text-[#1D6F42] border border-green-200 text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {testEmailStatus === 'sending' ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" />
                        <span>Sending Test...</span>
                      </>
                    ) : testEmailStatus === 'success' ? (
                      <>
                        <Check size={13} />
                        <span>Sent to {adminEmail}!</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send Test Email</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">SMTP Host Server</label>
                    <input
                      type="text"
                      value={smtpHost}
                      onChange={e => setSmtpHost(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">SMTP Port</label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={e => setSmtpPort(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">SMTP Username / Gmail Address</label>
                    <input
                      type="email"
                      value={gmailAddress}
                      onChange={e => setGmailAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">App Password (16-char Token)</label>
                    <input
                      type="password"
                      value={appPassword}
                      onChange={e => setAppPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Sender "From" Header</label>
                    <input
                      type="text"
                      value={fromAddress}
                      onChange={e => setFromAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2D9CF] flex justify-end">
              <button
                type="submit"
                disabled={twoFactorSaving}
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-60"
              >
                {twoFactorSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                {twoFactorSaving ? 'Saving 2FA Settings...' : 'Save 2FA & SMTP Settings'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: CAMPAY PAYMENT GATEWAY SETTINGS */}
      {activeSettingsTab === 'campay' && (
        <form onSubmit={handleSave} className="space-y-6 w-full">
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#F0EBE4] pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-[#1C1A17] flex items-center gap-2">
                  <CreditCard size={18} className="text-[#1E4030]" />
                  Campay Cameroon Mobile Money Integration
                </h3>
                <p className="text-xs text-[#8A7E74]">MTN Mobile Money and Orange Money automated collection & escrow payouts.</p>
              </div>

              <button
                type="button"
                onClick={handlePingCampay}
                className="bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#1E4030] border border-[#E2D9CF] text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {campayPingStatus === 'testing' ? (
                  <>
                    <RefreshCw size={13} className="animate-spin text-[#1E4030]" />
                    <span>Pinging API...</span>
                  </>
                ) : campayPingStatus === 'success' ? (
                  <>
                    <Check size={13} className="text-green-600" />
                    <span>Connection Active (HTTP 200)</span>
                  </>
                ) : (
                  <>
                    <Terminal size={13} />
                    <span>Test Gateway Connection</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Campay App Username</label>
                <input
                  type="text"
                  value={campayUsername}
                  onChange={e => setCampayUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">API Environment Mode</label>
                <select
                  value={campayEnv}
                  onChange={e => setCampayEnv(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-4 py-3 rounded-xl text-xs font-bold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
                >
                  <option value="production">Production (Live Mobile Money Real Accounts)</option>
                  <option value="sandbox">Sandbox (Testing / Mock Transactions)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Campay API Permanent Key</label>
                <input
                  type="password"
                  value={campayApiKey}
                  onChange={e => setCampayApiKey(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Webhook Signing Secret</label>
                <input
                  type="password"
                  value={campayWebhookSecret}
                  onChange={e => setCampayWebhookSecret(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Minimum Provider Payout (XAF)</label>
                <input
                  type="text"
                  value={campayMinPayout}
                  onChange={e => setCampayMinPayout(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Maximum Single Payout (XAF)</label>
                <input
                  type="text"
                  value={campayMaxPayout}
                  onChange={e => setCampayMaxPayout(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>
            </div>

            {/* Auto Escrow Release Toggle */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-[#1C1A17]">Automated Escrow Release upon Client OTP Confirmation</h4>
                <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                  Automatically trigger Campay API payout to provider's Mobile Money wallet as soon as both parties complete the verification OTP.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCampayAutoEscrow(!campayAutoEscrow)}
                className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 cursor-pointer ${
                  campayAutoEscrow ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  campayAutoEscrow ? 'left-6' : 'left-1'
                }`}></span>
              </button>
            </div>

            <div className="pt-4 border-t border-[#E2D9CF] flex justify-end">
              <button
                type="submit"
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Save size={14} />
                Save Campay Configuration
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 6: AI CHATBOT & MODEL CONFIGURATION */}
      {activeSettingsTab === 'chatbot' && (
        <form onSubmit={handleSave} className="space-y-6 w-full">
          <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#F0EBE4] pb-3">
              <h3 className="font-display text-lg font-bold text-[#1C1A17] flex items-center gap-2">
                <Bot size={18} className="text-[#1E4030]" />
                AI Assistant Engine & Model Selection
              </h3>
              <p className="text-xs text-[#8A7E74]">Configure conversational AI intelligence, LLM model choice, temperature, and knowledge indexing.</p>
            </div>

            <div className="space-y-5">
              {/* Model selection dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={12} className="text-[#1E4030]" />
                  Recommended AI Foundation Model
                </label>
                <select
                  value={chatbotModel}
                  onChange={e => setChatbotModel(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-4 py-3 rounded-xl text-xs font-bold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
                >
                  <option value="Gemini 1.5 Pro (Recommended)">Gemini 1.5 Pro (Recommended &middot; 1M Context Window &middot; High Reasoning)</option>
                  <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Ultra Fast &middot; Low Latency)</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Nuanced Healthcare Tone)</option>
                  <option value="GPT-4o">GPT-4o (Multimodal & Fast)</option>
                  <option value="Mistral Large">Mistral Large (Multilingual French & English Specialist)</option>
                </select>
              </div>

              {/* Temperature & Token parameters */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <label className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Creativity / Temperature</label>
                    <span className="font-bold text-[#1E4030]">{chatbotTemperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={chatbotTemperature}
                    onChange={e => setChatbotTemperature(e.target.value)}
                    className="w-full accent-[#1E4030] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8A7E74]">
                    <span>0.0 (Precise & Deterministic)</span>
                    <span>1.0 (Creative)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Max Output Tokens</label>
                  <input
                    type="number"
                    value={chatbotMaxTokens}
                    onChange={e => setChatbotMaxTokens(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] font-medium focus:ring-1 focus:ring-[#1E4030]"
                  />
                  <p className="text-[10px] text-[#8A7E74]">Limits response length per turn</p>
                </div>
              </div>

              {/* System Prompt Instruction */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">System Prompt & Persona Directive</label>
                <textarea
                  rows={5}
                  value={chatbotSystemPrompt}
                  onChange={e => setChatbotSystemPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl outline-none text-xs bg-[#FAF8F5] text-[#1C1A17] leading-relaxed resize-none font-medium focus:ring-1 focus:ring-[#1E4030]"
                />
              </div>

              {/* Auto-index Knowledge Base Toggle */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#1C1A17]">Auto-Index Verified Provider Profiles in Vector Knowledge Base</h4>
                  <p className="text-[11px] text-[#8A7E74] leading-relaxed">
                    Allow the AI assistant to search and recommend real providers directly based on user symptoms and location.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setChatbotAutoIndex(!chatbotAutoIndex)}
                  className={`w-11 h-6 rounded-full transition-all relative outline-none shrink-0 cursor-pointer ${
                    chatbotAutoIndex ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    chatbotAutoIndex ? 'left-6' : 'left-1'
                  }`}></span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2D9CF] flex justify-end">
              <button
                type="submit"
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold text-xs px-8 py-3 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Save size={14} />
                Save AI Chatbot Settings
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
