import React from 'react';
import AdminLayout from './layout/AdminLayout';
import OverviewTab from './components/OverviewTab';
import ApplicationsTab from './components/ApplicationsTab';
import DisputesTab from './components/DisputesTab';
import UsersTab from './components/UsersTab';
import BookingsTab from './components/BookingsTab';
import PaymentsTab from './components/PaymentsTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsTab from './components/SettingsTab';

import ReviewApplicationModal from './components/ReviewApplicationModal';
import DisputeModal from './components/DisputeModal';
import UserModal from './components/UserModal';

import { useAdminDashboard } from './hooks/useAdminDashboard';

export default function AdminDashboard({ onNavigate }) {
  const {
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
  } = useAdminDashboard();

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      pendingApplicationsCount={applications.length}
      openDisputesCount={disputes.length}
      notifications={notifications}
      notificationsOpen={notificationsOpen}
      setNotificationsOpen={setNotificationsOpen}
      setNotifications={setNotifications}
      unreadCount={unreadCount}
      onNavigate={onNavigate}
    >
      {/* Overview tab */}
      {activeTab === 'overview' && (
        <OverviewTab
          applications={applications}
          disputes={disputes}
          users={users}
          bookings={bookings}
          recentActivity={recentActivity}
          revenueStats={revenueStats}
          setActiveTab={setActiveTab}
          setSelectedApplication={setSelectedApplication}
          setSelectedDispute={setSelectedDispute}
        />
      )}

      {/* Applications tab */}
      {activeTab === 'applications' && (
        <ApplicationsTab
          applications={applications}
          setSelectedApplication={setSelectedApplication}
          appSearchQuery={appSearchQuery}
          setAppSearchQuery={setAppSearchQuery}
          appServiceFilter={appServiceFilter}
          setAppServiceFilter={setAppServiceFilter}
        />
      )}

      {/* Disputes tab */}
      {activeTab === 'disputes' && (
        <DisputesTab
          disputes={disputes}
          setSelectedDispute={setSelectedDispute}
        />
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <UsersTab
          users={users}
          setSelectedUser={setSelectedUser}
          setEditUserModalOpen={setEditUserModalOpen}
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          userRoleFilter={userRoleFilter}
          setUserRoleFilter={setUserRoleFilter}
          userStatusFilter={userStatusFilter}
          setUserStatusFilter={setUserStatusFilter}
          toggleUserStatus={toggleUserStatus}
          deleteUser={deleteUser}
        />
      )}

      {/* Bookings tab */}
      {activeTab === 'bookings' && (
        <BookingsTab bookings={bookings} setSelectedUser={setSelectedUser} />
      )}

      {/* Payments tab */}
      {activeTab === 'payments' && (
        <PaymentsTab revenueStats={revenueStats} />
      )}

      {/* Analytics tab */}
      {activeTab === 'analytics' && (
        <AnalyticsTab />
      )}
      
      {/* Settings tab */}
      {activeTab === 'settings' && (
        <SettingsTab />
      )}

      {/* Profile tab view details */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#E2D9CF] rounded-2xl p-6 shadow-sm space-y-4 max-w-md">
          <h3 className="font-display text-lg font-bold text-[#1C1A17]">System Admin Configuration</h3>
          <div className="divide-y divide-[#EFECE6] text-xs">
            <div className="py-3 flex justify-between">
              <span className="text-[#8A7E74]">Admin Name</span>
              <strong className="text-[#1C1A17]">Samuel Ntamack</strong>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-[#8A7E74]">Access Credentials</span>
              <strong className="text-[#1C1A17]">System Administrator (Super)</strong>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-[#8A7E74]">Security Auth Tokens</span>
              <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                MFA Verified
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold text-xs py-2 rounded-xl transition-all shadow-sm"
          >
            Return to console
          </button>
        </div>
      )}

      {/* MODALS RENDERING */}
      <ReviewApplicationModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
        onApprove={approveApplication}
        onReject={rejectApplication}
        onAsk={askForInfo}
      />

      <DisputeModal
        dispute={selectedDispute}
        onClose={() => setSelectedDispute(null)}
        onResolve={resolveDispute}
      />

      <UserModal
        user={selectedUser}
        editMode={editUserModalOpen}
        onClose={() => {
          setSelectedUser(null);
          setEditUserModalOpen(false);
        }}
        onSave={editUser}
      />
    </AdminLayout>
  );
}
