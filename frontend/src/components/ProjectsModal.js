import React from 'react';
import ModalWrapper from './ModalWrapper';

const ProjectsModal = ({ open, onClose, projectIndex, onChangeProject, projectList }) => {
  if (!open) return null;

  const currentIndex = Math.min(projectIndex, projectList.length - 1);
  const project = projectList[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === projectList.length - 1;

  return (
    <ModalWrapper open={open} onClose={onClose} title="Projects" className="projects-modal">
      <div className="projects-inner">
        {projectList.length === 0 ? (
          <div className="empty-state">
            <p>No projects are available yet. Add projects through the admin panel.</p>
          </div>
        ) : (
          <>
            <div className="project-detail project-card">
              <div className="project-header project-header-simple">
                <h4>{project.title}</h4>
                <div className="project-tags">
                  {(typeof project.technologies === 'string'
                    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                    : Array.isArray(project.technologies)
                    ? project.technologies
                    : []
                  ).map((tech) => (
                    <span key={tech} className="project-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <p className="project-summary">{project.description}</p>

              <div className="project-features">
                <h5>Features</h5>
                <ul>
                  {(typeof project.features === 'string'
                    ? project.features.split(',').map((f) => f.trim()).filter(Boolean)
                    : Array.isArray(project.features)
                    ? project.features
                    : []
                  ).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="project-links">
                {project.githubLink && project.githubLink !== '#' ? (
                  <a className="project-button" href={project.githubLink} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                ) : (
                  <span className="project-note">GitHub not available</span>
                )}
                {project.liveLink ? (
                  <a className="project-button secondary" href={project.liveLink} target="_blank" rel="noreferrer">
                    Live Demo
                  </a>
                ) : (
                  <span className="project-note">Live demo not available</span>
                )}
              </div>
            </div>

            <div className="project-navigation-simple">
              <button className="nav-button" onClick={() => onChangeProject('prev')} disabled={isFirst}>
                Previous
              </button>
              <div className="project-slide-info">
                {currentIndex + 1} / {projectList.length}
              </div>
              <button className="nav-button" onClick={() => onChangeProject('next')} disabled={isLast}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </ModalWrapper>
  );
};

export default ProjectsModal;
