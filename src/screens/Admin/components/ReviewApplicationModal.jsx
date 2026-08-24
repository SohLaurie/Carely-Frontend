import React from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Briefcase, Clock, Compass, ShieldAlert, Download, XCircle, CheckCircle2 } from 'lucide-react';

export default function ReviewApplicationModal({
  application,
  onClose,
  onApprove,
  onReject,
  onAsk
}) {
  if (!application) return null;

  // Use application values or fallbacks matching Marie-Claire Nkomo
  const name = application.name || 'Marie-Claire Nkomo';
  const category = application.category === 'Home Nursing' ? 'Home Nurse' : application.category;
  const location = application.location || 'Yaounde';
  const email = application.email || 'marieclaire.n@gmail.com';
  const phone = application.phone || '+237 699 11 22 33';
  const initials = application.initials || 'MN';
  const submissionTime = application.submissionTime ? application.submissionTime.replace('·', '-') : 'Mar 16, 2026 - 07:52 AM';
  const dob = application.dob || 'Mar 15, 1990';
  const gender = application.gender || 'Female';
  const experience = application.experience || '6 years';
  const availability = application.availability || 'Mon–Sat, 8am–6pm';
  const serviceRadius = application.serviceRadius || '15 km';
  const bio = application.bio || 'Registered Nurse (RN) with 6 years of hospital ICU experience. Transitioned to home geriatric and palliative care. Specialized in elderly care, medication management, and post-op rehabilitation.';
  const skills = application.skills || ['Geriatric Care', 'Medication Admin', 'Wound Care', 'Palliative Support'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card container (wider max-w-3xl or 4xl matching layout) */}
      <div className="relative w-full max-w-4xl bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Block */}
        <div className="p-6 border-b border-[#EFECE6] flex justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Square Avatar with orange background */}
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 border border-amber-600 shadow-sm">
              {initials}
            </div>
            <div>
              <h2 className="text-[#1C1A17] font-display text-xl font-bold">{name}</h2>
              <p className="text-xs text-[#8A7E74] font-medium">{category} &bull; {location}</p>
              <p className="text-[10px] text-[#8A7E74]/80 mt-0.5">Submitted {submissionTime}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 text-xs">
          
          {/* Left Column: Personal info, professional profiles, bio, and skills */}
          <div className="space-y-6">
            
            {/* Personal Information */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <User size={13} className="text-amber-500 shrink-0" />
                    Name
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{name}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Mail size={13} className="text-amber-500 shrink-0" />
                    Email
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5 break-all">{email}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-500 shrink-0" />
                    Phone
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
                    Location
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">Bastos, {location}</div>
                </div>
              </div>
            </div>

            {/* Professional Profile */}
            <div className="space-y-3.5 pt-4 border-t border-[#EFECE6]">
              <h3 className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Professional Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Briefcase size={13} className="text-amber-500 shrink-0" />
                    Profession
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{category}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Briefcase size={13} className="text-amber-500 shrink-0" />
                    Experience
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{experience}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-500 shrink-0" />
                    Availability
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{availability}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Compass size={13} className="text-amber-500 shrink-0" />
                    Service Radius
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{serviceRadius}</div>
                </div>
              </div>
            </div>

            {/* Bio statement */}
            <div className="space-y-2 pt-4 border-t border-[#EFECE6]">
              <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Bio</span>
              <p className="text-[#1C1A17] bg-[#FAF8F5] border border-[#EFECE6] p-3 rounded-2xl leading-relaxed">
                {bio}
              </p>
            </div>

            {/* Skills Badges */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-[#FEF3C7] text-amber-800 border border-amber-200 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Supporting documents & verification prompt message */}
          <div className="space-y-6">
            
            {/* Supporting Documents */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Supporting Documents</h3>
                <span className="bg-[#FEF3C7] text-amber-800 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {application.idVerified && application.certVerified ? '2/3 verified' : '1/3 verified'}
                </span>
              </div>

              {/* Document rows */}
              <div className="space-y-2.5">
                {/* ID */}
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#1C1A17]">National ID (CNI)</div>
                    <div className="text-[10px] text-[#8A7E74]">cni_nkomo.pdf</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#EDF7F2] text-[#1D6F42] border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                    <button className="text-amber-500 hover:text-amber-600 p-1">
                      <Download size={14} />
                    </button>
                  </div>
                </div>

                {/* Certificate */}
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#1C1A17]">Professional Certificate</div>
                    <div className="text-[10px] text-[#8A7E74]">cert_nursing.pdf</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#EDF7F2] text-[#1D6F42] border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                    <button className="text-amber-500 hover:text-amber-600 p-1">
                      <Download size={14} />
                    </button>
                  </div>
                </div>

                {/* References */}
                <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#1C1A17]">References Check</div>
                    <div className="text-[10px] text-[#8A7E74]">references_check_2026.pdf</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF8F5] text-gray-500 border border-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Pending
                    </span>
                    <button className="text-[#8A7E74] hover:text-[#1C1A17] p-1">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification action alert message */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-blue-900">Upon approval, the caregiver will receive:</h4>
              <p className="text-blue-800 leading-relaxed italic text-[11px]">
                &ldquo;Your profile has been verified and approved. Please proceed to subscription payment to activate your account and become visible to clients.&rdquo;
              </p>
            </div>

          </div>

        </div>

        {/* Footer Area with Reject / Approve button */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#EFECE6] flex justify-end gap-3 shrink-0">
          <button
            onClick={() => onReject(application.id)}
            className="border border-[#FCA5A5] bg-white text-red-600 hover:bg-red-50 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <XCircle size={14} />
            Reject
          </button>
          <button
            onClick={() => onApprove(application.id)}
            className="bg-[#1D6F42] hover:bg-[#155231] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <CheckCircle2 size={14} />
            Approve Account
          </button>
        </div>

      </div>
    </div>
  );
}
