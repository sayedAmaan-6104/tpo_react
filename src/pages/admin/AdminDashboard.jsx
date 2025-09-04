import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Import shared components
import { Card, Button } from '../../components/ui';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userData, setUserRole, setUserData, setUserProfile } = useAppContext();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUserRole(null);
      setUserData(null);
      setUserProfile(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      setUserRole(null);
      setUserData(null);
      setUserProfile(null);
      navigate('/');
    }
  };

  const adminName = userData ? `${userData.first_name} ${userData.last_name}` : 'Admin';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ 
        backgroundColor: 'var(--color-surface)', 
        borderColor: 'var(--color-border)' 
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                TPO Portal - Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Welcome, {adminName}
              </span>
              <Button onClick={handleLogout} variant="danger">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen border-r" style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderColor: 'var(--color-border)' 
        }}>
          <div className="p-4">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'users', label: 'User Management', icon: '👥' },
                { id: 'jobs', label: 'Job Approval', icon: '💼' },
                { id: 'reports', label: 'Reports', icon: '📈' },
                { id: 'settings', label: 'System Settings', icon: '⚙️' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-red-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  style={{ 
                    color: currentPage === item.id ? 'white' : 'var(--color-text-primary)' 
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentPage === 'dashboard' && <DashboardContent />}
          {currentPage === 'users' && <UserManagementContent />}
          {currentPage === 'jobs' && <JobApprovalContent />}
          {currentPage === 'reports' && <ReportsContent />}
          {currentPage === 'settings' && <SettingsContent />}
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Total Users
          </h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Active accounts
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Students
          </h3>
          <p className="text-3xl font-bold text-green-600">856</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Registered students
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Recruiters
          </h3>
          <p className="text-3xl font-bold text-purple-600">378</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Active recruiters
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Job Postings
          </h3>
          <p className="text-3xl font-bold text-orange-600">145</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Pending approval
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Recent Activities
        </h2>
        <div className="space-y-3">
          {[
            { action: 'New student registration', user: 'John Doe', time: '2 minutes ago' },
            { action: 'Job posting submitted', user: 'TechCorp Inc.', time: '15 minutes ago' },
            { action: 'User profile updated', user: 'Jane Smith', time: '1 hour ago' },
            { action: 'New recruiter application', user: 'StartupXYZ', time: '2 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div>
                <p style={{ color: 'var(--color-text-primary)' }}>{activity.action}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>by {activity.user}</p>
              </div>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Placeholder components for other sections
const UserManagementContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      User Management
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Manage student and recruiter accounts, verify profiles, and handle user-related issues.
    </p>
  </Card>
);

const JobApprovalContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Job Approval Queue
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Review and approve job postings submitted by recruiters.
    </p>
  </Card>
);

const ReportsContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Reports & Analytics
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      View detailed reports on platform usage, job placements, and user engagement.
    </p>
  </Card>
);

const SettingsContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      System Settings
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Configure platform settings, manage permissions, and update system preferences.
    </p>
  </Card>
);

export default AdminDashboard;
