import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, ShieldCheck, Check, Save, Camera, Globe, Shield, Lock, Award, Loader2
} from 'lucide-react';
import { getStoredUser, getUserInitials } from '../../../services/api.js';
import { fetchCurrentProfile, updateCurrentProfile } from '../../../services/auth.service.js';

export default function AdminProfileTab({ onNavigate }) {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const storedUser = getStoredUser();
  const [user, setUser] = useState(storedUser);

  const getInitialName = (u) => u?.name || `${u?.firstName || ''} ${u?.lastName || ''}`.trim() || 'Carely Admin';
  const getInitialEmail = (u) => u?.email || 'carelycorp237@gmail.com';
  const getInitialPhone = (u) => u?.phone || '+237 6 99 00 00 00';
  const getInitialLocation = (u) => u?.city ? `${u.city}, Cameroon` : 'Yaoundé, Cameroon';

  const [formData, setFormData] = useState({
    fullName: getInitialName(storedUser),
    email: getInitialEmail(storedUser),
    phone: getInitialPhone(storedUser),
    secondaryPhone: storedUser?.secondaryPhone || '+237 6 77 00 11 22',
    location: getInitialLocation(storedUser),
    emergencyContact: storedUser?.emergencyContact || 'Dr. Anne Ntamack (+237 6 55 11 22 33)',
    preferredLanguage: storedUser?.preferredLanguage || 'French & English',
    role: 'Super Administrator & Security Lead',
    clearanceTier: 'Level 4 (Full Platform Clearance)',
    authMethod: 'MFA Hardware Key + Authenticator App',
    certifications: storedUser?.certifications || 'Certified Information Systems Auditor (CISA), Cameroon Data Protection Officer',
    bio: storedUser?.bio || 'Lead System Administrator at Carely Cameroon. Responsible for platform infrastructure, mobile money escrow security, provider compliance verification, and dispute resolution governance.'
  });

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      const freshUser = await fetchCurrentProfile();
      if (freshUser && isMounted) {
        setUser(freshUser);
        setFormData(prev => ({
          ...prev,
          fullName: getInitialName(freshUser),
          email: getInitialEmail(freshUser),
          phone: getInitialPhone(freshUser),
          location: getInitialLocation(freshUser),
          bio: freshUser.bio || prev.bio,
        }));
      }
    }
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const adminSinceYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2024;
  const initials = getUserInitials(user, 'CA');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || 'Carely';
      const lastName = nameParts.slice(1).join(' ') || 'Admin';

      const updated = await updateCurrentProfile({
        firstName,
        lastName,
        phone: formData.phone,
        city: formData.location.replace(/,\s*Cameroon$/i, '').trim(),
        bio: formData.bio,
      });

      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update admin profile:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
            <User size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E4030]">Administrator Profile & Credentials</h2>
            <p className="text-sm text-[#8A7E74]">Manage your personal contact information, administrative access, and security clearance details.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-[#EDF7F2] border border-green-300 text-[#1E4030] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn shadow-xs">
            <Check size={14} className="text-green-700" />
            Admin profile updated successfully!
          </div>
        )}
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with edit badge */}
          <div className="relative">
            {user?.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={formData.fullName}
                className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-[#1E4030] text-white flex items-center justify-center text-3xl font-bold font-display shadow-md border-2 border-white">
                {initials}
              </div>
            )}
            <button
              type="button"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-[#E2D9CF] text-[#1E4030] flex items-center justify-center shadow-md hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
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
                <ShieldCheck size={14} className="text-[#1D6F42]" />
                <span>Super Administrator &middot; MFA Active</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1C1A17]">99.98%</div>
                <div className="text-[10px] text-[#8A7E74]">System Uptime</div>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1C1A17]">2,148</div>
                <div className="text-[10px] text-[#8A7E74]">Bookings Overseen</div>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1E4030]">{adminSinceYear}</div>
                <div className="text-[10px] text-[#8A7E74]">Admin Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information & Credentials Form */}
      <form onSubmit={handleSave} className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-5">
          <div className="border-b border-[#F0EBE4] pb-3">
            <h4 className="font-bold text-base text-[#1C1A17]">Personal Information</h4>
            <p className="text-xs text-[#8A7E74]">Your primary contact details and administrator profile</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Full Legal Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Admin Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Primary Phone (MTN Mobile Money)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Secondary Phone (Orange Money)</label>
              <input
                type="text"
                value={formData.secondaryPhone}
                onChange={e => setFormData({ ...formData, secondaryPhone: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Residential Address & City</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Emergency Contact</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Preferred Working Languages</label>
              <input
                type="text"
                value={formData.preferredLanguage}
                onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>
          </div>

          {/* System Clearance & Responsibilities Section */}
          <div className="border-t border-[#F0EBE4] pt-5 space-y-5">
            <div className="border-b border-[#F0EBE4] pb-3">
              <h4 className="font-bold text-base text-[#1C1A17]">System Administration & Security Clearance</h4>
              <p className="text-xs text-[#8A7E74]">Your platform permissions, verified certifications, and administrative scope</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Administrative Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Security Clearance</label>
                <input
                  type="text"
                  value={formData.clearanceTier}
                  onChange={e => setFormData({ ...formData, clearanceTier: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Authentication Method</label>
                <input
                  type="text"
                  value={formData.authMethod}
                  onChange={e => setFormData({ ...formData, authMethod: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-3">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Verified Certifications & Compliance Credentials</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-3">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Administrative Responsibilities & Bio</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] leading-relaxed resize-none font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-[#E2D9CF] flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95"
          >
            <Save size={14} />
            Save Profile Information
          </button>
        </div>
      </form>
    </div>
  );
}
