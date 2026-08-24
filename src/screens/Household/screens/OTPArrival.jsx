import { useState, useEffect } from 'react'
import { ArrowLeft, User, Shield, Clock, RefreshCw, CheckCircle2 } from 'lucide-react'
import { CAREGIVERS } from '../../../data'

const CAREGIVER = CAREGIVERS[0]
const OTP_CODE = '847293'

function OTPDisplay({ code }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {code.split('').map((d, i) => (
        <div
          key={i}
          className="w-14 h-16 lg:w-16 lg:h-20 bg-secondary border-2 border-border rounded-2xl flex items-center justify-center"
        >
          <span className="font-display text-3xl lg:text-4xl font-bold text-primary">{d}</span>
        </div>
      ))}
    </div>
  )
}

export default function OTPArrival({ onNavigate }) {
  const c = CAREGIVER
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 37)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const isExpiring = timeLeft < 5 * 60

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-md mx-auto px-4 py-12">
        <button
          onClick={() => onNavigate('confirmed')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Session info */}
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
            <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{c.name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={10} />
              Monday Aug 4, 2026 &middot; 09:00 – 12:00
            </p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full shrink-0">
            <CheckCircle2 size={9} />
            In Progress
          </span>
        </div>

        {/* OTP header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-primary mb-2">Arrival Code</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            Share this code with {c.name.split(' ')[0]} when they arrive. They will enter it in their app to confirm their presence.
          </p>
        </div>

        {/* OTP display */}
        <div className="bg-card rounded-2xl border border-border p-8 mb-4 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <Clock size={13} className="text-muted-foreground" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Code valid for
            </p>
          </div>
          <OTPDisplay code={OTP_CODE} />
          <div className={`text-2xl font-mono font-bold mt-5 tabular-nums ${isExpiring ? 'text-red-500' : 'text-foreground'}`}>
            {mins}:{secs}
          </div>
          {isExpiring && (
            <div className="text-xs mt-1 text-red-500 flex items-center justify-center gap-1">
              <Clock size={11} />
              Code expiring soon
            </div>
          )}
        </div>

        <div className="bg-secondary rounded-xl p-4 mb-6 text-sm text-center text-muted-foreground">
          Once {c.name.split(' ')[0]} enters the code, your session officially starts at the recorded time.
        </div>

        {/* What the OTP does */}
        <div className="space-y-3 mb-8">
          <h3 className="text-sm font-semibold text-foreground">What is this code for?</h3>
          {[
            { Icon: User,     text: `Confirms it is really ${c.name} — your booked caregiver — not a substitute.` },
            { Icon: Clock,    text: 'Records the exact session start time for accurate hourly billing.' },
            { Icon: Shield,   text: 'Protects both parties: you know they arrived, they have proof of presence.' },
          ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-border">
                <Icon size={14} className="text-primary" />
              </div>
              <p className="text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button className="flex-1 border border-border text-muted-foreground text-sm font-medium py-3 rounded-xl hover:bg-secondary transition-colors inline-flex items-center justify-center gap-1.5">
            <RefreshCw size={13} />
            Refresh Code
          </button>
          <button
            onClick={() => onNavigate('completion')}
            className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={14} />
            Session Complete
          </button>
        </div>
      </div>
    </div>
  )
}
