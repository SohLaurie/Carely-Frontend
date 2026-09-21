import React, { useState, useEffect, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, ShieldCheck, Check, Save, Camera, Globe, Award, Clock, Lock, Loader2, AlertCircle, CheckCircle2, FileText, Sparkles
} from 'lucide-react';
import { CAREGIVER_CONSTANTS } from '../constants/dashboardConstants';
import { getStoredUser, getUserInitials, getAvatarUrl } from '../../../services/api.js';
import { fetchCurrentProfile, updateCurrentProfile } from '../../../services/auth.service.js';
import { compressAndReadImage } from '../../../utils/imageUtils.js';
import { fetchCertificationStatus } from '../../../services/admin.service.js';
import RequestCertificationModal from './RequestCertificationModal.jsx';
import CertificationPaymentModal from './CertificationPaymentModal.jsx';

export default function ProfileTab({ onNavigate }) {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [certStatus, setCertStatus] = useState(null);
  const [certLoading, setCertLoading] = useState(false);
  const [showRequestCertModal, setShowRequestCertModal] = useState(false);
  const [showCertPaymentModal, setShowCertPaymentModal] = useState(false);

  const storedUser = getStoredUser();
  const [user, setUser] = useState(storedUser);

  const getInitialName = (u) => u?.name || `${u?.firstName || ''} ${u?.lastName || ''}`.trim() || 'Provider Profile';
  const getInitialEmail = (u) => u?.email || '';
  const getInitialPhone = (u) => u?.phone || '';
  const getInitialLocation = (u) => u?.city ? `${u.city}, Cameroon` : 'Yaoundé, Cameroon';
  const getInitialProfession = (u) => u?.profession || u?.providerProfile?.profession || u?.specialty || 'Cleaner';
  const getInitialHourlyRate = (u) => u?.hourlyRate || u?.pricePerHour || u?.providerProfile?.pricePerHour || u?.providerProfile?.hourlyRate || '50';
  const getInitialExperience = (u) => u?.experience || (u?.experienceYears ? `${u.experienceYears} years` : null) || u?.providerProfile?.experience || '3–5 years';
  const getInitialBio = (u) => u?.bio || u?.providerProfile?.bio || 'Professional and experienced service provider dedicated to high-quality care, reliability, and client comfort.';

  const [formData, setFormData] = useState({
    fullName: getInitialName(storedUser),
    email: getInitialEmail(storedUser),
    phone: getInitialPhone(storedUser),
    secondaryPhone: storedUser?.secondaryPhone || '',
    location: getInitialLocation(storedUser),
    emergencyContact: storedUser?.emergencyContact || storedUser?.providerProfile?.referencePhone || '',
    preferredLanguage: Array.isArray(storedUser?.languages) ? storedUser.languages.join(' & ') : (storedUser?.preferredLanguage || 'French & English'),
    specialty: getInitialProfession(storedUser),
    hourlyRate: String(getInitialHourlyRate(storedUser)),
    experienceYears: String(getInitialExperience(storedUser)),
    serviceRadius: storedUser?.serviceRadius || storedUser?.providerProfile?.serviceRadius || '15 km',
    certifications: Array.isArray(storedUser?.certifications) ? storedUser.certifications.join(', ') : (storedUser?.certifications || 'Verified Platform Provider'),
    bio: getInitialBio(storedUser)
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
          secondaryPhone: freshUser?.secondaryPhone || prev.secondaryPhone,
          location: getInitialLocation(freshUser),
          emergencyContact: freshUser?.emergencyContact || freshUser?.providerProfile?.referencePhone || prev.emergencyContact,
          preferredLanguage: freshUser?.preferredLanguage || (Array.isArray(freshUser?.languages) ? freshUser.languages.join(' & ') : prev.preferredLanguage),
          specialty: getInitialProfession(freshUser),
          hourlyRate: String(getInitialHourlyRate(freshUser)),
          experienceYears: String(getInitialExperience(freshUser)),
          serviceRadius: freshUser?.serviceRadius || freshUser?.providerProfile?.serviceRadius || prev.serviceRadius,
          certifications: Array.isArray(freshUser?.certifications) ? freshUser.certifications.join(', ') : (freshUser?.certifications || prev.certifications),
          bio: freshUser?.bio || freshUser?.providerProfile?.bio || prev.bio,
        }));
      }
    }
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  const loadCertStatus = async () => {
    setCertLoading(true);
    try {
      const status = await fetchCertificationStatus();
      setCertStatus(status);
    } catch (err) {
      console.warn('Could not load certification status:', err.message);
    } finally {
      setCertLoading(false);
    }
  };

  useEffect(() => {
    loadCertStatus();
  }, []);

  const initials = getUserInitials(user, 'PR');
  const isApproved = (user?.approvalStatus || user?.providerProfile?.approvalStatus || '').toLowerCase() === 'approved';
  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2024;

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      setUploadingPhoto(true);
      setErrorMessage(null);
      const compressed = await compressAndReadImage(file, 400, 400, 0.85);
      setPhotoPreview(compressed);

      // Auto-save immediately so navbar updates right away
      const updated = await updateCurrentProfile({ photoUrl: compressed });
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Image selection/upload error:', err);
      setErrorMessage(err.message || 'Failed to update profile picture');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrorMessage(null);
    try {
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || 'Provider';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        firstName,
        lastName,
        phone: formData.phone,
        secondaryPhone: formData.secondaryPhone,
        city: formData.location.replace(/,\s*Cameroon$/i, '').trim(),
        profession: formData.specialty,
        hourlyRate: parseInt(String(formData.hourlyRate).replace(/\D/g, ''), 10) || 50,
        experience: formData.experienceYears,
        serviceRadius: formData.serviceRadius,
        certifications: formData.certifications,
        emergencyContact: formData.emergencyContact,
        preferredLanguage: formData.preferredLanguage,
        bio: formData.bio,
      };

      if (photoPreview) {
        payload.photoUrl = photoPreview;
      }

      const updated = await updateCurrentProfile(payload);
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to update provider profile:', err);
      setErrorMessage(err.message || 'Failed to save profile changes');
    } finally {
      setSaveLoading(false);
    }
  };

  const rawPhoto = user?.photoUrl || user?.photo_url || user?.providerProfile?.photoUrl || user?.providerProfile?.photo_url;
  const currentAvatar = photoPreview || getAvatarUrl(rawPhoto);

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
            <User size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1E4030]">Personal Profile & Information</h2>
            <p className="text-sm text-[#8A7E74]">Manage your personal contact information, verified credentials and provider details.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-[#EDF7F2] border border-green-300 text-[#1E4030] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn shadow-xs">
            <Check size={14} className="text-green-700" />
            Profile updated successfully!
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 animate-fadeIn shadow-xs">
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            {errorMessage}
          </div>
        )}
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with edit badge */}
          <div className="flex flex-col items-center sm:items-start shrink-0">
            <label
              htmlFor="caregiver-avatar-upload"
              className="relative cursor-pointer group select-none shrink-0 block rounded-2xl focus-within:ring-2 focus-within:ring-[#1E4030]"
              title="Click to change profile picture"
            >
              <input
                id="caregiver-avatar-upload"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoSelect}
                onClick={(e) => e.stopPropagation()}
                className="sr-only"
              />
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={formData.fullName}
                  className="w-24 h-24 rounded-2xl object-cover shadow-md border-2 border-white group-hover:opacity-90 group-hover:ring-4 group-hover:ring-[#1E4030]/20 transition-all pointer-events-none"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#1E4030] text-white flex items-center justify-center text-3xl font-bold font-display shadow-md border-2 border-white group-hover:ring-4 group-hover:ring-[#1E4030]/20 transition-all pointer-events-none">
                  {initials}
                </div>
              )}

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/35 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity pointer-events-none">
                <Camera size={20} className="mb-0.5 drop-shadow-sm" />
                <span className="text-[10px] font-bold drop-shadow-sm">Change</span>
              </div>

              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/55 rounded-2xl flex flex-col items-center justify-center z-10 pointer-events-none">
                  <Loader2 size={24} className="text-white animate-spin mb-1" />
                  <span className="text-[9px] text-white font-semibold">Updating...</span>
                </div>
              )}
              <div
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-[#E2D9CF] text-[#1E4030] flex items-center justify-center shadow-md group-hover:bg-[#FAF8F5] group-hover:scale-110 transition-all pointer-events-none"
                title="Click to change profile picture"
              >
                <Camera size={14} />
              </div>
            </label>

            {/* Explicit secondary button trigger */}
            <label
              htmlFor="caregiver-avatar-upload"
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] hover:bg-[#F3EFEA] active:scale-95 border border-[#E2D9CF] rounded-xl text-xs font-semibold text-[#1E4030] cursor-pointer transition-all shadow-2xs select-none"
              title="Click to select new photo"
            >
              <Camera size={13} className="text-[#1E4030]" />
              <span>Change Photo</span>
            </label>
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
                <span>{isApproved ? 'Verified Registered Provider' : 'Pending Verification Provider'}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1C1A17]">
                  {Number(formData.hourlyRate || 50).toLocaleString()} XAF
                </div>
                <div className="text-[10px] text-[#8A7E74]">Hourly Rate</div>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1C1A17]">
                  {formData.experienceYears}
                </div>
                <div className="text-[10px] text-[#8A7E74]">Experience</div>
              </div>
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-3 text-center">
                <div className="text-base font-bold text-[#1E4030]">{memberSince}</div>
                <div className="text-[10px] text-[#8A7E74]">Member Since</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal & Professional Information Form */}
      <form onSubmit={handleSave} className="bg-white border border-[#E2D9CF] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-5">
          <div className="border-b border-[#F0EBE4] pb-3">
            <h4 className="font-bold text-base text-[#1C1A17]">Personal Information</h4>
            <p className="text-xs text-[#8A7E74]">Your primary contact details and identity information</p>
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Email Address</label>
                <span className="flex items-center gap-1 text-[10px] text-[#8A7E74] font-semibold bg-[#F3EFEA] px-2 py-0.5 rounded-md border border-[#E2D9CF]">
                  <Lock size={10} className="text-[#8A7E74]" /> Read-only
                </span>
              </div>
              <input
                type="email"
                value={formData.email}
                readOnly
                disabled
                title="Account email address cannot be changed"
                className="w-full px-4 py-3 bg-[#F3EFEA] border border-[#E2D9CF] rounded-xl text-xs text-[#8A7E74] cursor-not-allowed font-medium select-none"
              />
              <p className="text-[10px] text-[#8A7E74]/80">Primary email linked to your platform account credentials.</p>
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
              <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Preferred Languages</label>
              <input
                type="text"
                value={formData.preferredLanguage}
                onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
              />
            </div>
          </div>

          {/* Professional Credentials Section */}
          <div className="border-t border-[#F0EBE4] pt-5 space-y-5">
            <div className="border-b border-[#F0EBE4] pb-3">
              <h4 className="font-bold text-base text-[#1C1A17]">Professional Credentials & Rates</h4>
              <p className="text-xs text-[#8A7E74]">Your verified caregiver qualifications, rate, and specialties</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Primary Profession</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Hourly Rate (XAF/hr)</label>
                <input
                  type="text"
                  value={formData.hourlyRate}
                  onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experienceYears}
                  onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">Service Radius</label>
                <input
                  type="text"
                  value={formData.serviceRadius}
                  onChange={e => setFormData({ ...formData, serviceRadius: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                />
              </div>

              {/* Carely Two-Tier Trust: Certified Provider Section */}
              <div className="space-y-3 sm:col-span-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">
                    Carely Quality Certification (Tier 2 Trust)
                  </label>
                  <p className="text-[11px] text-[#8A7E74] mt-0.5">
                    Earn the official <strong className="text-[#1E4030]">[✓ Certified]</strong> badge by submitting educational certificates or diplomas.
                  </p>
                </div>

                {certStatus?.isCertified ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-emerald-950">✓ Certified Provider Active</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            Badge Active
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-0.5">
                          {certStatus.certificationTitle ? `${certStatus.certificationTitle} · ` : ''}
                          {certStatus.certificationInstitution || 'Accredited Institution'}
                        </p>
                        <p className="text-[10px] text-emerald-700/80 mt-0.5">
                          The official Certified badge is now displayed on your search cards and public profile.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRequestCertModal(true)}
                      className="text-xs font-bold text-emerald-900 hover:text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 px-3.5 py-2 rounded-xl transition-all self-start sm:self-center cursor-pointer shadow-2xs"
                    >
                      Update Certificate
                    </button>
                  </div>
                ) : certStatus?.certificationStatus === 'pending' ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Clock size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-amber-950">Certification Application Under Review</h4>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            Pending Admin Review
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-900 mt-0.5 font-medium">
                          {certStatus.certificationTitle ? `${certStatus.certificationTitle} · ` : ''}
                          {certStatus.certificationInstitution || 'Submitted Document'}
                        </p>
                        <p className="text-[10px] text-amber-800 mt-0.5">
                          Carely administrators are reviewing your diploma credentials. You will be notified once approved.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : certStatus?.certificationStatus === 'approved' && !certStatus?.isCertified ? (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-emerald-950">Certification Approved! Badge Ready</h4>
                          <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Action Required
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-900 mt-0.5">
                          {certStatus.certificationTitle ? `${certStatus.certificationTitle} was approved! ` : ''}
                          Pay the 25 XAF fee to activate your official Certified badge.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCertPaymentModal(true)}
                      className="bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer shrink-0"
                    >
                      <Award size={14} />
                      <span>Pay 25 XAF & Activate Badge</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EDE8E1] text-[#1E4030] flex items-center justify-center shrink-0">
                        <Award size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1C1A17]">Request Quality Certification</h4>
                        <p className="text-[11px] text-[#8A7E74] mt-0.5">
                          Upload your nursing, caregiving, or vocational diplomas to display the verified quality badge.
                        </p>
                        {certStatus?.certificationStatus === 'rejected' && (
                          <p className="text-[10px] text-red-600 font-semibold mt-0.5">
                            Previous submission was declined{certStatus?.certificationNotes ? `: ${certStatus.certificationNotes}` : ''}. You may re-apply with valid credentials.
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRequestCertModal(true)}
                      className="bg-[#1E4030] hover:bg-[#152e22] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center cursor-pointer shrink-0"
                    >
                      <Award size={14} />
                      <span>Request Certification</span>
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-bold text-[#8A7E74] uppercase tracking-wide">
                    Additional Certifications & Licenses Description
                  </label>
                  <input
                    type="text"
                    value={formData.certifications}
                    onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                    placeholder="e.g. CPR Certified, First Aid, State Registered Nurse"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-3">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">About Me / Caregiver Bio</label>
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
            disabled={saveLoading}
            className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] disabled:opacity-50 text-white px-8 py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95"
          >
            {saveLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={14} />
                Save Personal Information
              </>
            )}
          </button>
        </div>
      </form>

      {/* Request Certification Modal */}
      <RequestCertificationModal
        isOpen={showRequestCertModal}
        onClose={() => setShowRequestCertModal(false)}
        onSuccess={() => {
          loadCertStatus();
        }}
      />

      {/* Certification Payment Modal */}
      <CertificationPaymentModal
        isOpen={showCertPaymentModal}
        onClose={() => setShowCertPaymentModal(false)}
        initialPhone={user?.phone || ''}
        onPaymentSuccess={() => {
          loadCertStatus();
        }}
      />
    </div>
  );
}
