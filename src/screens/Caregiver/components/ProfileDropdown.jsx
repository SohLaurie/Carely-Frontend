import React from 'react'
import { CAREGIVER_CONSTANTS } from '../constants/dashboardConstants'

export default function ProfileDropdown() {
  return (
    <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E2D9CF] pl-1.5 pr-3.5 py-1 rounded-full">
      <img
        src={CAREGIVER_CONSTANTS.DEFAULT_AVATAR}
        alt={CAREGIVER_CONSTANTS.DEFAULT_FULL_NAME}
        className="w-8 h-8 rounded-full object-cover border border-[#E2D9CF] shrink-0"
      />
      <span className="text-xs font-semibold text-[#1C1A17] hidden md:inline">
        {CAREGIVER_CONSTANTS.DEFAULT_CAREGIVER_NAME}
      </span>
    </div>
  )
}
