import React, { useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { useAppContext } from '../../context/AppContext';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

// Import shared components
import { Card, Button, IconWrapper, Modal, LoadingSpinner } from '../../components/ui';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { userData, userProfile, setUserRole, setUserData, setUserProfile, apiKey, setApiKey } = useAppContext();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

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

  const studentName = userData ? `${userData.first_name} ${userData.last_name}` : 'Student';

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
                TPO Portal - Student
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Welcome, {studentName}
              </span>
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
                { id: 'onboarding', label: 'Profile Setup', icon: '👤' },
                { id: 'resume', label: 'Resume Optimizer', icon: '📄' },
                { id: 'interview', label: 'Mock Interview', icon: '🎯' },
                { id: 'jobs', label: 'Job Listings', icon: '💼' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-blue-600 text-white' 
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
          {currentPage === 'onboarding' && <OnboardingContent />}
          {currentPage === 'resume' && <ResumeContent />}
          {currentPage === 'interview' && <InterviewContent />}
          {currentPage === 'jobs' && <JobsContent />}
          {currentPage === 'settings' && (
            <SettingsContent 
              apiKey={apiKey} 
              setApiKey={setApiKey}
              showApiKeyModal={showApiKeyModal}
              setShowApiKeyModal={setShowApiKeyModal}
            />
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <Modal title="Configure Gemini API Key" onClose={() => setShowApiKeyModal(false)}>
          <ApiKeyModal 
            apiKey={apiKey} 
            setApiKey={setApiKey} 
            onClose={() => setShowApiKeyModal(false)} 
          />
        </Modal>
      )}
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = () => {
  const { userData, userProfile } = useAppContext();

  const data = {
    labels: ['Profile', 'Resume', 'Skills', 'Applications'],
    datasets: [{
      label: 'Completion %',
      data: [85, 70, 60, 40],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      borderRadius: 8,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Profile Completion Status' }
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Profile Completion
          </h3>
          <p className="text-3xl font-bold text-blue-600">85%</p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Jobs Applied
          </h3>
          <p className="text-3xl font-bold text-green-600">12</p>
        </Card>
        <Card className="text-center">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Interview Calls
          </h3>
          <p className="text-3xl font-bold text-purple-600">3</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Profile Completion Progress
        </h2>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <IconWrapper className="bg-blue-100 text-blue-600">
              <span>📄</span>
            </IconWrapper>
            <div>
              <p style={{ color: 'var(--color-text-primary)' }}>Resume updated</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <IconWrapper className="bg-green-100 text-green-600">
              <span>💼</span>
            </IconWrapper>
            <div>
              <p style={{ color: 'var(--color-text-primary)' }}>Applied to Frontend Developer at Tech Corp</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>1 day ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Placeholder components for other sections
const OnboardingContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Profile Setup
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Complete your profile to get better job recommendations.
    </p>
  </Card>
);

const ResumeContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Resume Optimizer
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Upload and optimize your resume with AI-powered suggestions.
    </p>
  </Card>
);

const InterviewContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Mock Interview
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Practice interviews with AI-generated questions.
    </p>
  </Card>
);

const JobsContent = () => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Job Listings
    </h2>
    <p style={{ color: 'var(--color-text-secondary)' }}>
      Browse and apply to available job opportunities.
    </p>
  </Card>
);

const SettingsContent = ({ apiKey, setApiKey, showApiKeyModal, setShowApiKeyModal }) => (
  <Card>
    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>
      Settings
    </h2>
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
          AI Configuration
        </h3>
        <Button onClick={() => setShowApiKeyModal(true)}>
          Configure Gemini API Key
        </Button>
      </div>
    </div>
  </Card>
);

const ApiKeyModal = ({ apiKey, setApiKey, onClose }) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const handleSave = () => {
    setApiKey(tempApiKey);
    onClose();
  };

  return (
    <div className="space-y-4">
      <p style={{ color: 'var(--color-text-secondary)' }}>
        Enter your Google Gemini API key to enable AI features:
      </p>
      <input
        type="password"
        value={tempApiKey}
        onChange={(e) => setTempApiKey(e.target.value)}
        placeholder="Enter your Gemini API key"
        className="w-full px-3 py-2 border rounded-lg"
        style={{ 
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-primary)'
        }}
      />
      <div className="flex justify-end space-x-2">
        <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default StudentDashboard;
