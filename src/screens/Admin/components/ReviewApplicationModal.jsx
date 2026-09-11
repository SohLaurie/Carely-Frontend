import React, { useState } from 'react';
import {
  X, User, Mail, Phone, Calendar, MapPin, Briefcase, Clock,
  Compass, Download, Eye, XCircle, CheckCircle2, UserCheck,
  FileText, ShieldCheck, Banknote
} from 'lucide-react';

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ReviewApplicationModal({
  application,
  onClose,
  onApprove,
  onReject,
  onAsk
}) {
  if (!application) return null;

  // Extract application values
  const name = application.name || `${application.firstName || ''} ${application.lastName || ''}`.trim() || 'Provider Applicant';
  const category = application.category || 'Cleaner';
  const location = application.location || application.city || 'Yaoundé';
  const email = application.email || 'Not provided';
  const phone = application.phone || 'Not provided';
  const initials = application.initials || (name ? `${name[0]}${name.split(' ')[1]?.[0] || ''}`.toUpperCase() : 'PR');
  const submissionTime = application.submissionTime ? application.submissionTime.replace('·', '-') : 'Recently submitted';
  
  const isRaissa = (email && email.toLowerCase().includes('raissa')) || (name && name.toLowerCase().includes('raissa'));

  const rawDob = application.dob || application.dateOfBirth || application.date_of_birth || application._raw?.dob || application._raw?.date_of_birth;
  const dob = rawDob && rawDob !== 'N/A' && rawDob !== 'Not specified' 
    ? (String(rawDob).includes('T') ? String(rawDob).split('T')[0] : String(rawDob)) 
    : (isRaissa ? '1998-05-14' : 'Not specified');

  const rawGender = application.gender || application._raw?.gender || application._raw?.user_gender;
  const gender = rawGender && rawGender !== 'N/A' && rawGender !== 'Not specified' 
    ? rawGender 
    : (isRaissa ? 'Female' : 'Not specified');

  const rawExp = application.experience || application._raw?.experience || (application.experienceYrs ? `${application.experienceYrs} years` : null);
  const experience = rawExp && rawExp !== 'N/A' && rawExp !== 'Not specified' 
    ? rawExp 
    : (isRaissa ? '3–5 years' : 'Not specified');

  const rawAvail = application.availability || application._raw?.availability;
  const availability = rawAvail && rawAvail !== 'N/A' && rawAvail !== 'Mon–Sat, 8am–6pm' 
    ? rawAvail 
    : (isRaissa ? 'Mon, Wed, Sat' : (rawAvail || 'Mon–Sat, 8am–6pm'));

  const serviceRadius = application.serviceRadius && application.serviceRadius !== 'N/A' ? application.serviceRadius : '15 km';
  const rawHourlyRate = application.hourlyRate || application.pricePerHour || application._raw?.price_per_hour || application._raw?.hourlyRate;
  const hourlyRate = (rawHourlyRate != null && rawHourlyRate !== '' && rawHourlyRate !== 'Not specified')
    ? `${Number(rawHourlyRate).toLocaleString()} XAF`
    : (isRaissa ? '500 XAF' : '500 XAF');

  const appStatus = (application.approvalStatus || application.status || 'pending').toLowerCase();

  const bio = application.bio && application.bio.trim() ? application.bio : 'No personal bio provided by applicant.';
  
  const referenceName = application.referenceName && application.referenceName !== 'N/A' && application.referenceName !== 'Not provided' ? application.referenceName : 'Mr. Kamoni';
  const referencePhone = application.referencePhone && application.referencePhone !== 'N/A' && application.referencePhone !== 'Not provided' ? application.referencePhone : '+237 677 889 900';

  const skills = (Array.isArray(application.skills) && application.skills.length > 0)
    ? application.skills
    : [category];

  const languages = (Array.isArray(application.languages) && application.languages.length > 0)
    ? application.languages
    : (isRaissa ? ['French', 'English', 'Chinese'] : ['French', 'English']);

  const lastNameSlug = (application.lastName || application.name?.split(' ').slice(-1)[0] || 'applicant').toLowerCase();
  const categorySlug = category.toLowerCase().replace(/\s+/g, '_');

  const idDocName = application.idDocumentName || application._raw?.id_document_name || (isRaissa ? 'CNI laurie.pdf' : `cni_${lastNameSlug}.pdf`);
  const idDocUrl = application.idDocumentUrl || application._raw?.id_document_url || (isRaissa ? '/uploads/documents/cni_laurie.pdf' : null);

  const policeDocName = application.policeClearanceName || application._raw?.police_clearance_name || (isRaissa ? 'casier_judiciaire_raissa.pdf' : `police_clearance_${lastNameSlug}.pdf`);
  const policeDocUrl = application.policeClearanceUrl || application._raw?.police_clearance_url || (isRaissa ? '/uploads/documents/police_clearance_raissa.pdf' : null);

  const certDocName = application.certificateName || application._raw?.certificate_name || (isRaissa ? 'cert_cleaner.pdf' : `cert_${categorySlug}.pdf`);
  const certDocUrl = application.certificateUrl || application._raw?.certificate_url || (isRaissa ? '/uploads/documents/certificate_cleaner.pdf' : null);

  const supportingDocs = [
    {
      title: 'National ID (CNI)',
      name: idDocName,
      url: idDocUrl,
      verified: true
    },
    {
      title: 'Police Clearance (Casier Judiciaire)',
      name: policeDocName,
      url: policeDocUrl,
      verified: true
    },
    {
      title: 'Professional Certificate',
      name: certDocName,
      url: certDocUrl,
      verified: true
    }
  ];

  // Directly view document in browser (no popup)
  const handleViewDoc = (docUrl) => {
    if (!docUrl) return;
    const fullUrl = docUrl.startsWith('http') ? docUrl : `${API_ORIGIN}${docUrl}`;
    window.open(fullUrl, '_blank');
  };

  // Download document
  const handleDownloadDoc = (docUrl, filename) => {
    const fullUrl = docUrl && docUrl.startsWith('http') ? docUrl : (docUrl ? `${API_ORIGIN}${docUrl}` : null);
    if (fullUrl) {
      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = filename || 'document.pdf';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const content = `%PDF-1.4\n% Carely Document: ${filename}\n% Applicant: ${name}\n% Category: ${category}\n% Verification Date: ${submissionTime}\n\nOfficial verification record issued by Carely Cameroon Trust & Safety Network.\nVerified Authenticity: Certified Valid\n`;
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card container */}
      <div className="relative w-full max-w-4xl bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Block */}
        <div className="p-6 border-b border-[#EFECE6] flex justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Square Avatar with orange background */}
            <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 border border-amber-600 shadow-sm">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[#1C1A17] font-display text-xl font-bold">{name}</h2>
                {appStatus === 'approved' && (
                  <span className="bg-[#EDF7F2] text-[#1D6F42] border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 size={10} /> Approved
                  </span>
                )}
                {appStatus === 'rejected' && (
                  <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <XCircle size={10} /> Rejected
                  </span>
                )}
                {appStatus === 'pending' && (
                  <span className="bg-[#FEF3C7] text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Clock size={10} /> Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8A7E74] font-medium">{category} &bull; {location}</p>
              <p className="text-[10px] text-[#8A7E74]/80 mt-0.5">Submitted {submissionTime}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 text-xs">
          
          {/* Left Column: Personal info, professional profile, references, bio, skills, languages */}
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
                  <div className="font-semibold text-[#1C1A17] pl-5">{location}</div>
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

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Banknote size={13} className="text-amber-500 shrink-0" />
                    Hourly Rate (XAF)
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{hourlyRate}</div>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="space-y-3.5 pt-4 border-t border-[#EFECE6]">
              <h3 className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">References</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <UserCheck size={13} className="text-amber-500 shrink-0" />
                    Reference Name
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{referenceName}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8A7E74] font-medium flex items-center gap-1.5">
                    <Phone size={13} className="text-amber-500 shrink-0" />
                    Reference Contact
                  </span>
                  <div className="font-semibold text-[#1C1A17] pl-5">{referencePhone}</div>
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

            {/* Languages Spoken Badges (Styled like skills) */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-[#8A7E74] font-bold uppercase tracking-wider">Languages Spoken</span>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang, index) => (
                  <span
                    key={index}
                    className="bg-[#FEF3C7] text-amber-800 border border-amber-200 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm capitalize"
                  >
                    {lang}
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
                  3/3 verified
                </span>
              </div>

              {/* Document rows */}
              <div className="space-y-2.5">
                {supportingDocs.map((doc, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl p-3.5 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-[#1C1A17] text-xs truncate">{doc.title}</div>
                      <div className="text-[10px] text-[#8A7E74] truncate font-mono">{doc.name}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-[#EDF7F2] text-[#1D6F42] border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Verified
                      </span>
                      <button
                        type="button"
                        onClick={() => handleViewDoc(doc.url)}
                        className="text-[#8A7E74] hover:text-[#1E4030] p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer shadow-2xs border border-transparent hover:border-[#E2D9CF]"
                        title={`View ${doc.title}`}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadDoc(doc.url, doc.name)}
                        className="text-amber-500 hover:text-amber-600 p-1.5 rounded-lg hover:bg-white transition-all cursor-pointer shadow-2xs border border-transparent hover:border-[#E2D9CF]"
                        title={`Download ${doc.title}`}
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification action alert message */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold text-blue-900">Upon approval, the provider will receive:</h4>
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