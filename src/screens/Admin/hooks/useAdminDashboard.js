import { useState, useEffect } from 'react';
import {
  initialDisputes,
  initialUsers,
  initialBookings,
  initialRecentActivity,
  initialRevenueStats
} from '../data/mockAdminData';
import {
  fetchPendingApplications,
  fetchAllUsers,
  approveApplication as apiApprove,
  rejectApplication as apiReject,
  toggleUser2FA as apiToggleUser2FA,
} from '../../../services/admin.service.js';

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data States
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [users, setUsers] = useState(initialUsers);
  const [bookings, setBookings] = useState(initialBookings);
  const [recentActivity, setRecentActivity] = useState(initialRecentActivity);
  const [revenueStats, setRevenueStats] = useState(initialRevenueStats);

  // Modals & Triggers
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  // Filtering & Search
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All roles');
  const [userStatusFilter, setUserStatusFilter] = useState('All statuses');

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Critical SLA Dispute', desc: 'SLA breached on BK-20431 (Mme Onana vs Patrick Nguema)', time: '2h ago', unread: true },
    { id: 'n2', title: 'New Application', desc: 'Kwame Mensah submitted caregiver credentials', time: '6h ago', unread: true },
    { id: 'n3', title: 'Late Arrival Reported', desc: 'BK-20460: Client flagged caregiver arrival at 09:45', time: '20h ago', unread: true },
    { id: 'n4', title: 'System Security Alert', desc: 'Backup completed successfully', time: '1d ago', unread: false },
    { id: 'n5', title: 'SLA Warning', desc: 'Dispute BK-20452 is nearing response deadline', time: '1d ago', unread: true }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Add notification count (badge "9" in design is static to match design)
  const unreadCount = 9;

  // ── Fetch real pending applications & users on mount & tab switch ────────
  useEffect(() => {
    loadApplications();
    loadUsers();
    const handleFocus = () => {
      loadApplications();
      loadUsers();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [activeTab]);

  const loadApplications = async () => {
    setApplicationsLoading(true);
    try {
      const real = await fetchPendingApplications();
      setApplications(real);
    } catch (err) {
      console.warn('Could not load applications from API:', err.message);
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const realUsers = await fetchAllUsers();
      if (realUsers && realUsers.length > 0) {
        setUsers(realUsers);
      }
    } catch (err) {
      console.warn('Could not load users from API:', err.message);
    }
  };

  const addActivity = (text, subtext, iconType) => {
    const newAct = {
      id: 'ACT' + Date.now(),
      type: 'custom',
      text,
      subtext,
      time: 'Just now',
      iconType
    };
    setRecentActivity(prev => [newAct, ...prev]);
  };

  // ── Applications Actions (wired to real backend API) ──────────────────────
  const approveApplication = async (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    try {
      await apiApprove(appId);

      // Update in-memory application status
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, approvalStatus: 'approved', status: 'approved' } : a
      ));

      // Mirror to Users list
      const newUser = {
        id: 'USR' + Date.now(),
        name: app.name,
        email: app.email,
        role: 'Provider',
        city: app.location,
        joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
        status: 'Active',
        initials: app.initials,
        dob: app.dob,
        gender: app.gender,
        profession: app.profession || app.category,
        experience: app.experience,
        hourlyRate: app.hourlyRate || app.pricePerHour || 50,
        serviceRadius: app.serviceRadius || '15 km'
      };
      setUsers(prev => [newUser, ...prev]);

      addActivity(
        'Application Approved',
        `${app.name} will receive a 25 XAF subscription payment request`,
        'application'
      );
    } catch (err) {
      console.error('Approve failed:', err.message);
      addActivity('Approval Error', `Could not approve ${app.name}: ${err.message}`, 'cancelled');
    }

    setSelectedApplication(null);
  };

  const rejectApplication = async (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    try {
      await apiReject(appId);
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, approvalStatus: 'rejected', status: 'rejected' } : a
      ));
      addActivity('Application Rejected', `Declined credentials for ${app.name}`, 'cancelled');
    } catch (err) {
      console.error('Reject failed:', err.message);
    }

    setSelectedApplication(null);
  };

  const askForInfo = (appId) => {
    addActivity('Requested Information', 'Sent details request to applicant', 'payout');
    setSelectedApplication(null);
  };

  // ── Disputes Actions ──────────────────────────────────────────────────────
  const resolveDispute = (disputeId, refundToClientPercent) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    setDisputes(prev => prev.filter(d => d.id !== disputeId));
    setBookings(prev => prev.map(b => {
      if (b.id === dispute.id) {
        return { ...b, status: refundToClientPercent === 100 ? 'Refunded' : 'Paid (Partial)' };
      }
      return b;
    }));

    const text = refundToClientPercent === 100
      ? 'Dispute Resolved — Full Refund'
      : refundToClientPercent === 0
        ? 'Dispute Resolved — Payout Released'
        : 'Dispute Resolved — Split Settlement';

    addActivity(text, `${dispute.id}: Escrow of ${dispute.escrowAmount} resolved`, 'completed');
    setSelectedDispute(null);
  };

  // ── Users Actions ─────────────────────────────────────────────────────────
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        addActivity('User Status Changed', `${u.name} status updated to ${nextStatus}`, 'dispute');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const toggleUser2FA = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const nextState = !user.twoFactor;

    // Optimistic UI update
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, twoFactor: nextState } : u)));

    try {
      await apiToggleUser2FA(userId, nextState);
      addActivity(
        `User 2FA ${nextState ? 'Enabled' : 'Disabled'}`,
        `${user.name || user.email} 2FA security status updated to ${nextState ? 'Active' : 'Off'}`,
        'completed'
      );
    } catch (err) {
      console.error('Failed to toggle user 2FA on server:', err);
      // Rollback on error
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, twoFactor: !nextState } : u)));
      addActivity(
        '2FA Update Failed',
        `Could not update 2FA status for ${user.name}: ${err.message}`,
        'cancelled'
      );
    }
  };

  const deleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addActivity('User Account Deleted', `Removed account: ${user.name}`, 'cancelled');
    }
  };

  const editUser = (userId, updatedData) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, ...updatedData };
      }
      return u;
    }));
    setEditUserModalOpen(false);
    setSelectedUser(null);
  };

  return {
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    applications,
    applicationsLoading,
    disputes,
    users,
    bookings,
    recentActivity,
    revenueStats,
    selectedApplication,
    setSelectedApplication,
    selectedDispute,
    setSelectedDispute,
    selectedUser,
    setSelectedUser,
    selectedBooking,
    setSelectedBooking,
    editUserModalOpen,
    setEditUserModalOpen,
    appSearchQuery,
    setAppSearchQuery,
    appStatusFilter,
    setAppStatusFilter,
    appServiceFilter: appStatusFilter,
    setAppServiceFilter: setAppStatusFilter,
    userSearchQuery,
    setUserSearchQuery,
    userRoleFilter,
    setUserRoleFilter,
    userStatusFilter,
    setUserStatusFilter,
    notifications,
    setNotifications,
    notificationsOpen,
    setNotificationsOpen,
    unreadCount,
    approveApplication,
    rejectApplication,
    askForInfo,
    resolveDispute,
    toggleUserStatus,
    toggleUser2FA,
    deleteUser,
    editUser
  };
}
