import { useState } from 'react';
import {
  initialApplications,
  initialDisputes,
  initialUsers,
  initialBookings,
  initialRecentActivity,
  initialRevenueStats
} from '../data/mockAdminData';

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data States
  const [applications, setApplications] = useState(initialApplications);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [users, setUsers] = useState(initialUsers);
  const [bookings, setBookings] = useState(initialBookings);
  const [recentActivity, setRecentActivity] = useState(initialRecentActivity);
  const [revenueStats, setRevenueStats] = useState(initialRevenueStats);

  // Modals & Triggers
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);

  // Filtering & Search
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appServiceFilter, setAppServiceFilter] = useState('All services');
  
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

  // Notifications toggle helper
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Add notification count (badge "9" in image matches total notifications or unread count)
  const unreadCount = 9; // static or dynamic matching the design badge. We will display 9 by default to look 100% identical.

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

  // Applications Actions
  const approveApplication = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    // Remove from applications queue
    setApplications(prev => prev.filter(a => a.id !== appId));
    
    // Add to Users list
    const newUser = {
      id: 'USR' + Date.now(),
      name: app.name,
      email: app.email,
      role: 'Caregiver',
      city: app.location,
      joined: 'Mar 2026',
      status: 'Active',
      initials: app.initials
    };
    setUsers(prev => [newUser, ...prev]);

    // Add recent activity log
    addActivity(`Application Approved`, `${app.name} is now an active Caregiver`, 'application');
    
    // Close modal
    setSelectedApplication(null);
  };

  const rejectApplication = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    setApplications(prev => prev.filter(a => a.id !== appId));
    addActivity(`Application Rejected`, `Declined credentials for ${app.name}`, 'cancelled');
    setSelectedApplication(null);
  };

  const askForInfo = (appId) => {
    addActivity(`Requested Information`, `Sent details request to applicant`, 'payout');
    setSelectedApplication(null);
  };

  // Disputes Actions
  const resolveDispute = (disputeId, refundToClientPercent) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    // Remove from disputes list or change status
    setDisputes(prev => prev.filter(d => d.id !== disputeId));

    // Update matching booking status
    setBookings(prev => prev.map(b => {
      if (b.id === dispute.id) {
        return { ...b, status: refundToClientPercent === 100 ? 'Refunded' : 'Paid (Partial)' };
      }
      return b;
    }));

    const text = refundToClientPercent === 100 
      ? `Dispute Resolved — Full Refund` 
      : refundToClientPercent === 0 
        ? `Dispute Resolved — Payout Released` 
        : `Dispute Resolved — Split Settlement`;

    addActivity(text, `${dispute.id}: Escrow of ${dispute.escrowAmount} resolved`, 'completed');
    setSelectedDispute(null);
  };

  // Users Actions
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        addActivity(`User Status Changed`, `${u.name} status updated to ${nextStatus}`, 'dispute');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const deleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      addActivity(`User Account Deleted`, `Removed account: ${user.name}`, 'cancelled');
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
    editUserModalOpen,
    setEditUserModalOpen,
    appSearchQuery,
    setAppSearchQuery,
    appServiceFilter,
    setAppServiceFilter,
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
    deleteUser,
    editUser
  };
}
