import React from 'react';
import ModalWrapper from './ModalWrapper';

const SkillsModal = ({ open, onClose, skillGroups }) => {
  return (
    <ModalWrapper open={open} onClose={onClose} title="Skills">
      {skillGroups.length === 0 ? (
        <div className="empty-state">
          <p>No skills are available yet.</p>
        </div>
      ) : (
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div key={group.title} className="skill-group">
              <h4>{group.title}</h4>
              <div className="skill-pills">
                {group.items.map((skill) => (
                  <span key={skill.id} className="skill-pill">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ModalWrapper>
  );
};

export default SkillsModal;
