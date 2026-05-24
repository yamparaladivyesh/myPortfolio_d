import React from 'react';

const Navbar = ({ activePanel, onTogglePanel, mobileOpen, setMobileOpen }) => {
  const navItems = [
    { label: 'About', panel: 'about' },
    { label: 'Skills', panel: 'skills' },
    { label: 'Projects', panel: 'projects' },
    { label: 'SkillMatch', panel: 'skillmatch' },
  ];

  const handleNavClick = (panel) => {
    onTogglePanel(panel);
    setMobileOpen(false);
  };

  return (
    <header className="navbar-shell">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <img src="/divyesh..png" alt="Divyesh logo" className="navbar-logo" />
        </div>

        <nav className={`navbar-menu ${mobileOpen ? 'open' : ''}`}>
          <div className="navbar-links">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-link ${activePanel === item.panel ? 'active' : ''}`}
                onClick={() => handleNavClick(item.panel)}
              >
                {item.label}
              </button>
            ))}

            <div className="nav-item">
              <button
                className={`nav-link ${activePanel === 'profiles' ? 'active' : ''}`}
                onClick={() => handleNavClick('profiles')}
              >
                Profiles
              </button>
            </div>

            <div className="nav-item">
              <button
                className={`nav-link ${activePanel === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavClick('contact')}
              >
                Contact
              </button>
            </div>

            <div className="nav-item">
              <button
                className={`nav-link ${activePanel === 'admin' ? 'active' : ''}`}
                onClick={() => handleNavClick('admin')}
              >
                <img src="/profile.jpg" alt="Profile" className="admin-avatar" />
              </button>
            </div>
          </div>
        </nav>

        <button className={`mobile-toggle ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen((value) => !value)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
