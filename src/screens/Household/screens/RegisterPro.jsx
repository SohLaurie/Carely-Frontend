import { useState, useRef } from 'react'
import {
  ArrowRight, ArrowLeft, ShieldCheck, Heart, Check,
  Pencil, Camera, Upload, Eye, EyeOff, FileText, X, Loader2
} from 'lucide-react'
import { registerProvider } from '../../../services/auth.service.js'
import { uploadDocument } from '../../../services/api.js'

// ── Shared Primitives ──────────────────────────────────────────────────────────

function OptionBtn({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all cursor-pointer text-left w-full ${
        selected
          ? 'bg-[#EDF7F2] border-[#1E4030] text-[#1E4030]'
          : 'bg-white border-[#E2D9CF] text-[#1C1A17] hover:border-[#1E4030]/40 hover:bg-[#FAF8F5]'
      }`}
    >
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selected ? 'border-[#1E4030] bg-[#1E4030]' : 'border-[#BDBDBD]'
        }`}
      >
        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span>{label}</span>
    </button>
  )
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-[#1C1A17] mb-1.5">
      {children}
      {required && <span className="text-[#E29578] ml-0.5">*</span>}
    </label>
  )
}

function TextInput({ ...props }) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all placeholder:text-[#BDBDBD]"
    />
  )
}

function DropdownSelect({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all appearance-none cursor-pointer"
      >
        {children}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A7E74] text-xs">▾</span>
    </div>
  )
}

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
}

// ── Sidebar ────────────────────────────────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="space-y-4">
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm text-[#1C1A17] mb-2">Why complete your profile?</h3>
        <p className="text-xs text-[#8A7E74] leading-relaxed">
          Complete profiles are more likely to receive{' '}
          <span className="text-[#E29578] font-medium">relevant service opportunities</span> and build
          trust with households.
        </p>
      </div>
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm text-[#1C1A17] mb-2">Your documents stay private</h3>
        <p className="text-xs text-[#8A7E74] leading-relaxed">
          Identity and qualification documents are used for verification only and are never
          shown publicly.
        </p>
      </div>
    </aside>
  )
}

// ── Progress bar (8 steps) ─────────────────────────────────────────────────────

const STEP_LABELS = [
  'PERSONAL INFORMATION',
  'SERVICES & SKILLS',
  'EXPERIENCE',
  'AVAILABILITY',
  'LOCATION & TRANSPORT',
  'QUALIFICATIONS & DOCUMENTS',
  'PROFILE & REFERENCES',
  'ACCOUNT & REVIEW',
]

function ProgressBar({ step }) {
  return (
    <div className="mb-5">
      <div className="flex gap-1 mb-2">
        {STEP_LABELS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i + 1 <= step ? 'bg-[#1E4030]' : 'bg-[#E2D9CF]'
            }`}
          />
        ))}
      </div>
      <p className="text-[10px] font-bold text-[#8A7E74] tracking-widest uppercase">
        Step {step} of 8 — {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}

// ── Password strength indicator ──────────────────────────────────────────────────

function getStrength(pw) {
  if (!pw) return { score: 0, label: 'Too short', color: 'bg-red-400' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-[#1E4030]']
  return { score, label: labels[score], color: colors[score] }
}

// ── STEP 1: Personal Information ───────────────────────────────────────────────

function Step1({ data, set }) {
  const fileRef = useRef(null)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>First name</FieldLabel>
          <TextInput
            placeholder="Laurie"
            value={data.firstName}
            onChange={e => set('firstName', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel required>Last name</FieldLabel>
          <TextInput
            placeholder="Noubissie"
            value={data.lastName}
            onChange={e => set('lastName', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Date of birth</FieldLabel>
          <TextInput
            type="date"
            value={data.dob}
            onChange={e => set('dob', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Gender</FieldLabel>
          <DropdownSelect value={data.gender} onChange={e => set('gender', e.target.value)}>
            <option value="">Select</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </DropdownSelect>
        </div>
      </div>

      <div>
        <FieldLabel required>Phone number</FieldLabel>
        <TextInput
          type="tel"
          placeholder="+237 691366621"
          value={data.phone}
          onChange={e => set('phone', e.target.value)}
        />
        <p className="text-[10px] text-[#8A7E74] mt-1">Format: +237 6XX XXX XXX</p>
      </div>

      <div>
        <FieldLabel required>City</FieldLabel>
        <DropdownSelect value={data.city} onChange={e => set('city', e.target.value)}>
          <option value="">Select a city</option>
          <option value="Yaoundé">Yaoundé</option>
          <option value="Douala">Douala</option>
        </DropdownSelect>
      </div>

      <div>
        <FieldLabel required>Neighborhood / District</FieldLabel>
        <TextInput
          placeholder="Nkolbisson"
          value={data.neighborhood}
          onChange={e => set('neighborhood', e.target.value)}
        />
      </div>

      <div>
        <FieldLabel required>Full address</FieldLabel>
        <div className="relative">
          <textarea
            rows={3}
            placeholder="N3, Carrefour Nkolbisson, Yaoundé"
            value={data.address}
            onChange={e => set('address', e.target.value)}
            className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all resize-none placeholder:text-[#BDBDBD]"
          />
          <Pencil size={12} className="absolute bottom-3 right-3 text-[#BDBDBD]" />
        </div>
      </div>

      {/* Profile photo upload */}
      <div>
        <FieldLabel>Profile photo</FieldLabel>
        <div className="border border-dashed border-[#E2D9CF] rounded-xl p-4 bg-[#FAF8F5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EDF7F2] rounded-full flex items-center justify-center border border-green-200/60 shrink-0">
              {data.photoPreview ? (
                <img src={data.photoPreview} alt="Preview" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <Camera size={18} className="text-[#1E4030]" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C1A17]">Upload a professional photo</p>
              <p className="text-[10px] text-[#8A7E74]">A clear face photo builds trust.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1A17] border border-[#E2D9CF] bg-white px-3 py-2 rounded-xl hover:bg-secondary transition-all cursor-pointer whitespace-nowrap"
          >
            <Upload size={13} />
            Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) {
                const url = URL.createObjectURL(file)
                set('photoPreview', url)
              }
            }}
          />
        </div>
        <p className="text-[10px] text-[#8A7E74] mt-1">JPG or PNG, maximum 2 MB</p>
      </div>
    </div>
  )
}

// ── STEP 2: Services & Skills ──────────────────────────────────────────────────

const PROFESSION_OPTIONS = [
  'Cleaner',
  'Gardener',
  'Babysitter',
  'Elderly carer',
  'Housekeeper',
  'Laundry worker',
  'Home nursing',
  'Other',
]

const EXTRA_SERVICES = [
  'Indoor cleaning',
  'Outdoor cleaning',
  'Laundry / Ironing',
  'Pet walking',
  'Moving cleaning',
  'Child care / Babysitting',
  'Elder care',
  'Cooking / Meal preparation',
]

const CHILDCARE_SKILLS = [
  'Preparing children\'s meals', 'Changing diapers',
  'Putting children to sleep', 'Helping with homework',
  'School pickup/drop-off', 'Organizing children\'s activities',
  'Newborn care', 'First-aid for children',
  'None',
]

const GENERAL_SKILLS = [
  'Childcare', 'Elderly care',
  'First aid', 'Basic health assistance',
  'Personal care assistance', 'Communication',
  'Household organization', 'Other',
]

function Step2({ data, set }) {
  return (
    <div className="space-y-7">
      {/* ── Main Profession Field ── */}
      <div>
        <FieldLabel required>Profession</FieldLabel>
        <p className="text-xs text-[#8A7E74] mb-2">Select your primary profession or specialty.</p>
        <DropdownSelect
          value={data.profession || ''}
          onChange={e => set('profession', e.target.value)}
        >
          <option value="" disabled>Select your profession</option>
          {PROFESSION_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </DropdownSelect>

        {data.profession === 'Other' && (
          <div className="mt-2.5 animate-fadeIn">
            <TextInput
              placeholder="Enter your profession (e.g. Electrician, Painter, Plumber)"
              value={data.customProfession || ''}
              onChange={e => set('customProfession', e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* ── Extra Services Question ── */}
      <div>
        <h3 className="font-bold text-base text-[#1C1A17] mb-0.5">What extra services can you provide?</h3>
        <p className="text-xs text-[#8A7E74]">Select everything you're confident doing — you can refine this later.</p>
      </div>

      <div>
        <FieldLabel>Services offered</FieldLabel>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {EXTRA_SERVICES.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={(data.extraServices || data.servicesOffered || []).includes(opt)}
              onClick={() => {
                const current = data.extraServices || data.servicesOffered || []
                const updated = toggle(current, opt)
                set('extraServices', updated)
                set('servicesOffered', updated)
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>What childcare skills do you have?</FieldLabel>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {CHILDCARE_SKILLS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.childcareSkills.includes(opt)}
              onClick={() => set('childcareSkills', toggle(data.childcareSkills, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>What general skills do you have?</FieldLabel>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {GENERAL_SKILLS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.generalSkills.includes(opt)}
              onClick={() => set('generalSkills', toggle(data.generalSkills, opt))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── STEP 3: Experience ─────────────────────────────────────────────────────────

const EXPERIENCE_YEARS = [
  'Less than 1 year', '1–2 years',
  '3–5 years', '6–10 years',
  'More than 10 years',
]

function Step3({ data, set }) {
  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold text-[#1C1A17] mb-3">
          How many years of experience do you have?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_YEARS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.experienceYears === opt}
              onClick={() => set('experienceYears', opt)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#1C1A17] mb-3">
          Have you previously worked as a care provider or household service provider?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {['Yes', 'No'].map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.previouslyWorked === opt}
              onClick={() => set('previouslyWorked', opt)}
            />
          ))}
        </div>
      </div>

      {/* Conditional fields when "Yes" is selected */}
      {data.previouslyWorked === 'Yes' && (
        <div className="space-y-4 pt-1 animate-fadeIn">
          <div>
            <FieldLabel>Most recent employer / household</FieldLabel>
            <TextInput
              placeholder="Mr Kameni"
              value={data.recentEmployer}
              onChange={e => set('recentEmployer', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Duration</FieldLabel>
              <TextInput
                placeholder="3 months"
                value={data.employmentDuration}
                onChange={e => set('employmentDuration', e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Type of service provided</FieldLabel>
              <TextInput
                placeholder="Elderly care"
                value={data.serviceProvided}
                onChange={e => set('serviceProvided', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── STEP 4: Availability ───────────────────────────────────────────────────────

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const SCHEDULE_PREF = [
  'Full-time', 'Part-time', 'Flexible', 'Weekend', 'Night work'
]

const SERVICE_TYPE_PREF = [
  'One-time services', 'Recurring services', 'Both one-time and recurring'
]

const AGE_GROUPS = [
  'Newborns', 'Toddlers', 'Children', 'Teenagers', 'Adults', 'Elderly'
]

function Step4({ data, set }) {
  return (
    <div className="space-y-7">
      <div>
        <h3 className="font-bold text-base text-[#1C1A17] mb-0.5">When are you available to work?</h3>
      </div>

      <div>
        <FieldLabel>Select all days you are available</FieldLabel>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {WEEKDAYS.map(day => (
            <OptionBtn
              key={day}
              label={day}
              selected={data.availableDays.includes(day)}
              onClick={() => set('availableDays', toggle(data.availableDays, day))}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>What type of schedule do you prefer?</FieldLabel>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {SCHEDULE_PREF.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.schedulePref.includes(opt)}
              onClick={() => set('schedulePref', toggle(data.schedulePref, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>Do you prefer one-time or recurring services?</FieldLabel>
        <div className="grid grid-cols-1 gap-2 mt-1.5">
          {SERVICE_TYPE_PREF.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.serviceTypePref === opt}
              onClick={() => set('serviceTypePref', opt)}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>What age groups are you comfortable working with?</FieldLabel>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {AGE_GROUPS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.ageGroups.includes(opt)}
              onClick={() => set('ageGroups', toggle(data.ageGroups, opt))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── STEP 5: Location & Transport ──────────────────────────────────────────────

const WORKING_AREAS = [
  'Bastos', 'Mvan', 'Essos', 'Mokolo', 'Centre-ville', 'Odza', 'Nkolbisson', 'Akwa'
]

const TRAVEL_METHODS = [
  'Walking', 'Public transport', 'Motorcycle', 'Car', 'Bicycle', 'Client transportation'
]

const TRAVEL_DISTANCES = [
  'Less than 5 km', '5–10 km', '10–20 km', 'More than 20 km'
]

function Step5({ data, set }) {
  return (
    <div className="space-y-7">
      <div>
        <FieldLabel>Which areas are you willing to work in?</FieldLabel>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {WORKING_AREAS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.workingAreas.includes(opt)}
              onClick={() => set('workingAreas', toggle(data.workingAreas, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>How do you usually travel to clients?</FieldLabel>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {TRAVEL_METHODS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.travelMethods.includes(opt)}
              onClick={() => set('travelMethods', toggle(data.travelMethods, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <FieldLabel>How far are you willing to travel?</FieldLabel>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {TRAVEL_DISTANCES.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.travelDistance === opt}
              onClick={() => set('travelDistance', opt)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── STEP 6: Qualifications & Documents ────────────────────────────────────────

const QUALIFICATION_OPTIONS = [
  'Nursing / Healthcare', 'Childcare training',
  'Elderly care training', 'First Aid',
  'Home assistance training', 'Cooking training',
  'Cleaning training', 'Other'
]

function Step6({ data, set }) {
  const idInputRef = useRef(null)
  const policeInputRef = useRef(null)
  const certInputRef = useRef(null)

  const [idUploading, setIdUploading] = useState(false)
  const [policeUploading, setPoliceUploading] = useState(false)
  const [certUploading, setCertUploading] = useState(false)

  const handleUpload = async (file, fieldPrefix, setUploading) => {
    if (!file) return
    set(fieldPrefix + 'DocName', file.name)
    setUploading(true)
    try {
      const res = await uploadDocument(file)
      set(fieldPrefix + 'DocUrl', res.url)
    } catch (err) {
      console.error(`${fieldPrefix} upload failed:`, err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <FieldLabel>Do you have any professional qualifications?</FieldLabel>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {QUALIFICATION_OPTIONS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.qualifications.includes(opt)}
              onClick={() => set('qualifications', toggle(data.qualifications, opt))}
            />
          ))}
        </div>
      </div>

      {/* Identity document upload */}
      <div>
        <FieldLabel>Identity document</FieldLabel>
        <div className="border border-dashed border-[#E2D9CF] rounded-xl p-4 bg-[#FAF8F5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EDF7F2] rounded-full flex items-center justify-center border border-green-200/60 shrink-0">
              {data.idDocUrl ? (
                <Check size={18} className="text-[#1D6F42]" />
              ) : (
                <FileText size={18} className="text-[#1E4030]" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                {data.identityDocName ? data.identityDocName : 'Upload your identity document'}
                {data.idDocUrl && (
                  <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded">Saved</span>
                )}
              </p>
              <p className="text-[10px] text-[#8A7E74]">National ID or passport — JPG, PNG or PDF, max 5 MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => idInputRef.current?.click()}
            disabled={idUploading}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1A17] border border-[#E2D9CF] bg-white px-3.5 py-2 rounded-xl hover:bg-secondary transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {idUploading ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#1E4030]" />
                <span>Uploading...</span>
              </>
            ) : (
              data.idDocUrl ? 'Change file' : 'Choose file'
            )}
          </button>
          <input
            ref={idInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file, 'identity', setIdUploading)
            }}
          />
        </div>
      </div>

      {/* Police clearance document upload (Casier Judiciaire) */}
      <div>
        <FieldLabel>Police clearance document</FieldLabel>
        <div className="border border-dashed border-[#E2D9CF] rounded-xl p-4 bg-[#FAF8F5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EDF7F2] rounded-full flex items-center justify-center border border-green-200/60 shrink-0">
              {data.policeClearanceDocUrl ? (
                <Check size={18} className="text-[#1D6F42]" />
              ) : (
                <FileText size={18} className="text-[#1E4030]" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                {data.policeClearanceDocName ? data.policeClearanceDocName : 'Upload police clearance document'}
                {data.policeClearanceDocUrl && (
                  <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded">Saved</span>
                )}
              </p>
              <p className="text-[10px] text-[#8A7E74]">Extract of criminal record / Casier judiciaire (bulletin n°3) — JPG, PNG or PDF, max 5 MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => policeInputRef.current?.click()}
            disabled={policeUploading}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1A17] border border-[#E2D9CF] bg-white px-3.5 py-2 rounded-xl hover:bg-secondary transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {policeUploading ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#1E4030]" />
                <span>Uploading...</span>
              </>
            ) : (
              data.policeClearanceDocUrl ? 'Change file' : 'Choose file'
            )}
          </button>
          <input
            ref={policeInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file, 'policeClearance', setPoliceUploading)
            }}
          />
        </div>
      </div>

      {/* Certificates upload */}
      <div>
        <FieldLabel>Certificates (optional)</FieldLabel>
        <div className="border border-dashed border-[#E2D9CF] rounded-xl p-4 bg-[#FAF8F5] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#EDF7F2] rounded-full flex items-center justify-center border border-green-200/60 shrink-0">
              {data.certDocUrl ? (
                <Check size={18} className="text-[#1D6F42]" />
              ) : (
                <FileText size={18} className="text-[#1E4030]" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C1A17] flex items-center gap-1.5">
                {data.certDocName ? data.certDocName : 'Upload certificates'}
                {data.certDocUrl && (
                  <span className="text-[9px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded">Saved</span>
                )}
              </p>
              <p className="text-[10px] text-[#8A7E74]">Add training or first-aid certificates</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => certInputRef.current?.click()}
            disabled={certUploading}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1C1A17] border border-[#E2D9CF] bg-white px-3.5 py-2 rounded-xl hover:bg-secondary transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {certUploading ? (
              <>
                <Loader2 size={13} className="animate-spin text-[#1E4030]" />
                <span>Uploading...</span>
              </>
            ) : (
              data.certDocUrl ? 'Change file' : 'Choose file'
            )}
          </button>
          <input
            ref={certInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file, 'cert', setCertUploading)
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ── STEP 7: Profile & References ──────────────────────────────────────────────

function Step7({ data, set }) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Short professional bio</FieldLabel>
        <div className="relative">
          <textarea
            rows={4}
            placeholder="Tell households who you are and how you work."
            value={data.bio}
            onChange={e => set('bio', e.target.value)}
            className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all resize-none placeholder:text-[#BDBDBD]"
          />
          <Pencil size={12} className="absolute bottom-3 right-3 text-[#BDBDBD]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Expected hourly rate (XAF)</FieldLabel>
          <TextInput
            type="number"
            placeholder="1231"
            value={data.hourlyRate}
            onChange={e => set('hourlyRate', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Languages spoken</FieldLabel>
          <TextInput
            placeholder="fR"
            value={data.languages}
            onChange={e => set('languages', e.target.value)}
          />
        </div>
      </div>

      <div>
        <FieldLabel>Reference name</FieldLabel>
        <TextInput
          placeholder="23"
          value={data.referenceName}
          onChange={e => set('referenceName', e.target.value)}
        />
      </div>

      <div>
        <FieldLabel>Reference phone number</FieldLabel>
        <TextInput
          type="tel"
          placeholder="232323"
          value={data.referencePhone}
          onChange={e => set('referencePhone', e.target.value)}
        />
      </div>
    </div>
  )
}

// ── STEP 8: Account & Review ───────────────────────────────────────────────────

function Step8({ data, set }) {
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const strength = getStrength(data.password)

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel required>Email address</FieldLabel>
        <TextInput
          type="email"
          placeholder="laurienoubissie@gmail.com"
          value={data.email}
          onChange={e => set('email', e.target.value)}
        />
      </div>

      <div>
        <FieldLabel required>Password</FieldLabel>
        <div className="relative">
          <Input
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={data.password}
            onChange={e => set('password', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7E74] hover:text-[#1C1A17]"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {data.password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= strength.score ? strength.color : 'bg-[#E2D9CF]'
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-[#8A7E74]">
              Password strength:{' '}
              <span className="font-semibold text-[#1C1A17]">{strength.label}</span>
            </p>
          </div>
        )}
      </div>

      <div>
        <FieldLabel required>Confirm password</FieldLabel>
        <div className="relative">
          <Input
            type={showCpw ? 'text' : 'password'}
            placeholder="••••••••"
            value={data.confirmPassword}
            onChange={e => set('confirmPassword', e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowCpw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7E74] hover:text-[#1C1A17]"
          >
            {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Gray confirmation box container */}
      <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4.5 space-y-3.5 mt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => set('agreedTerms', !data.agreedTerms)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
              data.agreedTerms ? 'bg-[#1E4030] border-[#1E4030]' : 'border-[#BDBDBD] bg-white'
            }`}
          >
            {data.agreedTerms && <Check size={10} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-xs text-[#8A7E74] leading-relaxed">
            I agree to Carely's Terms of Service and Privacy Policy.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => set('agreedAccurate', !data.agreedAccurate)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
              data.agreedAccurate ? 'bg-[#1E4030] border-[#1E4030]' : 'border-[#BDBDBD] bg-white'
            }`}
          >
            {data.agreedAccurate && <Check size={10} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-xs text-[#8A7E74] leading-relaxed">
            I confirm that the information I have provided is accurate.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => set('agreedChecks', !data.agreedChecks)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
              data.agreedChecks ? 'bg-[#1E4030] border-[#1E4030]' : 'border-[#BDBDBD] bg-white'
            }`}
          >
            {data.agreedChecks && <Check size={10} strokeWidth={3} className="text-white" />}
          </div>
          <span className="text-xs text-[#8A7E74] leading-relaxed">
            I accept that Carely may carry out verification checks on my profile and documents.
          </span>
        </label>
      </div>
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all placeholder:text-[#BDBDBD]"
    />
  )
}

// ── Main RegisterPro component ─────────────────────────────────────────────────

const initialData = {
  // Step 1
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  phone: '',
  city: '',
  neighborhood: '',
  address: '',
  photoPreview: null,
  // Step 2
  profession: '',
  customProfession: '',
  extraServices: [],
  servicesOffered: [],
  childcareSkills: [],
  generalSkills: [],
  // Step 3
  experienceYears: '',
  previouslyWorked: '',
  recentEmployer: '',
  employmentDuration: '',
  serviceProvided: '',
  // Step 4
  availableDays: [],
  schedulePref: [],
  serviceTypePref: '',
  ageGroups: [],
  // Step 5
  workingAreas: [],
  travelMethods: [],
  travelDistance: '',
  // Step 6
  qualifications: [],
  identityDocName: '',
  idDocUrl: '',
  policeClearanceDocName: '',
  policeClearanceDocUrl: '',
  certDocName: '',
  certDocUrl: '',
  // Step 7
  bio: '',
  hourlyRate: '',
  languages: '',
  referenceName: '',
  referencePhone: '',
  // Step 8
  email: '',
  password: '',
  confirmPassword: '',
  agreedTerms: false,
  agreedAccurate: false,
  agreedChecks: false,
}

export default function RegisterPro({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = (key, value) => setData(prev => ({ ...prev, [key]: value }))
  const next = () => setStep(s => Math.min(s + 1, 8))
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await registerProvider(data)
      setSubmitted(true)
      // Do NOT auto-navigate — provider must wait for admin approval
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.')
      setSubmitting(false)
    }
  }

  const isFormValidStep8 = data.email && data.password && data.confirmPassword && data.agreedTerms && data.agreedAccurate && data.agreedChecks

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-sm">
          <div className="w-16 h-16 bg-[#EDF7F2] rounded-full flex items-center justify-center mx-auto border border-green-200">
            <Check size={28} className="text-[#1E4030]" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">Application submitted!</h2>
          <p className="text-sm text-[#8A7E74] leading-relaxed">
            Your provider profile is now under review by our team. Once approved, you will receive a payment notification to activate your account with a 25 XAF subscription fee.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="mt-4 text-sm font-bold text-[#1E4030] underline cursor-pointer hover:text-[#152e22]"
          >
            Back to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top header */}
      <header className="bg-[#FAF8F5] border-b border-[#E2D9CF] px-6 lg:px-12 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white rounded-xl p-1 flex items-center justify-center border border-[#E2D9CF] shadow-xs shrink-0">
            <img src="/logo.png" alt="Carely Logo" className="w-full h-full object-contain" />
          </div>
          <div className="leading-tight">
            <p className="font-display font-bold text-sm text-[#1E4030]">Carely</p>
            <p className="text-[10px] text-[#8A7E74]">Trusted care</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8A7E74]">
          <ShieldCheck size={14} className="text-[#1E4030]" />
          <span>Verified network</span>
        </div>
      </header>

      {/* Page body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#1C1A17] mb-1">
            Create your provider profile
          </h1>
          <p className="text-xs text-[#8A7E74]">
            Tell households who you are, what you do and when you're{' '}
            <span className="text-[#E29578] font-medium">available.</span>
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">
          {/* Form card */}
          <div className="bg-white border border-[#E2D9CF] rounded-2xl p-6 shadow-sm">
            <ProgressBar step={step} />

            <div className="min-h-[400px]">
              {step === 1 && <Step1 data={data} set={set} />}
              {step === 2 && <Step2 data={data} set={set} />}
              {step === 3 && <Step3 data={data} set={set} />}
              {step === 4 && <Step4 data={data} set={set} />}
              {step === 5 && <Step5 data={data} set={set} />}
              {step === 6 && <Step6 data={data} set={set} />}
              {step === 7 && <Step7 data={data} set={set} />}
              {step === 8 && <Step8 data={data} set={set} />}
            </div>

            {/* Footer nav */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#F0EBE4]">
              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="text-xs font-semibold text-[#1E4030] underline hover:text-[#152e22] transition-colors cursor-pointer"
                >
                  Change account type
                </button>
              ) : (
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center gap-2 text-sm font-semibold text-[#1C1A17] bg-white border border-[#E2D9CF] px-4 py-2.5 rounded-xl hover:bg-[#FAF8F5] transition-all cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              )}

              {step < 8 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-[#1E4030] hover:bg-[#152e22] px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Continue
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValidStep8 || submitting}
                  className={`flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer ${
                    isFormValidStep8 && !submitting ? 'bg-[#1E4030] hover:bg-[#152e22] opacity-100' : 'bg-[#8CA396] opacity-50 cursor-not-allowed'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit my application'}
                </button>
              )}
            </div>
            {/* Submission error */}
            {submitError && (
              <div className="mt-3 text-xs text-red-600 font-medium text-center bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                {submitError}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
