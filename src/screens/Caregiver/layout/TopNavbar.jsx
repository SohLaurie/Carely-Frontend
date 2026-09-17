import React, { useState, useEffect } from 'react'
import { Menu, Bell, ShieldCheck, ClipboardList, Calendar, Clock, Wallet, Star, User } from 'lucide-react'
import { CAREGIVER_CONSTANTS } from '../constants/dashboardConstants'
import NotificationBell from '../components/NotificationBell'
import ProfileDropdown from '../components/ProfileDropdown'

import { getStoredUser, getUserDisplayName } from '../../../services/api.js'
import { fetchCurrentProfile } from '../../../services/auth.service.js'

export default function TopNavbar({
  activeTab,
  setSidebarOpen,
  notificationsCount,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onReplyClick,
  onViewAllNotifications,
  onProfileClick
}) {
  const [user, setUser] = useState(getStoredUser())

  useEffect(() => {
    fetchCurrentProfile().then(fresh => {
      if (fresh) setUser(fresh)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) setUser(e.detail)
    }
    window.addEventListener('carely_user_updated', handleUpdate)
    return () => window.removeEventListener('carely_user_updated', handleUpdate)
  }, [])

  const caregiverName = getUserDisplayName(user, CAREGIVER_CONSTANTS.DEFAULT_CAREGIVER_NAME)

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'overview':
        return {
          title: 'Overview',
          subtitle: `Welcome back, ${caregiverName}. Here's what's happening today.`
        }

      case 'requests':
        return {
          title: 'Incoming Requests',
          subtitle: 'Household identities are partially hidden until you accept, for their privacy.',
          Icon: ClipboardList
        }
      case 'bookings':
        return {
          title: 'My Bookings',
          subtitle: 'Active, upcoming and past sessions.',
          Icon: Calendar
        }
      case 'calendar':
        return {
          title: 'Calendar',
          subtitle: 'Tap open days to mark yourself available or blocked. Booked sessions are locked.',
          Icon: Calendar
        }
      case 'earnings':
        return {
          title: 'Earnings',
          subtitle: 'Your payouts and pending balance.',
          Icon: Wallet
        }
      case 'reviews':
        return {
          title: 'Reviews',
          subtitle: 'Ratings and feedback left by families you cared for.',
          Icon: Star
        }
      case 'notifications':
        return {
          title: 'Notifications',
          subtitle: 'Requests, messages, payouts and reminders.',
          Icon: Bell
        }
      case 'profile':
        return {
          title: 'My Profile & Information',
          subtitle: 'Manage your professional provider details, specialties, and contact credentials.',
          Icon: User
        }
      default:
        return {
          title: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
          subtitle: ''
        }
    }
  }

  const headerInfo = getHeaderInfo()
  const HeaderIcon = headerInfo.Icon

  return (
    <header className="bg-white border-b border-[#E2D9CF] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-[#1C1A17] hover:text-primary cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-3">
          {HeaderIcon && (
            <div className="w-9 h-9 rounded-full bg-[#EFECE6] border border-[#E2D9CF] flex items-center justify-center text-[#1E4030] shrink-0">
              <HeaderIcon size={16} />
            </div>
          )}
          <div>
            <h1 className="font-display text-base font-bold text-[#1C1A17] leading-none">
              {headerInfo.title}
            </h1>
            {headerInfo.subtitle && (
              <p className="text-[10px] text-[#8A7E74] mt-0.5">
                {headerInfo.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#8A7E74]">
          <ShieldCheck size={14} className="text-[#1D6F42]" />
          <span className="font-medium">{CAREGIVER_CONSTANTS.BACKGROUND_CHECK_APPROVED}</span>
        </div>

        {/* Notification bell popover component */}
        <NotificationBell
          count={notificationsCount}
          notifications={notifications}
          onMarkRead={onMarkRead}
          onMarkAllRead={onMarkAllRead}
          onReplyClick={onReplyClick}
          onViewAll={onViewAllNotifications}
        />

        {/* Profile Avatar dropdown component */}
        <ProfileDropdown user={user} onClick={onProfileClick} />
      </div>
    </header>
  )
}
