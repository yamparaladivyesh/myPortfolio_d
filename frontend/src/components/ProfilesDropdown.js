import React from 'react';
import { SiLinkedin, SiGithub, SiCodechef, SiLeetcode, SiHackerrank } from 'react-icons/si';
import { FiArrowRight } from 'react-icons/fi';
import ModalWrapper from './ModalWrapper';
import { profileLinks } from '../data/portfolioData';

const iconMap = {
  LinkedIn: <SiLinkedin />,
  GitHub: <SiGithub />,
  CodeChef: <SiCodechef />,
  LeetCode: <SiLeetcode />,
  HackerRank: <SiHackerrank />,
};

const ProfilesDropdown = ({ open, onClose }) => {
  return (
    <ModalWrapper open={open} onClose={onClose} title="Profile Links" className="profiles-modal">
      <div className="profiles-grid">
        {profileLinks.map((profile) => (
          <a
            key={profile.label}
            href={profile.url}
            target="_blank"
            rel="noreferrer"
            className="profile-card"
          >
            <div className="profile-icon">{iconMap[profile.label]}</div>
            <div className="profile-copy">
              <strong>{profile.label}</strong>
              <span>{profile.url.replace(/^https?:\/\//, '')}</span>
            </div>
            <FiArrowRight className="profile-arrow" />
          </a>
        ))}
      </div>
    </ModalWrapper>
  );
};

export default ProfilesDropdown;
