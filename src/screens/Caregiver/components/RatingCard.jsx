import React from 'react'
import { Star } from 'lucide-react'

export default function RatingCard({ rating = 0, reviewCount = 0 }) {
  const numRating = Number(rating || 0)
  const displayRating = reviewCount > 0 ? numRating.toFixed(1) : '—'
  const roundedRating = reviewCount > 0 ? Math.round(numRating) : 0

  return (
    <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1">
            <span className="text-3xl font-extrabold text-[#1C1A17]">{displayRating}</span>
            <span className="text-sm font-bold text-[#8A7E74]">/ 5</span>
          </div>
          <p className="text-[10px] text-[#8A7E74] font-bold tracking-wide uppercase mt-1">Overall Rating</p>
        </div>
        <div className="h-10 w-px bg-[#EFECE6] hidden md:block"></div>
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-0.5 text-amber-500">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={16}
                className={i < roundedRating ? "fill-amber-500 text-amber-500" : "text-[#E2D9CF]"}
              />
            ))}
          </div>
          <p className="text-xs text-[#8A7E74] font-medium mt-1">
            {reviewCount > 0 ? `Based on ${reviewCount} verified client review${reviewCount > 1 ? 's' : ''}` : 'No client reviews yet'}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <span className="bg-[#EDF7F2] text-[#1E4030] border border-green-200 text-xs font-bold px-3 py-1.5 rounded-full">
          {reviewCount > 0 ? '100% Recommendation Rate' : 'New Verified Provider'}
        </span>
      </div>
    </div>
  )
}
