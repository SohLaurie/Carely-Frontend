import {
  initialNotifications,
  initialRequests,
  upcomingBookings,
  payoutHistory,
  caregiverReviews,
  initialDayStates,
  initialWorkingHours
} from '../data/mockDashboardData';

/**
 * Service to simulate caregiver dashboard requests/actions.
 */
export const caregiverDashboardService = {
  getNotifications: async () => {
    return [...initialNotifications];
  },

  getRequests: async () => {
    return [...initialRequests];
  },

  getBookings: async () => {
    return [...upcomingBookings];
  },

  getPayoutHistory: async () => {
    return [...payoutHistory];
  },

  getReviews: async () => {
    return [...caregiverReviews];
  },

  getDayStates: async () => {
    return { ...initialDayStates };
  },

  getWorkingHours: async () => {
    return { ...initialWorkingHours };
  }
};
