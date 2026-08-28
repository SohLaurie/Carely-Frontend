import React from 'react';
import { Search, Eye, Edit2, Ban, CheckCircle, Trash2, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

export default function UsersTab({
  users,
  setSelectedUser,
  setEditUserModalOpen,
  userSearchQuery,
  setUserSearchQuery,
  userRoleFilter,
  setUserRoleFilter,
  userStatusFilter,
  setUserStatusFilter,
  toggleUserStatus,
  toggleUser2FA,
  deleteUser
}) {
  // Filtering Logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.city.toLowerCase().includes(userSearchQuery.toLowerCase());

    const matchesRole = userRoleFilter === 'All roles' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'All statuses' || u.status === userStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[#1C1A17] font-display text-2xl font-bold flex items-center gap-2">
            User Accounts & Security
            <span className="bg-[#EDE8E1] text-[#1E4030] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D9D2C8]">
              {users.length} total
            </span>
          </h2>
          <p className="text-xs text-[#8A7E74]">Manage household clients, verified caregivers, and account security enforcement.</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
          <input
            type="text"
            placeholder="Search by name, email or city..."
            value={userSearchQuery}
            onChange={e => setUserSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E2D9CF] rounded-xl text-xs outline-none bg-[#FAF8F5] focus:ring-1 focus:ring-[#1E4030] text-[#1C1A17] font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Role Filter */}
          <select
            value={userRoleFilter}
            onChange={e => setUserRoleFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
          >
            <option value="All roles">All roles</option>
            <option value="Household">Household</option>
            <option value="Caregiver">Caregiver</option>
          </select>

          {/* Status Filter */}
          <select
            value={userStatusFilter}
            onChange={e => setUserStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E2D9CF] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#1E4030] cursor-pointer"
          >
            <option value="All statuses">All statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E2D9CF] text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">2FA Security</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6] text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-[#8A7E74]">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  let roleColor = 'bg-gray-100 text-gray-800 border-gray-200';
                  if (user.role === 'Caregiver') {
                    roleColor = 'bg-[#EDF7F2] text-[#1E4030] border border-green-200';
                  } else {
                    roleColor = 'bg-[#FAF8F5] text-[#1C1A17] border border-[#E2D9CF]';
                  }

                  let statusColor = 'bg-gray-100 text-gray-800 border-gray-200';
                  if (user.status === 'Active') {
                    statusColor = 'bg-green-100 text-green-800 border-green-200';
                  } else if (user.status === 'Suspended') {
                    statusColor = 'bg-red-100 text-red-800 border-red-200';
                  } else if (user.status === 'Pending') {
                    statusColor = 'bg-amber-100 text-amber-800 border-amber-200';
                  }

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      {/* Avatar & Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#E2D9CF] flex items-center justify-center font-bold text-[#1E4030] text-xs shadow-2xs">
                            {user.initials}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#1C1A17]">{user.name}</div>
                            <div className="text-[10px] text-[#8A7E74]">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${roleColor}`}>
                          {user.role}
                        </span>
                      </td>

                      {/* City */}
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-[#1C1A17]">
                        {user.city}
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-[#8A7E74]">
                        {user.joined}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                          {user.status}
                        </span>
                      </td>

                      {/* 2FA Toggle Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          type="button"
                          onClick={() => toggleUser2FA && toggleUser2FA(user.id)}
                          title={`Click to ${user.twoFactor ? 'deactivate' : 'activate'} 2FA for ${user.name}`}
                          className="inline-flex items-center gap-2 cursor-pointer group"
                        >
                          <div className={`w-9 h-5 rounded-full transition-all relative outline-none shrink-0 ${
                            user.twoFactor ? 'bg-[#1E4030]' : 'bg-[#D9D2C8]'
                          }`}>
                            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-all ${
                              user.twoFactor ? 'left-4.5' : 'left-0.5'
                            }`}></span>
                          </div>
                          <span className={`text-[10px] font-bold ${
                            user.twoFactor ? 'text-[#1D6F42]' : 'text-[#8A7E74]'
                          }`}>
                            {user.twoFactor ? 'Active' : 'Off'}
                          </span>
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-1 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUserModalOpen(false);
                          }}
                          title="View User Details"
                          className="p-1.5 text-gray-500 hover:text-[#1E4030] hover:bg-[#EDF7F2] rounded-lg transition-all inline-flex items-center cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setEditUserModalOpen(true);
                          }}
                          title="Edit User Profile"
                          className="p-1.5 text-gray-500 hover:text-[#1E4030] hover:bg-[#EDF7F2] rounded-lg transition-all inline-flex items-center cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                          className={`p-1.5 rounded-lg transition-all inline-flex items-center cursor-pointer ${
                            user.status === 'Active' 
                              ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50' 
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          }`}
                        >
                          {user.status === 'Active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          title="Delete User"
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all inline-flex items-center cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

