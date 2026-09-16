import React, { useState, useEffect } from 'react'
import { CAREGIVER_CONSTANTS } from '../constants/dashboardConstants'
import { getStoredUser, getUserDisplayName, getUserInitials, getAvatarUrl } from '../../../services/api.js'

export default function ProfileDropdown({ onClick }) {
  const [user, setUser] = useState(getStoredUser())

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setUser(e.detail)
    }
    window.addEventListener('carely_user_updated', handleUpdate)
    return () => window.removeEventListener('carely_user_updated', handleUpdate)
  }, [])

  const displayName = getUserDisplayName(user, CAREGIVER_CONSTANTS.DEFAULT_CAREGIVER_NAME)
  const initials = getUserInitials(user, 'CG')
  const avatarUrl = getAvatarUrl(user?.photoUrl)

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E2D9CF] pl-1.5 pr-3.5 py-1 rounded-full cursor-pointer hover:border-[#1E4030] transition-colors"
      title="Open Profile Settings"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className="w-8 h-8 rounded-full object-cover border border-[#E2D9CF] shrink-0"
        />
      ) : user ? (
        <div className="w-8 h-8 rounded-full bg-[#1E4030] text-white flex items-center justify-center text-xs font-bold font-display shrink-0">
          {initials}
        </div>
      ) : (
        <img
          src={CAREGIVER_CONSTANTS.DEFAULT_AVATAR}
          alt={CAREGIVER_CONSTANTS.DEFAULT_FULL_NAME}
          className="w-8 h-8 rounded-full object-cover border border-[#E2D9CF] shrink-0"
        />
      )}
      <span className="text-xs font-semibold text-[#1C1A17] hidden md:inline">
        {displayName}
      </span>
    </button>
  )
}

