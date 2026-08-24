import { useState, useEffect } from 'react'
import { CheckCircle2, Star, Shield, AlertTriangle, Clock } from 'lucide-react'
import { CAREGIVERS } from '../../../data'

const CAREGIVER = CAREGIVERS[0]

export default function Completion({ onNavigate }) {
  const c = CAREGIVER
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 41 * 60 + 18)
  const [confirmed, setConfirmed] = useState(false)
  const [disputed, setDisputed] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0')
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')
  const s = (timeLeft % 60).toString().padStart(2, '0')

  if (confirmed) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Star size={36} className="text-accent fill-accent" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-primary mb-3">Payment Released!</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Thank you! The payment has been released to {c.name.split(' ')[0]}. Help them improve by leaving a review.
          </p>
          <button
            onClick={() => onNavigate('review')}
            className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-colors mb-3"
          >
            Leave a Review
          </button>
          <button onClick={() => onNavigate('search')} className="w-full text-muted-foreground text-sm py-2">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (disputed) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shield size={36} className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-primary mb-3">Dispute Opened</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Your dispute has been recorded. Funds remain in escrow. Our team will contact you within 4 business hours.
          </p>
          <div className="bg-secondary rounded-xl p-4 text-left text-sm text-muted-foreground leading-relaxed">
            Dispute ref: <strong className="text-foreground">#DSP-2026-0471</strong><br/>
            Support: <strong className="text-foreground">+237 6 55 00 00 00</strong>
          </div>
          <button onClick={() => onNavigate('search')} className="w-full mt-4 text-muted-foreground text-sm py-2">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Session complete notification */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-5 text-center">
          <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-green-200">
            <CheckCircle2 size={10} />
            Session marked complete
          </div>
          <h1 className="font-display text-xl font-semibold text-primary mb-2">
            {c.name.split(' ')[0]} has marked the session as complete
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed flex items-center justify-center gap-2">
            <Clock size={13} className="text-muted-foreground shrink-0" />
            Monday Aug 4, 2026 &middot; 09:00 – 12:00 &middot; 3h home nursing
          </p>
        </div>

        {/* Caregiver card */}
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary shrink-0">
            <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{c.name}</p>
            <p className="text-xs text-muted-foreground">Nurse &middot; {c.rating} stars</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-sm font-bold text-primary">10,500 XAF</div>
            <div className="text-xs text-muted-foreground">in escrow</div>
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-warning-bg border border-[#FDE68A] rounded-2xl p-5 mb-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={14} className="text-warning" />
            <p className="text-xs font-semibold text-warning uppercase tracking-wider">
              Auto-release in
            </p>
          </div>
          <div className="font-mono text-3xl font-bold text-warning tabular-nums">{h}:{m}:{s}</div>
          <p className="text-xs text-warning/80 mt-2 leading-relaxed">
            If you do not confirm or raise a dispute before expiry, funds are automatically released to the caregiver.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setConfirmed(true)}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:bg-primary/90 transition-all text-sm inline-flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={17} />
            Confirm the Service
          </button>

          <button
            onClick={() => setDisputed(true)}
            className="w-full border-2 border-red-200 text-red-600 font-medium py-3.5 rounded-xl hover:bg-red-50 transition-colors text-sm inline-flex items-center justify-center gap-2"
          >
            <AlertTriangle size={15} />
            Report an Issue / Open a Dispute
          </button>
        </div>

        {/* Explanation */}
        <div className="mt-5 bg-secondary rounded-xl p-4 text-xs text-muted-foreground leading-relaxed space-y-1.5">
          <strong className="text-foreground block mb-2">How it works</strong>
          <div className="flex gap-2">
            <CheckCircle2 size={12} className="text-primary shrink-0 mt-0.5" />
            <span>Confirm — funds released immediately to {c.name.split(' ')[0]} (minus Carely commission).</span>
          </div>
          <div className="flex gap-2">
            <AlertTriangle size={12} className="text-warning shrink-0 mt-0.5" />
            <span>Dispute — funds held, Carely team reviews before any release.</span>
          </div>
          <div className="flex gap-2">
            <Clock size={12} className="text-muted-foreground shrink-0 mt-0.5" />
            <span>Expiry — auto-release if no action taken within {h}h {m}m.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
