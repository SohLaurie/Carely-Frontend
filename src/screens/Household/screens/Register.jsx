import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Heart, Check, Pencil, Leaf } from 'lucide-react'

// ── Reusable components ────────────────────────────────────────────────────────

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

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-[#1C1A17] mb-1.5">
      {children}
      {required && <span className="text-[#E29578] ml-0.5">*</span>}
    </label>
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

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all appearance-none cursor-pointer"
    >
      {children}
    </select>
  )
}

// ── Sidebar (static across all steps) ─────────────────────────────────────────

function Sidebar() {
  return (
    <aside className="space-y-4">
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm text-[#1C1A17] mb-2">Why we ask this</h3>
        <p className="text-xs text-[#8A7E74] leading-relaxed">
          The more we know about your household, the better Carely can recommend providers
          who truly{' '}
          <span className="text-[#E29578] font-medium">fit your needs.</span>
        </p>
      </div>
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-sm text-[#1C1A17] mb-2">Verified providers only</h3>
        <p className="text-xs text-[#8A7E74] leading-relaxed">
          Every provider on Carely goes through identity checks and profile review before
          receiving requests.
        </p>
      </div>
    </aside>
  )
}

// ── Progress bar ───────────────────────────────────────────────────────────────

const STEP_LABELS = ['ACCOUNT', 'PERSONAL INFORMATION', 'HOUSEHOLD INFORMATION', 'PREFERENCES', 'REVIEW']

function ProgressBar({ step }) {
  return (
    <div className="mb-5">
      <div className="flex gap-1.5 mb-2">
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
        Step {step} of 5 — {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}

// ── Password strength ──────────────────────────────────────────────────────────

function getStrength(pw) {
  if (!pw) return { score: 0, label: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500']
  return { score, label: labels[score], color: colors[score] }
}

// ── Step 1: Account ────────────────────────────────────────────────────────────

function Step1({ data, set }) {
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const strength = getStrength(data.password)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label required>First name</Label>
          <Input
            placeholder="Laurie"
            value={data.firstName}
            onChange={e => set('firstName', e.target.value)}
          />
        </div>
        <div>
          <Label required>Last name</Label>
          <Input
            placeholder="Noubissie"
            value={data.lastName}
            onChange={e => set('lastName', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label required>Email address</Label>
        <Input
          type="email"
          placeholder="laurienoubissie@gmail.com"
          value={data.email}
          onChange={e => set('email', e.target.value)}
        />
      </div>

      <div>
        <Label required>Phone number</Label>
        <Input
          type="tel"
          placeholder="+237 691223122"
          value={data.phone}
          onChange={e => set('phone', e.target.value)}
        />
        <p className="text-[10px] text-[#8A7E74] mt-1">Format: +237 6XX XXX XXX</p>
      </div>

      <div>
        <Label required>Password</Label>
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
        <Label required>Confirm password</Label>
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

      <label className="flex items-start gap-2.5 cursor-pointer">
        <div
          onClick={() => set('agreedTerms', !data.agreedTerms)}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
            data.agreedTerms ? 'bg-[#1E4030] border-[#1E4030]' : 'border-[#BDBDBD] bg-white'
          }`}
        >
          {data.agreedTerms && <Check size={10} strokeWidth={3} className="text-white" />}
        </div>
        <span className="text-xs text-[#8A7E74] leading-relaxed">
          I agree to Carely's{' '}
          <span className="text-[#1E4030] underline cursor-pointer">Terms of Service</span> and{' '}
          <span className="text-[#1E4030] underline cursor-pointer">Privacy Policy</span>.
        </span>
      </label>
    </div>
  )
}

// ── Step 2: Personal Information ───────────────────────────────────────────────

function Step2({ data, set }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date of birth</Label>
          <Input
            type="date"
            value={data.dob}
            onChange={e => set('dob', e.target.value)}
          />
        </div>
        <div>
          <Label>Gender</Label>
          <div className="relative">
            <Select value={data.gender} onChange={e => set('gender', e.target.value)}>
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </Select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A7E74]">
              ▾
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label>City</Label>
        <div className="relative">
          <Select value={data.city} onChange={e => set('city', e.target.value)}>
            <option value="">Select a city</option>
            <option value="Yaounde">Yaounde</option>
            <option value="Douala">Douala</option>
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A7E74]">
            ▾
          </div>
        </div>
      </div>

      <div>
        <Label>Neighborhood / District</Label>
        <Input
          placeholder="Nkolbission"
          value={data.neighborhood}
          onChange={e => set('neighborhood', e.target.value)}
        />
      </div>

      <div>
        <Label>Full address</Label>
        <div className="relative">
          <textarea
            rows={3}
            placeholder="N3, Carrefour Nkolbisson, Yaounde"
            value={data.address}
            onChange={e => set('address', e.target.value)}
            className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all resize-none placeholder:text-[#BDBDBD]"
          />
          <Pencil size={12} className="absolute bottom-3 right-3 text-[#BDBDBD]" />
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Household Information ──────────────────────────────────────────────

const CARE_FOR_OPTIONS = [
  'Child / Children',
  'Elderly person',
  'Person requiring assistance',
  'Household / Home',
  'Person recovering from illness or injury',
  'Other',
]

const PEOPLE_OPTIONS = ['1', '2', '3', '4+']

const SERVICE_OPTIONS = [
  'Childcare / Babysitting',
  'Elderly care',
  'Home assistance',
  'Cleaning',
  'Cooking / Meal preparation',
  'Laundry / Ironing',
  'Companionship',
  'Personal assistance',
  'Other',
]

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
}

function Step3({ data, set }) {
  return (
    <div className="space-y-7">
      <div>
        <h3 className="font-bold text-base text-[#1C1A17] mb-0.5">Tell us about your household</h3>
        <p className="text-xs text-[#8A7E74]">This helps Carely recommend the right providers for your needs.</p>
      </div>

      <div>
        <Label>Who are you looking for care/service for?</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {CARE_FOR_OPTIONS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.careFor.includes(opt)}
              onClick={() => set('careFor', toggle(data.careFor, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>How many people require the service?</Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {PEOPLE_OPTIONS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.peopleCount === opt}
              onClick={() => set('peopleCount', opt)}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>What type of service are you looking for?</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {SERVICE_OPTIONS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.services.includes(opt)}
              onClick={() => set('services', toggle(data.services, opt))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Step 4: Preferences ────────────────────────────────────────────────────────

const FREQUENCY_OPTIONS = [
  'One-time service', 'Daily',
  'Several times per week', 'Weekly',
  'Monthly', 'Flexible',
]

const TIME_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Night', 'Flexible']

const PRIORITY_OPTIONS = [
  'Experience', 'Professional certification',
  'Good ratings and reviews', 'Availability',
  'Location proximity', 'Affordable price',
  'Previous experience with children', 'Previous experience with elderly people',
  'First-aid knowledge', 'Background verification',
  'Good communication', 'Other',
]

function Step4({ data, set }) {
  return (
    <div className="space-y-7">
      <div>
        <Label>How often do you need the service?</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {FREQUENCY_OPTIONS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.frequency.includes(opt)}
              onClick={() => set('frequency', toggle(data.frequency, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>When do you usually need the service?</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {TIME_OPTIONS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.times.includes(opt)}
              onClick={() => set('times', toggle(data.times, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>What is important to you when choosing a provider?</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {PRIORITY_OPTIONS.map(opt => (
            <OptionBtn
              key={opt}
              label={opt}
              selected={data.priorities.includes(opt)}
              onClick={() => set('priorities', toggle(data.priorities, opt))}
            />
          ))}
        </div>
      </div>

      <div>
        <Label>Anything else we should know?</Label>
        <div className="relative mt-1">
          <textarea
            rows={4}
            placeholder="Optional details about your schedule or preferences"
            value={data.notes}
            onChange={e => set('notes', e.target.value)}
            className="w-full px-4 py-3 border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E4030]/30 focus:border-[#1E4030] transition-all resize-none placeholder:text-[#BDBDBD]"
          />
          <Pencil size={12} className="absolute bottom-3 right-3 text-[#BDBDBD]" />
        </div>
      </div>
    </div>
  )
}

// ── Step 5: Review ─────────────────────────────────────────────────────────────

function ReviewCard({ title, onEdit, rows }) {
  return (
    <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-[#1C1A17]">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-[#1E4030] underline hover:text-[#152e22] transition-colors cursor-pointer"
        >
          Edit
        </button>
      </div>
      <div className="space-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="grid grid-cols-[130px_1fr] gap-2 text-xs">
            <span className="text-[#8A7E74] font-medium">{label}</span>
            <span className="text-[#E29578] font-medium">{value || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Step5({ data, goTo }) {
  return (
    <div className="space-y-4">
      <ReviewCard
        title="Personal & contact information"
        onEdit={() => goTo(1)}
        rows={[
          { label: 'Name', value: `${data.firstName} ${data.lastName}` },
          { label: 'Email', value: data.email },
          { label: 'Phone', value: data.phone },
          { label: 'Date of birth', value: data.dob },
          { label: 'Gender', value: data.gender },
        ]}
      />
      <ReviewCard
        title="Location"
        onEdit={() => goTo(2)}
        rows={[
          { label: 'City', value: data.city },
          { label: 'Neighborhood', value: data.neighborhood },
          { label: 'Address', value: data.address },
        ]}
      />
      <ReviewCard
        title="Household information"
        onEdit={() => goTo(3)}
        rows={[
          { label: 'Care for', value: data.careFor.join(', ') },
          { label: 'People', value: data.peopleCount },
          { label: 'Services', value: data.services.join(', ') },
        ]}
      />
      <ReviewCard
        title="Preferences"
        onEdit={() => goTo(4)}
        rows={[
          { label: 'Frequency', value: data.frequency.join(', ') },
          { label: 'Times', value: data.times.join(', ') },
          { label: 'Priorities', value: data.priorities.join(', ') },
        ]}
      />
    </div>
  )
}

// ── Main Register component ────────────────────────────────────────────────────

const initialData = {
  // Step 1
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreedTerms: false,
  // Step 2
  dob: '',
  gender: '',
  city: '',
  neighborhood: '',
  address: '',
  // Step 3
  careFor: [],
  peopleCount: '',
  services: [],
  // Step 4
  frequency: [],
  times: [],
  priorities: [],
  notes: '',
}

export default function Register({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [submitted, setSubmitted] = useState(false)

  const set = (key, value) => setData(prev => ({ ...prev, [key]: value }))

  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => setStep(s => Math.max(s - 1, 1))
  const goTo = (s) => setStep(s)

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      onNavigate('household')
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 bg-[#EDF7F2] rounded-full flex items-center justify-center mx-auto border border-green-200">
            <Check size={28} className="text-[#1E4030]" strokeWidth={2.5} />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">Account created!</h2>
          <p className="text-sm text-[#8A7E74]">Welcome to Carely. Redirecting you to your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top header */}
      <header className="bg-[#FAF8F5] border-b border-[#E2D9CF] px-6 lg:px-12 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#1E4030] rounded-xl flex items-center justify-center shadow-sm">
            <Heart size={17} className="fill-white text-[#1E4030]" />
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
            Create your Carely account
          </h1>
          <p className="text-xs text-[#8A7E74]">
            Create an account to find trusted service providers for your{' '}
            <span className="text-[#E29578] font-medium">household.</span>
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
              {step === 5 && <Step5 data={data} goTo={goTo} />}
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

              {step < 5 ? (
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
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-[#1E4030] hover:bg-[#152e22] px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Create My Carely Account
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
