import React from 'react';
import ModalWrapper from './ModalWrapper';

const AboutModal = ({ open, onClose }) => {
  return (
    <ModalWrapper open={open} onClose={onClose} title="About Me">
      <div className="about-content about-two-column">
        <div className="about-left">
          <div className="about-card about-intro-card">
            <h4>Introduction</h4>
            <p>
              I’m currently focusing on building my skills in full stack development by working on
              practical projects and improving my problem-solving abilities. Along with web
              development, I’m also interested in Data Analytics and gradually building my skills in
              the data domain.
            </p>
          </div>

          <div className="about-card">
            <h4>Education</h4>
            <p className="section-title">K L University</p>
            <p>B.Tech in Computer Science and Engineering</p>
            <p>2023 – 2027</p>
            <p className="section-title">D.V.C Viveka Junior College</p>
            <p>MPC</p>
            <p>2021 – 2023</p>
          </div>
        </div>

        <div className="about-right">
          <div className="about-card">
            <h4>Goals</h4>
            <p>
              Currently, my goal is to strengthen my skills in full stack development, secure a
              good placement opportunity, and continue growing in the software industry. I also want
              to build strong skills in Data Analytics and gradually move deeper into the data
              domain.
            </p>
          </div>

          <div className="about-card">
            <h4>Interests</h4>
            <ul className="interest-list">
              <li>Web Development</li>
              <li>Problem Solving</li>
              <li>Learning New Technologies</li>
              <li>Data Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AboutModal;
