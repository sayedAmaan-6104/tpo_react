import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Import shared components
import { Card, Button, IconWrapper, Modal } from '../../components/ui';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { userData, userProfile, setUserRole, setUserData, setUserProfile } = useAppContext();
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

  const recruiterName = userData ? `${userData.first_name} ${userData.last_name}` : 'Recruiter';
  const companyName = userProfile?.company_name || 'Company';

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
                TPO Portal - Recruiter
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Welcome, {recruiterName}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {companyName}
                </p>
              </div>
              <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
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
                { id: 'jobs', label: 'Job Postings', icon: '💼' },
                { id: 'applications', label: 'Applications', icon: '📝' },
                { id: 'candidates', label: 'Candidates', icon: '👥' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-purple-600 text-white' 
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
          {currentPage === 'jobs' && <JobPostingsContent />}
          {currentPage === 'applications' && <ApplicationsContent />}
          {currentPage === 'candidates' && <CandidatesContent />}
          {currentPage === 'analytics' && <AnalyticsContent />}
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
            Active Jobs
          </h3>
          <p className="text-3xl font-bold text-blue-600">8</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Currently hiring
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Applications
          </h3>
          <p className="text-3xl font-bold text-green-600">156</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            This month
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Interviews
          </h3>
          <p className="text-3xl font-bold text-purple-600">24</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Scheduled
          </p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Hired
          </h3>
          <p className="text-3xl font-bold text-emerald-600">12</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            This quarter
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Recent Applications
          </h2>
          <div className="space-y-3">
            {[
              { name: 'John Doe', position: 'Frontend Developer', time: '2 hours ago', status: 'new' },
              { name: 'Jane Smith', position: 'Backend Engineer', time: '4 hours ago', status: 'reviewed' },
              { name: 'Mike Johnson', position: 'UI/UX Designer', time: '1 day ago', status: 'shortlisted' }
            ].map((app, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="flex items-center space-x-3">
                  <IconWrapper className="bg-blue-100 text-blue-600">
                    <span>👤</span>
                  </IconWrapper>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{app.name}</p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{app.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {app.status}
                  </span>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{app.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-16 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📝</span>
              <span className="text-sm">Post New Job</span>
            </Button>
            <Button className="h-16 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700">
              <span className="text-2xl mb-1">👥</span>
              <span className="text-sm">Browse Candidates</span>
            </Button>
            <Button className="h-16 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700">
              <span className="text-2xl mb-1">📊</span>
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button className="h-16 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700">
              <span className="text-2xl mb-1">📅</span>
              <span className="text-sm">Schedule Interview</span>
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Top Performing Jobs
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                <th className="text-left py-2" style={{ color: 'var(--color-text-primary)' }}>Job Title</th>
                <th className="text-left py-2" style={{ color: 'var(--color-text-primary)' }}>Applications</th>
                <th className="text-left py-2" style={{ color: 'var(--color-text-primary)' }}>Views</th>
                <th className="text-left py-2" style={{ color: 'var(--color-text-primary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { title: 'Senior Frontend Developer', applications: 45, views: 234, status: 'Active' },
                { title: 'Backend Engineer', applications: 32, views: 189, status: 'Active' },
                { title: 'Product Manager', applications: 28, views: 156, status: 'Paused' }
              ].map((job, index) => (
                <tr key={index} className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="py-3" style={{ color: 'var(--color-text-primary)' }}>{job.title}</td>
                  <td className="py-3" style={{ color: 'var(--color-text-secondary)' }}>{job.applications}</td>
                  <td className="py-3" style={{ color: 'var(--color-text-secondary)' }}>{job.views}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// Placeholder components for other sections
const JobPostingsContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Job Postings
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Manage your job postings and create new opportunities.
    </p>
  </Card>
);

const ApplicationsContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Applications
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Review and manage candidate applications.
    </p>
  </Card>
);

const CandidatesContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Candidates
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Browse and search for potential candidates.
    </p>
  </Card>
);

const AnalyticsContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Analytics
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      View detailed analytics and recruitment metrics.
    </p>
  </Card>
);

const SettingsContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Settings
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Manage your account and company settings.
    </p>
  </Card>
);

export default RecruiterDashboard;
