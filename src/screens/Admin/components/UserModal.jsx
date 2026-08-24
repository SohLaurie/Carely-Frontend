import React, { useState, useEffect } from 'react';
import { X, User, Mail, MapPin, Calendar, ShieldCheck, Check } from 'lucide-react';

export default function UserModal({
  user,
  editMode = false,
  onClose,
  onSave
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Household');
  const [city, setCity] = useState('Yaounde');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setCity(user.city);
    }
  }, [user]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user.id, { name, email, role, city });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card container */}
      <div className="relative w-full max-w-md bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#EFECE6] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E4030] text-white flex items-center justify-center font-bold text-xs">
              {user.initials}
            </div>
            <div>
              <h3 className="font-semibold text-xs text-[#8A7E74] uppercase tracking-wider">
                {editMode ? 'Edit Profile' : 'User Account Details'}
              </h3>
              <p className="text-sm font-bold text-[#1C1A17] -mt-0.5">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-gray-200 flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-colors"
          >
            <X size={16} />
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
                  <option value="Household">Household</option>
                  <option value="Caregiver">Caregiver</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8A7E74] uppercase tracking-wider text-[10px]">City Location</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E2D9CF] px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1E4030]"
                >
                  <option value="Yaounde">Yaounde</option>
                  <option value="Douala">Douala</option>
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
          <div className="p-6 space-y-5 text-xs">
            <div className="space-y-3.5 bg-[#FAF8F5] border border-[#EFECE6] p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <User size={14} className="text-[#8A7E74]" />
                <div>
                  <span className="text-[9px] text-[#8A7E74] font-bold uppercase tracking-wider">Account ID</span>
                  <div className="font-semibold text-[#1C1A17]">{user.id}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-[#EFECE6] pt-3">
                <Mail size={14} className="text-[#8A7E74]" />
                <div>
                  <span className="text-[9px] text-[#8A7E74] font-bold uppercase tracking-wider">Email Address</span>
                  <div className="font-semibold text-[#1C1A17]">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-[#EFECE6] pt-3">
                <MapPin size={14} className="text-[#8A7E74]" />
                <div>
                  <span className="text-[9px] text-[#8A7E74] font-bold uppercase tracking-wider">Location City</span>
                  <div className="font-semibold text-[#1C1A17]">{user.city}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-[#EFECE6] pt-3">
                <Calendar size={14} className="text-[#8A7E74]" />
                <div>
                  <span className="text-[9px] text-[#8A7E74] font-bold uppercase tracking-wider">Member Since</span>
                  <div className="font-semibold text-[#1C1A17]">{user.joined}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl text-center">
                <span className="text-[9px] text-[#8A7E74] font-bold uppercase tracking-wider">Role</span>
                <div className="font-bold text-xs text-[#1C1A17] mt-0.5">{user.role}</div>
              </div>
              <div className="p-3 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl text-center">
                <span className="text-[9px] text-[#8A7E74] font-bold uppercase tracking-wider">Status</span>
                <div className="font-bold text-xs text-[#1C1A17] mt-0.5">{user.status}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EFECE6] text-right">
              <button
                onClick={onClose}
                className="bg-[#1E4030] hover:bg-[#152e22] text-white font-bold px-5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
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
