// Central specialty icon map — import SpecialtyIcon anywhere needed
import { Stethoscope, Baby, Sparkles } from 'lucide-react'

export const SPECIALTY_ICONS = {
  nursing: Stethoscope,
  babysitting: Baby,
  cleaning: Sparkles,
}

// Helper: renders the right specialty icon
export function SpecialtyIcon({ specialty, size = 14, ...props }) {
  const Icon = SPECIALTY_ICONS[specialty]
  if (!Icon) return null
  return <Icon size={size} {...props} />
}

// Star rating component using Lucide Star
import { Star } from 'lucide-react'

export function Stars({ rating, size = 14 }) {
  const full = Math.floor(rating)
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          className={i <= full ? 'text-accent fill-accent' : 'text-border fill-border'}
        />
      ))}
    </span>
  )
}
