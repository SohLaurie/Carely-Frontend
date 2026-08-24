import { useState } from 'react'
import { ArrowLeft, Star, Heart, Check } from 'lucide-react'
import { CAREGIVERS } from '../../../data'
import { Stars } from '../../../components/Icons'

const CAREGIVER = CAREGIVERS[0]

const QUICK_TAGS = [
  'Punctual', 'Professional', 'Gentle with my parent',
  'Clear communication', 'Experienced', 'Discreet', 'Highly recommended',
]

const RATING_LABELS = {
  0: '', 1: 'Disappointing', 2: 'Okay', 3: 'Good', 4: 'Very Good', 5: 'Excellent!',
}

function InteractiveStar({ value, selected, hovered, onHover, onClick }) {
  const filled = value <= (hovered || selected)
  return (
    <button
      className="transition-transform hover:scale-110"
      onMouseEnter={() => onHover(value)}
      onMouseLeave={() => onHover(0)}
      onClick={() => onClick(value)}
    >
      <Star
        size={40}
        className={filled ? 'text-accent fill-accent' : 'text-border fill-border'}
      />
    </button>
  )
}

export default function RateReview({ onNavigate }) {
  const c = CAREGIVER
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggleTag = t =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])

  if (submitted) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-green-200">
            <Heart size={36} className="text-green-600 fill-green-200" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-primary mb-3">Thank you for your review!</h1>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Your review helps other families find the best caregivers and helps {c.name.split(' ')[0]} improve their service.
          </p>
          <div className="bg-card rounded-2xl border border-border p-5 mb-5 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{c.name}</p>
                <Stars rating={rating} size={12} />
              </div>
            </div>
            {comment && <p className="text-sm text-muted-foreground italic">"{comment}"</p>}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedTags.map(t => (
                  <span key={t} className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onNavigate('search')}
            className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-12">
        <button
          onClick={() => onNavigate('completion')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <h1 className="font-display text-2xl font-semibold text-primary mb-1">Rate the Service</h1>
        <p className="text-muted-foreground text-sm mb-8">Your review is read by other families and helps improve the platform.</p>

        <div className="space-y-5">
          {/* Caregiver */}
          <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary shrink-0">
              <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{c.name}</p>
              <p className="text-sm text-muted-foreground">Home Nursing &middot; Mon Aug 4, 2026</p>
              <p className="text-xs text-muted-foreground">09:00 – 12:00 &middot; 3h</p>
            </div>
          </div>

          {/* Star rating */}
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <p className="text-sm font-semibold text-foreground mb-1">Overall Rating</p>
            <p className="text-xs text-muted-foreground mb-5">How did the session go?</p>
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(v => (
                <InteractiveStar
                  key={v}
                  value={v}
                  selected={rating}
                  hovered={hovered}
                  onHover={setHovered}
                  onClick={setRating}
                />
              ))}
            </div>
            <div className={`text-sm font-semibold transition-all ${rating > 0 ? 'text-accent' : 'text-transparent'}`}>
              {RATING_LABELS[hovered || rating] || '—'}
            </div>
          </div>

          {/* Quick tags */}
          {rating > 0 && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-3">
                Highlights <span className="font-normal text-muted-foreground">(optional)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border transition-all ${
                      selectedTags.includes(t)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-foreground hover:border-primary/40'
                    }`}
                  >
                    {selectedTags.includes(t) && <Check size={10} strokeWidth={3} />}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          {rating > 0 && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="text-sm font-semibold text-foreground mb-3">
                Comment <span className="font-normal text-muted-foreground">(optional)</span>
              </p>
              <textarea
                placeholder={`Share your experience with ${c.name.split(' ')[0]}. Your review helps other families make confident choices.`}
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">{comment.length}/500</p>
            </div>
          )}

          <button
            onClick={() => rating > 0 && setSubmitted(true)}
            disabled={rating === 0}
            className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {rating === 0 ? 'Give a rating to continue' : 'Publish My Review'}
          </button>

          <button onClick={() => onNavigate('search')} className="w-full text-muted-foreground text-sm py-2 hover:text-foreground transition-colors">
            Skip — rate later
          </button>
        </div>
      </div>
    </div>
  )
}
