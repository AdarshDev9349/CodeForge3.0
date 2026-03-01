'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removeAdminToken, hasAdminToken } from '@/lib/adminAuth';
import '../admin.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [statistics, setStatistics] = useState({
    totalTeams: 0,
    totalMembers: 0
  });
  const [error, setError] = useState('');
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      if (!hasAdminToken()) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch('/api/admin/verify');
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          await fetchTeams();
        } else {
          removeAdminToken();
          router.push('/admin/login');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        removeAdminToken();
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchTeams = async () => {
    try {
      setRefreshLoading(true);
      const response = await fetch('/api/admin/teams');
      
      if (response.status === 401) {
        removeAdminToken();
        router.push('/admin/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setTeams(data.teams || []);
        setStatistics(data.statistics || { totalTeams: 0, totalMembers: 0 });
        setError('');
      } else {
        setError(data.error || 'Failed to fetch teams');
      }
    } catch (err) {
      console.error('Fetch teams error:', err);
      setError('An error occurred while fetching teams');
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      removeAdminToken();
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
      removeAdminToken();
      router.push('/admin/login');
    }
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setEditedTeam({ ...team });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
    setEditedTeam(null);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original data
      setEditedTeam({ ...selectedTeam });
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field, value) => {
    setEditedTeam((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    setSaveLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/teams', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTeam),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update team');
      }

      // Update local state
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.team_id === editedTeam.team_id ? editedTeam : team
        )
      );
      setSelectedTeam(editedTeam);
      setIsEditing(false);
      
      // Optionally refresh teams to ensure data consistency
      await fetchTeams();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container" style={{
        background: 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(88, 28, 135) 50%, rgb(17, 24, 39) 100%)'
      }}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="admin-loading inline-block mb-4" style={{ width: '40px', height: '40px' }}></div>
            <div className="text-white text-xl">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-container" style={{
      background: 'linear-gradient(135deg, rgb(17, 24, 39) 0%, rgb(88, 28, 135) 50%, rgb(17, 24, 39) 100%)'
    }}>
      {/* Header */}
      <div className={`admin-header relative z-20 ${isModalOpen ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 gap-2">
            <div>
              <div className="admin-badge inline-flex mb-1">
                <div className="admin-badge-dot"></div>
                <span className="uppercase tracking-widest text-xs">CodeForge 3.0</span>
              </div>
              <h1 className="text-xl font-bold text-white admin-title-glow">Admin Dashboard</h1>
              <p className="mt-0.5 text-xs text-purple-100">
                Manage and monitor your hackathon platform
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition duration-200 border border-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium uppercase tracking-wide">Total Teams</p>
                <p className="text-5xl font-bold text-white mt-2">
                  {statistics.totalTeams}
                </p>
              </div>
              <div className="admin-icon-container">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium uppercase tracking-wide">Total Members</p>
                <p className="text-5xl font-bold text-white mt-2">
                  {statistics.totalMembers}
                </p>
              </div>
              <div className="admin-icon-container">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="admin-card overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-900/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-white">Registered Teams</h2>
            <button
              onClick={fetchTeams}
              disabled={refreshLoading}
              className="admin-btn-secondary"
            >
              {refreshLoading ? (
                <span className="flex items-center gap-2">
                  <div className="admin-loading"></div>
                  Refreshing...
                </span>
              ) : (
                'Refresh Data'
              )}
            </button>
          </div>

          {error && (
            <div className="m-6 admin-alert admin-alert-error">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            {teams.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-purple-500/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-purple-100">No teams registered yet</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Members</th>
                    <th>Created At</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr 
                      key={team.team_id || index}
                      onClick={() => handleTeamClick(team)}
                      className="cursor-pointer hover:bg-purple-900/20 transition-colors"
                    >
                      <td className="font-medium text-white">
                        {team.team_name || team.name || 'N/A'}
                      </td>
                      <td className="text-purple-200">
                        {team.total_members || 0}
                      </td>
                      <td className="text-purple-100">
                        {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="text-purple-300/60 font-mono text-xs">
                        {team.team_id ? team.team_id.substring(0, 8) + '...' : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Team Details Modal */}
        {isModalOpen && selectedTeam && (
          <div className="admin-modal-overlay" onClick={handleCloseModal}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="admin-modal-header">
                <h3 className="text-2xl font-bold text-white">Team Details</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="admin-modal-body">
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Team Name</label>
                    <input
                      type="text"
                      value={editedTeam?.team_name || ''}
                      onChange={(e) => handleFieldChange('team_name', e.target.value)}
                      disabled={!isEditing}
                      className="admin-input"
                    />
                  </div>

                  {/* Total Members */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">Total Members</label>
                    <input
                      type="number"
                      value={editedTeam?.total_members || ''}
                      onChange={(e) => handleFieldChange('total_members', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="admin-input"
                      min="1"
                      max="4"
                    />
                  </div>

                  {/* Leader Details */}
                  <div className="border-t border-purple-900/30 pt-4 mt-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Leader (Member 1)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                        <input
                          type="text"
                          value={editedTeam?.leader_name || ''}
                          onChange={(e) => handleFieldChange('leader_name', e.target.value)}
                          disabled={!isEditing}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                        <input
                          type="email"
                          value={editedTeam?.leader_email || ''}
                          onChange={(e) => handleFieldChange('leader_email', e.target.value)}
                          disabled={!isEditing}
                          className="admin-input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">Year of Study</label>
                        <input
                          type="text"
                          value={editedTeam?.leader_year || ''}
                          onChange={(e) => handleFieldChange('leader_year', e.target.value)}
                          disabled={!isEditing}
                          className="admin-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Member 2 */}
                  {(editedTeam?.total_members >= 2 || editedTeam?.member2_name) && (
                    <div className="border-t border-purple-900/30 pt-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Member 2</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                          <input
                            type="text"
                            value={editedTeam?.member2_name || ''}
                            onChange={(e) => handleFieldChange('member2_name', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                          <input
                            type="email"
                            value={editedTeam?.member2_email || ''}
                            onChange={(e) => handleFieldChange('member2_email', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Year of Study</label>
                          <input
                            type="text"
                            value={editedTeam?.member2_year || ''}
                            onChange={(e) => handleFieldChange('member2_year', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Member 3 */}
                  {(editedTeam?.total_members >= 3 || editedTeam?.member3_name) && (
                    <div className="border-t border-purple-900/30 pt-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Member 3</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                          <input
                            type="text"
                            value={editedTeam?.member3_name || ''}
                            onChange={(e) => handleFieldChange('member3_name', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                          <input
                            type="email"
                            value={editedTeam?.member3_email || ''}
                            onChange={(e) => handleFieldChange('member3_email', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Year of Study</label>
                          <input
                            type="text"
                            value={editedTeam?.member3_year || ''}
                            onChange={(e) => handleFieldChange('member3_year', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Member 4 */}
                  {(editedTeam?.total_members >= 4 || editedTeam?.member4_name) && (
                    <div className="border-t border-purple-900/30 pt-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Member 4</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                          <input
                            type="text"
                            value={editedTeam?.member4_name || ''}
                            onChange={(e) => handleFieldChange('member4_name', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                          <input
                            type="email"
                            value={editedTeam?.member4_email || ''}
                            onChange={(e) => handleFieldChange('member4_email', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-purple-200 mb-2">Year of Study</label>
                          <input
                            type="text"
                            value={editedTeam?.member4_year || ''}
                            onChange={(e) => handleFieldChange('member4_year', e.target.value)}
                            disabled={!isEditing}
                            className="admin-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="border-t border-purple-900/30 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">Team ID</label>
                        <input
                          type="text"
                          value={editedTeam?.team_id || ''}
                          disabled
                          className="admin-input opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">Created At</label>
                        <input
                          type="text"
                          value={editedTeam?.created_at ? new Date(editedTeam.created_at).toLocaleString() : 'N/A'}
                          disabled
                          className="admin-input opacity-60 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 rounded-lg transition-colors border border-purple-700/30"
                >
                  Close
                </button>
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleEditToggle}
                        disabled={saveLoading}
                        className="px-4 py-2 bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 rounded-lg transition-colors border border-purple-700/30"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={saveLoading}
                        className="px-4 py-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-colors border border-green-500/30 flex items-center gap-2"
                      >
                        {saveLoading ? (
                          <>
                            <div className="admin-loading"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg transition-colors border border-purple-500/30"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
