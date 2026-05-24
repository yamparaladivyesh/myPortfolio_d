import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutModal from './components/AboutModal';
import SkillsModal from './components/SkillsModal';
import ProjectsModal from './components/ProjectsModal';
import SkillMatchModal from './components/SkillMatchModal';
import ProfilesDropdown from './components/ProfilesDropdown';
import ContactDropdown from './components/ContactDropdown';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPopup from './components/AdminPopup';
import Footer from './components/Footer';
import { getProjects, getSkills, loginAdmin, pingBackend } from './api';

function App() {
  const [activePanel, setActivePanel] = useState(null);
  const [projectIndex, setProjectIndex] = useState(0);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [skillGroups, setSkillGroups] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [backendReady, setBackendReady] = useState(false);
  const [backendWakeAttempts, setBackendWakeAttempts] = useState(0);
  const [backendWakeError, setBackendWakeError] = useState('');

  const handleTogglePanel = (panelName) => {
    setActivePanel((current) => {
      const next = current === panelName ? null : panelName;
      if (next === 'projects') {
        setProjectIndex(0);
      }
      if (next !== 'admin') {
        setAdminUnlocked(false);
      }
      return next;
    });
    setMobileOpen(false);
  };

  const handleClosePanel = () => {
    setActivePanel(null);
    setAdminUnlocked(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClosePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const waitForBackend = async () => {
    setBackendWakeError('');
    for (let attempt = 1; attempt <= 12; attempt += 1) {
      setBackendWakeAttempts(attempt);
      try {
        await pingBackend();
        setBackendReady(true);
        return;
      } catch (error) {
        if (attempt < 12) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }
    setBackendWakeError('Backend is taking too long to start. Please refresh or try again later.');
  };

  const fetchSkills = async () => {
    try {
      const groups = await getSkills();
      setSkillGroups(groups);
    } catch (error) {
      toast.error('Unable to load skills from the backend.');
      setSkillGroups([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const projects = await getProjects();
      setProjectList(projects);
      setProjectIndex((current) => Math.min(current, projects.length - 1));
    } catch (error) {
      toast.error('Unable to load projects from the backend.');
      setProjectList([]);
    }
  };

  useEffect(() => {
    waitForBackend();
  }, []);

  useEffect(() => {
    if (!backendReady) return;
    fetchSkills();
    fetchProjects();
  }, [backendReady]);

  const handleChangeProject = (direction) => {
    setProjectIndex((current) => {
      if (direction === 'next' && current < projectList.length - 1) {
        return current + 1;
      }
      if (direction === 'prev' && current > 0) {
        return current - 1;
      }
      return current;
    });
  };

  const handleUpdateSkillGroups = (newGroups) => {
    setSkillGroups(newGroups);
  };

  const handleUpdateProjects = (newProjects) => {
    setProjectList(newProjects);
    setProjectIndex((current) => Math.min(current, newProjects.length - 1));
  };

  const handleAdminUnlock = async (password) => {
    try {
      const success = await loginAdmin(password);
      if (success) {
        toast.success('Admin access granted');
        setAdminUnlocked(true);
        return true;
      }
      toast.error('Incorrect password. Please try again.');
      return false;
    } catch (error) {
      toast.error('Unable to reach admin service.');
      return false;
    }
  };

  const handleAdminLogout = () => {
    setAdminUnlocked(false);
    setActivePanel(null);
  };

  const handleRefreshSkills = async () => {
    await fetchSkills();
  };

  const handleRefreshProjects = async () => {
    await fetchProjects();
  };

  if (!backendReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#0f172a',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '1rem' }}>Starting backend server...</h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Please wait a few seconds while the backend wakes up. This may take up to one minute.
          </p>
          <p style={{ opacity: 0.85, marginBottom: '0.5rem' }}>
            Attempt {backendWakeAttempts} of 12
          </p>
          {backendWakeError && (
            <p style={{ color: '#f87171', marginTop: '1rem' }}>{backendWakeError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000015,
        }}
        toastOptions={{
          duration: 3600,
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
          success: {
            style: {
              background: 'rgba(17, 24, 39, 0.95)',
              color: '#ffffff',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
          },
          error: {
            style: {
              background: 'rgba(17, 24, 39, 0.95)',
              color: '#ffffff',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
          },
        }}
      />
      <div className="app-shell">
        <Navbar
          activePanel={activePanel}
          onTogglePanel={handleTogglePanel}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="page-content">
          <HeroSection />

          <Footer />
        </main>

        <AboutModal open={activePanel === 'about'} onClose={handleClosePanel} />
        <SkillsModal open={activePanel === 'skills'} onClose={handleClosePanel} skillGroups={skillGroups} />
        <ProjectsModal
          open={activePanel === 'projects'}
          onClose={handleClosePanel}
          projectIndex={projectIndex}
          onChangeProject={handleChangeProject}
          projectList={projectList}
        />
        <SkillMatchModal
          open={activePanel === 'skillmatch'}
          onClose={handleClosePanel}
          skillGroups={skillGroups}
          projectList={projectList}
        />
        <ProfilesDropdown open={activePanel === 'profiles'} onClose={handleClosePanel} />
        <ContactDropdown open={activePanel === 'contact'} onClose={handleClosePanel} />
        <AdminLoginModal open={activePanel === 'admin' && !adminUnlocked} onClose={handleClosePanel} onUnlock={handleAdminUnlock} />
        <AdminPopup
          open={activePanel === 'admin' && adminUnlocked}
          onClose={handleClosePanel}
          onLogout={handleAdminLogout}
          skillGroups={skillGroups}
          onUpdateSkillGroups={handleUpdateSkillGroups}
          projectList={projectList}
          onUpdateProjects={handleUpdateProjects}
          onRefreshSkills={handleRefreshSkills}
          onRefreshProjects={handleRefreshProjects}
        />
      </div>
    </>
  );
}

export default App;



