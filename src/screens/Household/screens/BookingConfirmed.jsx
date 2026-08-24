import {
  CheckCircle2, MapPin, Clock, Calendar, Wallet, Lock, ArrowRight, Shield
} from 'lucide-react'
import { CAREGIVERS } from '../../../data'
import { Stars } from '../../../components/Icons'

const CAREGIVER = CAREGIVERS[0]

const SCHEDULE = [
  { date: 'Mon Aug 4, 2026', time: '09:00 – 12:00' },
  { date: 'Wed Aug 6, 2026', time: '09:00 – 12:00' },
  { date: 'Fri Aug 8, 2026', time: '09:00 – 12:00' },
]

export default function BookingConfirmed({ onNavigate }) {
  const c = CAREGIVER

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-200">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-green-200">
            <CheckCircle2 size={11} />
            Booking Confirmed
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-primary mb-2">
            Your caregiver is booked
          </h1>
          <p className="text-muted-foreground text-sm">
            Ref. #CRL-2026-08-471 &middot; Confirmed July 28, 2026 at 14:32
          </p>
        </div>

        <div className="space-y-4">
          {/* Caregiver */}
          <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary shrink-0">
              <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">{c.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Stars rating={c.rating} size={11} />
                <span className="text-xs text-muted-foreground">Certified Nurse</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{c.location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1 justify-end">
                <Clock size={11} />
                Responds in
              </div>
              <div className="text-sm font-medium text-foreground">{c.responseTime}</div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar size={15} className="text-primary" />
                Confirmed Schedule
              </h3>
              <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full">
                {SCHEDULE.length} sessions &middot; Mon/Wed/Fri
              </span>
            </div>
            <div className="space-y-2.5">
              {SCHEDULE.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-secondary rounded-xl">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{s.date}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={10} />
                      {s.time}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={9} />
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wallet size={15} className="text-primary" />
              Payment Breakdown
            </h3>
            <div className="space-y-2.5 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">3,500 XAF x 3h x 3 sessions</span>
                <span className="font-medium">31,500 XAF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span className="font-medium">1,500 XAF</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-base pt-3 border-t border-border mb-4">
              <span>Total</span>
              <span className="text-primary">33,000 XAF</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-warning-bg border border-[#FDE68A] rounded-xl">
                <div className="flex items-center gap-2">
                  <Wallet size={15} className="text-warning shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-warning">Week 1 &middot; In Escrow</p>
                    <p className="text-xs text-warning/80">MTN Mobile Money &middot; xxxx 8821</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-warning">11,500 XAF</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Weeks 2–3 &middot; Not yet charged</p>
                    <p className="text-xs text-muted-foreground">Charged week by week</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-muted-foreground">21,500 XAF</span>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-secondary rounded-2xl p-5">
            <h3 className="font-semibold text-foreground mb-3">Next Steps</h3>
            <div className="space-y-3 text-sm">
              {[
                { Icon: Calendar, text: 'The Monday Aug 4 session is confirmed at 09:00.' },
                { Icon: Lock, text: 'On the morning of each session, your app generates an OTP code to give to the caregiver upon arrival.' },
                { Icon: CheckCircle2, text: 'After the service, you confirm or report an issue within 24 hours.' },
              ].map(({ Icon, text }, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 bg-card rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-border">
                    <Icon size={13} className="text-primary" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('otp')}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm inline-flex items-center justify-center gap-2"
            >
              View Session OTP Code
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('search')}
              className="flex-1 border border-border text-foreground font-medium py-3.5 rounded-xl hover:bg-secondary transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
