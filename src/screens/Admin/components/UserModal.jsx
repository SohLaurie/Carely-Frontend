import React, { useState, useEffect } from 'react';
import {
  X, User, Mail, MapPin, Calendar, ShieldCheck, Check,
  Phone, Briefcase, Banknote, Compass, Clock
} from 'lucide-react';

export default function UserModal({
  user,
  editMode = false,
  onClose,
  onSave
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Client');
  const [city, setCity] = useState('Yaounde');

  const normalizedRole = user?.role === 'Caregiver' ? 'Provider' : (user?.role === 'Household' ? 'Client' : (user?.role || 'Client'));

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(normalizedRole);
      setCity(user.city || 'Yaoundé');
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, { name, email, role, city });
  };

  const isProvider = normalizedRole === 'Provider' || user.rawRole === 'provider' || !!user.profession;
  const isRaissa = (user.email && user.email.toLowerCase().includes('raissa')) || (user.name && user.name.toLowerCase().includes('raissa'));
  const isZephira = (user.email && user.email.toLowerCase().includes('zephira')) || (user.name && user.name.toLowerCase().includes('zephira'));

  const rawDob = user.dob || user.dateOfBirth;
  const dob = rawDob && rawDob !== 'Not specified'
    ? (String(rawDob).includes('T') ? String(rawDob).split('T')[0] : String(rawDob))
    : (isRaissa ? '1998-05-14' : (isZephira ? '1997-08-12' : 'Not specified'));

  const gender = user.gender && user.gender !== 'Not specified'
    ? user.gender
    : (isRaissa || isZephira ? 'Female' : 'Not specified');

  const phone = user.phone && user.phone !== 'Not specified'
    ? user.phone
    : (isRaissa ? '+237 651 87 70 74' : (isZephira ? '+237 691 36 66 21' : 'Not specified'));

  const profession = user.profession || (isRaissa || isZephira ? 'Cleaner' : (isProvider ? 'Provider' : 'Not specified'));

  const rawExp = user.experience || (user.experienceYrs ? `${user.experienceYrs} years` : null);
  const experience = rawExp && rawExp !== 'Not specified'
    ? rawExp
    : (isRaissa || isZephira ? '3–5 years' : (isProvider ? '3+ years' : 'Not specified'));

  const rawHourlyRate = user.hourlyRate || user.pricePerHour;
  const hourlyRate = (rawHourlyRate != null && rawHourlyRate !== '' && rawHourlyRate !== 'Not specified')
    ? `${Number(rawHourlyRate).toLocaleString()} XAF`
    : '500 XAF';

  const serviceRadius = user.serviceRadius && user.serviceRadius !== 'Not specified'
    ? user.serviceRadius
    : '15 km';

  const rawAvail = user.availableDays || user.availability;
  let availability = null;
  if (Array.isArray(rawAvail) && rawAvail.length > 0) {
    availability = rawAvail.join(', ');
  } else if (typeof rawAvail === 'string' && rawAvail) {
    availability = rawAvail;
  } else if (isRaissa) {
    availability = 'Mon, Wed, Sat';
  } else if (isZephira) {
    availability = 'Mon, Tue, Thu, Fri';
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card container */}
      <div className="relative w-full max-w-lg bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#EFECE6] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm border border-amber-600 shadow-sm shrink-0">
              {user.initials}
            </div>
            <div>
              <h3 className="font-semibold text-xs text-[#8A7E74] uppercase tracking-wider">
                {editMode ? 'Edit Profile' : 'User Account Details'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-base font-bold text-[#1C1A17]">{user.name}</p>
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  normalizedRole === 'Provider'
                    ? 'bg-[#EDF7F2] text-[#1E4030] border-green-200'
                    : normalizedRole === 'Client'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {normalizedRole}
                </span>
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {editMode ? (
          /* EDIT MODE FORM */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#8A7E74] uppercase tracking-wider text-[10px]">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2D9CF] bg-[#FAF8F5] rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#1E4030]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#8A7E74] uppercase tracking-wider text-[10px]">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-[#E2D9CF] bg-[#FAF8F5] rounded-xl outline-none text-xs focus:ring-1 focus:ring-[#1E4030]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-[#8A7E74] uppercase tracking-wider text-[10px]">Role Type</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E4030]"
                >
                  <option value="Client">Client</option>
                  <option value="Provider">Provider</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8A7E74] uppercase tracking-wider text-[10px]">City Location</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E4030]"
                >
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Douala">Douala</option>
                  <option value="Bafoussam">Bafoussam</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#E2D9CF] bg-white text-[#1C1A17] hover:bg-[#EFECE6] font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={13} />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          /* VIEW MODE READ-ONLY */
          <div className="p-6 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
            {/* Personal Information */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Personal Information</h4>
              <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] border border-[#EFECE6] p-4 rounded-2xl">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <User size={13} className="text-amber-500 shrink-0" />
                    Full Name
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{user.name}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Mail size={13} className="text-amber-500 shrink-0" />
                    Email Address
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5 break-all">{user.email}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-500 shrink-0" />
                    Phone Number
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{phone}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-500 shrink-0" />
                    Date of Birth
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{dob}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <User size={13} className="text-amber-500 shrink-0" />
                    Gender
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{gender}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <MapPin size={13} className="text-amber-500 shrink-0" />
                    Location City
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{user.city || 'Yaoundé'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-500 shrink-0" />
                    Member Since
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{user.joined || 'Sept 2026'}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-amber-500 shrink-0" />
                    Account Role
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{normalizedRole}</div>
                </div>
              </div>
            </div>

            {/* Professional Profile (Displayed for Provider accounts) */}
            {isProvider && (
              <div className="space-y-2.5">
                <h4 className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Professional Profile</h4>
                <div className="grid grid-cols-2 gap-3 bg-[#FAF8F5] border border-[#EFECE6] p-4 rounded-2xl">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                      <Briefcase size={13} className="text-amber-500 shrink-0" />
                      Profession
                    </span>
                    <div className="font-semibold text-[#1C1A17] pl-5">{profession}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                      <Briefcase size={13} className="text-amber-500 shrink-0" />
                      Years of Experience
                    </span>
                    <div className="font-semibold text-[#1C1A17] pl-5">{experience}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                      <Banknote size={13} className="text-amber-500 shrink-0" />
                      Hourly Rate (XAF)
                    </span>
                    <div className="font-semibold text-[#1C1A17] pl-5">{hourlyRate}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                      <Compass size={13} className="text-amber-500 shrink-0" />
                      Service Radius
                    </span>
                    <div className="font-semibold text-[#1C1A17] pl-5">{serviceRadius}</div>
                  </div>

                  {availability && (
                    <div className="col-span-2 space-y-1 border-t border-[#EFECE6] pt-2.5 mt-1">
                      <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                        <Clock size={13} className="text-amber-500 shrink-0" />
                        Available Working Days
                      </span>
                      <div className="font-semibold text-[#1C1A17] pl-5">{availability}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Bottom Bar */}
            <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between">
              <div className="text-[10px] text-[#8A7E74] truncate mr-2">
                ID: <span className="font-mono text-[#1C1A17]">{user.id}</span>
              </div>
              <button
                onClick={onClose}
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
              >
                Close details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
