import { useState } from 'react'
import {
  ArrowLeft, Check, Clock, MapPin, Star as StarIcon,
  Stethoscope, Baby, Sparkles, Calendar, Shield
} from 'lucide-react'
import { CAREGIVERS, SPECIALTY_META } from '../../../data'
import { Stars } from '../../../components/Icons'

const CAREGIVER = CAREGIVERS[0]

const SPECIALTY_ICON_MAP = { nursing: Stethoscope, babysitting: Baby, cleaning: Sparkles }

const AVAIL_CALENDAR = [
  { date: 'Mon Jul 28', slots: ['09:00', '14:00', '17:00'] },
  { date: 'Tue Jul 29', slots: ['10:00', '13:00'] },
  { date: 'Wed Jul 30', slots: [] },
  { date: 'Thu Jul 31', slots: ['09:00', '11:00', '16:00', '18:00'] },
  { date: 'Fri Aug 1',  slots: ['09:00', '15:00'] },
  { date: 'Sat Aug 2',  slots: ['10:00', '12:00'] },
  { date: 'Sun Aug 3',  slots: [] },
]

export default function Profile({ onNavigate }) {
  const c = CAREGIVER
  const meta = SPECIALTY_META[c.specialty]
  const SpecialtyIcon = SPECIALTY_ICON_MAP[c.specialty]
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 lg:px-12 pt-6">
          <button
            onClick={() => onNavigate('search')}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
            Back to search
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-0 lg:gap-10 px-4 lg:px-12 py-6">
          {/* Left */}
          <div>
            {/* Hero card */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden mb-5">
              <div className="relative h-48 lg:h-64 bg-secondary">
                <img src={c.photo} alt={c.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <SpecialtyIcon size={10} />
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                          <Check size={9} strokeWidth={3} />
                          Available
                        </span>
                      </div>
                      <h1 className="font-display text-2xl lg:text-3xl font-semibold text-white">{c.name}</h1>
                      <div className="flex items-center gap-1.5 text-white/70 text-sm mt-1">
                        <MapPin size={13} />
                        {c.location}
                        <span className="mx-1">&middot;</span>
                        {c.experience} years experience
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-2xl font-bold text-white">{c.pricePerHour.toLocaleString()}</div>
                      <div className="text-white/60 text-xs">XAF / hour</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Stars rating={c.rating} size={14} />
                    <span className="font-bold text-foreground">{c.rating}</span>
                    <span className="text-muted-foreground text-sm">({c.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock size={13} />
                    <span>Responds in {c.responseTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {c.certifications.map(cert => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-secondary text-secondary-foreground border border-border px-3 py-1.5 rounded-full"
                    >
                      <Check size={10} strokeWidth={3} className="text-primary" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-5">
              {[
                { id: 'about', label: 'About', Icon: StarIcon },
                { id: 'reviews', label: 'Reviews', Icon: StarIcon },
                { id: 'availability', label: 'Availability', Icon: Calendar },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-3">Introduction</h3>
                  <p className="text-foreground leading-relaxed">{c.bio}</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-3">Languages Spoken</h3>
                  <div className="flex flex-wrap gap-2">
                    {c.languages.map(l => (
                      <span key={l} className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm">{l}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-3">Service Area</h3>
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin size={16} className="text-primary" />
                    <span>{c.serviceArea}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-display text-4xl font-semibold text-primary">{c.rating}</div>
                      <Stars rating={c.rating} size={14} />
                      <div className="text-xs text-muted-foreground mt-1">{c.reviewCount} reviews</div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map(star => {
                        const pct = star === 5 ? 78 : star === 4 ? 17 : star === 3 ? 4 : 1
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-4">{star}</span>
                            <StarIcon size={10} className="text-accent fill-accent" />
                            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {c.reviews.map((r, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                          {r.author[0]}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{r.author}</div>
                          <div className="text-xs text-muted-foreground">{r.date}</div>
                        </div>
                      </div>
                      <Stars rating={r.rating} size={12} />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4">Availability This Week</h3>
                <div className="space-y-3">
                  {AVAIL_CALENDAR.map(day => (
                    <div key={day.date} className="flex items-center gap-4">
                      <div className="w-24 shrink-0 text-sm text-muted-foreground">{day.date}</div>
                      {day.slots.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">Not available</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {day.slots.map(slot => (
                            <span key={slot} className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-lg">
                              {slot}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                  Displayed slots are available session start times. Minimum booking is 2 hours.
                </p>
              </div>
            )}
          </div>

          {/* Right: booking panel */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-display text-2xl font-semibold text-primary">{c.pricePerHour.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">XAF / hour</div>
                </div>
                <div className="text-right">
                  <Stars rating={c.rating} size={13} />
                  <div className="text-xs text-muted-foreground">{c.reviewCount} reviews</div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Preferred Date</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="date" className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Start</label>
                    <div className="relative">
                      <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="time" className="w-full pl-9 pr-2 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">End</label>
                    <div className="relative">
                      <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input type="time" className="w-full pl-9 pr-2 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-3 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">3,500 XAF x 3h</span>
                  <span className="font-medium text-foreground">10,500 XAF</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="font-medium text-foreground">500 XAF</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-border mt-2">
                  <span>Total</span>
                  <span className="text-primary">11,000 XAF</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('booking')}
                className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-all text-sm"
              >
                Continue to Booking
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">No payment is charged now</p>
            </div>

            <div className="mt-4 bg-secondary rounded-xl p-4 text-center flex items-center justify-center gap-2">
              <Shield size={14} className="text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Secure escrow payment &middot; Funds released only after you confirm the service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: sticky book button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 flex items-center gap-4">
        <div>
          <div className="font-display text-lg font-bold text-primary">{c.pricePerHour.toLocaleString()} XAF</div>
          <div className="text-xs text-muted-foreground">per hour</div>
        </div>
        <button
          onClick={() => onNavigate('booking')}
          className="flex-1 bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          Book Now
        </button>
      </div>
      <div className="lg:hidden h-24"></div>
    </div>
  )
}
