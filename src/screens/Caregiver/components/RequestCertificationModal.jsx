import React, { useState, useRef } from 'react';
import { X, Award, Upload, CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import { requestCertification } from '../../../services/admin.service.js';

const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RequestCertificationModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`${API_ORIGIN}/api/upload/document`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to upload document');
      }

      const doc = await res.json();
      setUploadedDoc(doc);
      setFile(selectedFile);
    } catch (err) {
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide the certification or diploma title.');
      return;
    }
    if (!uploadedDoc?.url) {
      setError('Please upload your educational certificate or diploma document.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await requestCertification({
        title: title.trim(),
        institution: institution.trim(),
        documentUrl: uploadedDoc.url,
        documentName: uploadedDoc.originalName || file?.name || 'Certificate',
        notes: notes.trim(),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit certification request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E2D9CF] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#E2D9CF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1C1A17]">Request Carely Certification</h3>
              <p className="text-xs text-[#8A7E74]">Submit educational certificates to earn your Certified badge</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#EFECE6] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">
              Certification / Diploma Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. State Registered Nurse, Early Childhood Diploma"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">
              Issuing Institution / School
            </label>
            <input
              type="text"
              placeholder="e.g. University of Yaoundé I, Red Cross Cameroon"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">
              Certificate Document (PDF or Image) *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              className="hidden"
            />

            {!uploadedDoc ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E2D9CF] hover:border-[#1E4030] bg-[#FAF8F5] hover:bg-[#F3EFEA] rounded-2xl p-6 text-center cursor-pointer transition-all"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2 text-[#1E4030]">
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-xs font-semibold">Uploading document...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#8A7E74]">
                    <Upload size={24} className="text-[#1E4030]" />
                    <span className="text-xs font-bold text-[#1C1A17]">Click to select certificate file</span>
                    <span className="text-[11px]">PDF, PNG, JPG, or DOC up to 25MB</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={16} className="text-emerald-700 shrink-0" />
                  <span className="text-xs font-bold text-emerald-900 truncate">
                    {uploadedDoc.originalName || file?.name}
                  </span>
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedDoc(null);
                    setFile(null);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 ml-2 cursor-pointer"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Additional details about your skills, honors, or accreditation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] focus:outline-none focus:border-[#1E4030] leading-relaxed resize-none font-medium"
            />
          </div>

          <div className="pt-3 border-t border-[#E2D9CF] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E2D9CF] text-xs font-bold text-[#8A7E74] hover:bg-[#FAF8F5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="flex items-center gap-2 bg-[#1E4030] hover:bg-[#152e22] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Submit for Verification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}