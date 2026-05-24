import React from 'react';
import { HiOutlineDownload } from 'react-icons/hi';

const HeroSection = () => {
  const profileImage = `${process.env.PUBLIC_URL}/myphoto1.jpg`;

  return (
    <section className="hero-shell">
      <div className="hero-layout">
        <div className="hero-copy">
          <span className="hero-intro">Hello, I'm</span>
          <h1>Divyesh Yamparala</h1>
          <p className="hero-role">FULL STACK DEVELOPER</p>
          <p className="hero-description">
            I’m a Computer Science student specializing in Data Science and Big Data Analytics. I
            build practical web applications, consistently practice Data Structures and Algorithms,
            and enjoy learning modern technologies and exploring new things.
          </p>
          <div className="hero-actions">
            <a className="resume-button" href="/2300031856_YAMPARALADIVYESH.pdf" download>
              <HiOutlineDownload className="button-icon" aria-hidden="true" />
              Download Resume
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="profile-frame">
            <div className="profile-avatar">
              <img src={profileImage} alt="Divyesh profile" />
            </div>
          </div>
          <div className="hero-shape hero-shape-3" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
