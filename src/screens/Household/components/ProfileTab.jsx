import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, ShieldCheck, Lock, CreditCard,
  Bell, Check, Save, Heart, Users, Star, Calendar, Camera,
  Shield, CheckCircle2, AlertCircle, FileText, Smartphone
} from 'lucide-react';

export default function ProfileTab({ onNavigate }) {
  const [activeSubTab, setActiveSubTab] = useState('personal');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Aïcha Kemajou',
    email: 'aicha.kemajou@example.cm',
    phone: '+237 6 99 12 34 56',
    location: 'Bastos, Yaounde, Cameroon',
    emergencyContact: 'Dr. Jean-Paul Kemajou (+237 6 77 88 99 00)',
    familyMembers: '2 Adults, 1 Senior (Mother - 74yo, post-knee surgery)',
    homeAccessNotes: 'Villa 14B, security gate code 4821. Ground floor access with wheelchair ramp.',
    preferredLanguage: 'French & English',
    notificationsEmail: true,
    notificationsSMS: true,
    twoFactorAuth: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
            <User size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E4030]">My Profile & Account Settings</h2>
            <p className="text-sm text-[#8A7E74]">Manage your personal information, family care requirements, and escrow preferences.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-[#EDF7F2] border border-green-300 text-[#1E4030] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn shadow-xs">
            <Check size={14} className="text-green-700" />
            Profile updated successfully!
          </div>
        )}
      </div>

      {/* Profile Overview Card (Current User: Aïcha Kemajou) */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with edit badge */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-[#1E4030] text-white flex items-center justify-center text-3xl font-bold font-display shadow-md border-2 border-white">
              AK
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-[#E2D9CF] text-[#1E4030] flex items-center justify-center shadow-md hover:bg-[#FAF8F5] transition-colors cursor-pointer">
              <Camera size={14} />
            </button>
          </div>

          {/* User Meta */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-2xl font-bold text-[#1C1A17]">{formData.fullName}</h3>
                <p className="text-xs text-[#8A7E74] flex items-center justify-center sm:justify-start gap-1 pt-0.5">
                  <MapPin size={12} className="text-[#1E4030]" />
                  {formData.location}
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#EDF7F2] border border-green-200 text-[#1E4030] text-xs font-bold px-3 py-1 rounded-full mx-auto sm:mx-0">
                <ShieldCheck size={14} />
                <span>Verified Household Client</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1C1A17]">3</div>
                <div className="text-[10px] text-[#8A7E74]">Completed Bookings</div>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1C1A17]">5.0 ★</div>
                <div className="text-[10px] text-[#8A7E74]">Client Rating</div>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1E4030]">2024</div>
                <div className="text-[10px] text-[#8A7E74]">Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-2 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'personal', label: 'Personal Information', Icon: User },
            { id: 'care', label: 'Family & Home Needs', Icon: Heart },
            { id: 'payment', label: 'Payment & Escrow Wallet', Icon: CreditCard },
            { id: 'security', label: 'Security & Alerts', Icon: Lock },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSubTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === id
                  ? 'bg-[#1E4030] text-white shadow-sm'
                  : 'text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Form */}
      <form onSubmit={handleSave} className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {activeSubTab === 'personal' && (
          <div className="space-y-5 animate-fadeIn">
            <h4 className="font-bold text-base text-[#1C1A17] border-b border-[#F0EBE4] pb-3">Personal Contact Details</h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Primary Phone Number (MTN / Orange)</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Residential Address & City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'care' && (
          <div className="space-y-5 animate-fadeIn">
            <h4 className="font-bold text-base text-[#1C1A17] border-b border-[#F0EBE4] pb-3">Household Care Profile & Patient Requirements</h4>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Emergency Relative / Doctor Contact</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Family Members Under Care</label>
                <input
                  type="text"
                  value={formData.familyMembers}
                  onChange={e => setFormData({ ...formData, familyMembers: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Home Access & Care Guidelines for Caregivers</label>
                <textarea
                  rows={3}
                  value={formData.homeAccessNotes}
                  onChange={e => setFormData({ ...formData, homeAccessNotes: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'payment' && (
          <div className="space-y-5 animate-fadeIn">
            <h4 className="font-bold text-base text-[#1C1A17] border-b border-[#F0EBE4] pb-3">Authorized Mobile Money Wallets</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center">
                    MTN
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1C1A17]">MTN Mobile Money</p>
                    <p className="text-[11px] text-[#8A7E74]">+237 6 99 *** *56</p>
                  </div>
                </div>
                <span className="bg-[#EDF7F2] text-[#1E4030] text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">Default</span>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center">
                    OM
                  </div>
                  <div>
                    <p className="font-bold text-xs text-[#1C1A17]">Orange Money</p>
                    <p className="text-[11px] text-[#8A7E74]">+237 6 55 *** *12</p>
                  </div>
                </div>
                <button type="button" className="text-xs text-[#1E4030] font-bold hover:underline cursor-pointer">Set Default</button>
              </div>
            </div>

            <div className="p-4 bg-[#EDF7F2] border border-green-200 rounded-2xl flex items-center gap-2 text-xs text-[#1E4030]">
              <ShieldCheck size={16} className="shrink-0" />
              <span>Carely Escrow Protection: Funds are only debited upon your PIN approval and released upon verified session completion.</span>
            </div>
          </div>
        )}

        {activeSubTab === 'security' && (
          <div className="space-y-5 animate-fadeIn">
            <h4 className="font-bold text-base text-[#1C1A17] border-b border-[#F0EBE4] pb-3">Security & Alert Preferences</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-[#1C1A17]">Two-Factor Authentication via SMS</p>
                  <p className="text-[10px] text-[#8A7E74]">Require an instant OTP whenever signing in from a new browser</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.twoFactorAuth}
                  onChange={e => setFormData({ ...formData, twoFactorAuth: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#1E4030] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-[#1C1A17]">SMS Booking & Arrival Alerts</p>
                  <p className="text-[10px] text-[#8A7E74]">Get instant text alerts when a caregiver accepts a request or verifies the arrival OTP</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notificationsSMS}
                  onChange={e => setFormData({ ...formData, notificationsSMS: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#1E4030] cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="pt-4 border-t border-[#E2D9CF] flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg"
          >
            <Save size={14} />
            Save Profile Settings
          </button>
        </div>
      </form>
    </div>
  );
}
