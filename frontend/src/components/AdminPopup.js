import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LuSettings2, LuFolder, LuPencil, LuTrash2, LuGripVertical, LuX } from 'react-icons/lu';
import {
  addSkill,
  deleteSkill,
  reorderSkills,
  addProject,
  updateProject,
  deleteProject,
  reorderProjects,
  SKILL_CATEGORY_ORDER,
} from '../api';

const AdminPopup = ({
  open,
  onClose,
  onLogout,
  skillGroups,
  onUpdateSkillGroups,
  projectList,
  onUpdateProjects,
  onRefreshSkills,
  onRefreshProjects,
}) => {
  const [activeTab, setActiveTab] = useState('skills');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectSummary, setNewProjectSummary] = useState('');
  const [newProjectStack, setNewProjectStack] = useState('');
  const [newProjectFeatures, setNewProjectFeatures] = useState('');
  const [newProjectGithub, setNewProjectGithub] = useState('');
  const [newProjectDemo, setNewProjectDemo] = useState('');
  const [draggedSkillIndex, setDraggedSkillIndex] = useState(null);
  const [draggedSkillCategory, setDraggedSkillCategory] = useState(null);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState(null);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);

  useEffect(() => {
    if (open) {
      setActiveTab('skills');
    }
  }, [open]);

  if (!open) return null;

  const handleAddSkill = async (event) => {
    event.preventDefault();
    if (!newSkillName.trim()) {
      return;
    }
    if (!newSkillCategory) {
      toast.error('Please select a category.');
      return;
    }

    try {
      await addSkill({ name: newSkillName.trim(), category: newSkillCategory });
      toast.success('Skill added');
      setNewSkillName('');
      setNewSkillCategory('');
      await onRefreshSkills();
    } catch (error) {
      toast.error('Unable to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkill(skillId);
      toast.success('Skill deleted');
      await onRefreshSkills();
    } catch (error) {
      toast.error('Unable to delete skill.');
    }
  };

  const handleSkillDragStart = (e, categoryIndex, skillIndex) => {
    setDraggedSkillIndex(skillIndex);
    setDraggedSkillCategory(categoryIndex);
  };

  const handleSkillDragOver = (e) => {
    e.preventDefault();
  };

  const handleSkillDrop = async (e, categoryIndex, targetSkillIndex) => {
    e.preventDefault();
    if (draggedSkillCategory === categoryIndex && draggedSkillIndex !== targetSkillIndex) {
      const originalGroups = JSON.parse(JSON.stringify(skillGroups));
      const group = skillGroups[categoryIndex];
      const items = [...group.items];
      const [draggedItem] = items.splice(draggedSkillIndex, 1);
      items.splice(targetSkillIndex, 0, draggedItem);
      const updated = skillGroups.map((g, idx) => (idx === categoryIndex ? { ...g, items } : g));
      onUpdateSkillGroups(updated);

      // Build minimal payload for this category only: [{ id, category_order }]
      const payload = items.map((s, idx) => ({ id: s.id, category_order: idx + 1 }));
      try {
        await reorderSkills(payload);
        toast.success('Skill order saved');
        await onRefreshSkills();
      } catch (error) {
        toast.error('Unable to save skill order.');
        onUpdateSkillGroups(originalGroups);
      }
    }
    setDraggedSkillIndex(null);
    setDraggedSkillCategory(null);
  };

  const resetProjectForm = () => {
    setEditingProjectIndex(null);
    setNewProjectTitle('');
    setNewProjectSummary('');
    setNewProjectStack('');
    setNewProjectFeatures('');
    setNewProjectGithub('');
    setNewProjectDemo('');
  };

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    if (!newProjectTitle.trim()) return;

    const nextProject = {
      title: newProjectTitle.trim(),
      technologies: newProjectStack.trim(),
      description: newProjectSummary.trim(),
      features: newProjectFeatures.trim(),
      githubLink: newProjectGithub.trim() || '#',
      liveLink: newProjectDemo.trim(),
    };

    try {
      if (editingProjectIndex !== null) {
        const project = projectList[editingProjectIndex];
        await updateProject({ ...nextProject, id: project?.id });
        toast.success('Project updated');
      } else {
        await addProject(nextProject);
        toast.success('Project added');
      }
      await onRefreshProjects();
      resetProjectForm();
    } catch (error) {
      toast.error('Unable to save project.');
    }
  };

  const handleDeleteProject = async (index) => {
    const project = projectList[index];

    try {
      await deleteProject(project);
      toast.success('Project deleted');
      await onRefreshProjects();
      if (editingProjectIndex === index) {
        resetProjectForm();
      } else if (editingProjectIndex !== null && index < editingProjectIndex) {
        setEditingProjectIndex(editingProjectIndex - 1);
      }
    } catch (error) {
      toast.error('Unable to delete project.');
    }
  };

  const handleEditProject = (index) => {
    const project = projectList[index];
    setEditingProjectIndex(index);
    setNewProjectTitle(project.title);
    setNewProjectSummary(project.description || '');
    setNewProjectStack(typeof project.technologies === 'string' ? project.technologies : '');
    setNewProjectFeatures(typeof project.features === 'string' ? project.features : '');
    setNewProjectGithub(project.githubLink || '');
    setNewProjectDemo(project.liveLink || '');
    setActiveTab('projects');
  };

  const handleProjectDragStart = (e, index) => {
    setDraggedProjectIndex(index);
  };

  const handleProjectDragOver = (e) => {
    e.preventDefault();
  };

  const handleProjectDrop = async (e, targetIndex) => {
    e.preventDefault();
    if (draggedProjectIndex !== null && draggedProjectIndex !== targetIndex) {
      const updatedProjects = [...projectList];
      const [draggedProject] = updatedProjects.splice(draggedProjectIndex, 1);
      updatedProjects.splice(targetIndex, 0, draggedProject);

      const updatedWithOrder = updatedProjects.map((project, index) => ({
        ...project,
        order: index + 1,
      }));
      const reorderPayload = updatedWithOrder.map((project) => ({
        id: project.id,
        order: project.order,
      }));

      onUpdateProjects(updatedWithOrder);

      try {
        await reorderProjects(reorderPayload);
        toast.success('Project order saved');
        await onRefreshProjects();
      } catch (error) {
        toast.error('Unable to save project order.');
        onUpdateProjects(projectList);
      }
    }
    setDraggedProjectIndex(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="admin-overlay" onClick={handleOverlayClick}>
      <div className="admin-panel-modal">
        {/* Header */}
        <div className="admin-panel-header">
          <div className="admin-header-content">
            <div className="admin-header-icon">
              <LuSettings2 />
            </div>
            <div>
              <h2 className="admin-title">Admin Panel</h2>
              <p className="admin-subtitle">Dashboard Management</p>
            </div>
          </div>
          <button className="admin-close-btn" onClick={onClose} title="Close">
            <LuX />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            <span className="tab-icon">
              <LuSettings2 />
            </span>
            Manage Skills
          </button>
          <button
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <span className="tab-icon">
              <LuFolder />
            </span>
            Manage Projects
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {/* Manage Skills Tab */}
          {activeTab === 'skills' && (
            <div className="admin-tab-content">
              {/* Add Skill Form */}
              <form className="admin-add-form" onSubmit={handleAddSkill}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Enter Skill"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="admin-select"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {SKILL_CATEGORY_ORDER.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="admin-btn-add">
                    + Add
                  </button>
                </div>
              </form>

              {/* Skills Display */}
              <div className="admin-skills-container">
                {skillGroups.map((group, categoryIndex) => (
                  <div key={group.title} className="skill-category">
                    <h4 className="category-title">{group.title}</h4>
                    <div className="skill-pills-grid">
                      {group.items.map((skill, skillIndex) => (
                        <div
                          key={skill.id}
                          className={`skill-pill ${draggedSkillIndex === skillIndex && draggedSkillCategory === categoryIndex ? 'dragging' : ''}`}
                          draggable
                          onDragStart={(e) => handleSkillDragStart(e, categoryIndex, skillIndex)}
                          onDragOver={handleSkillDragOver}
                          onDrop={(e) => handleSkillDrop(e, categoryIndex, skillIndex)}
                        >
                          <span>{skill.name}</span>
                          <button
                            type="button"
                            className="skill-delete-btn"
                            onClick={() => handleDeleteSkill(skill.id)}
                            title="Delete skill"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manage Projects Tab */}
          {activeTab === 'projects' && (
            <div className="admin-tab-content">
              {/* Add Project Form */}
              <form className="admin-add-form" onSubmit={handleProjectSubmit}>
                <div className="form-column">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      className="admin-input"
                      style={{ flex: 2 }}
                    />
                    <input
                      type="text"
                      placeholder="Tech Stack"
                      value={newProjectStack}
                      onChange={(e) => setNewProjectStack(e.target.value)}
                      className="admin-input"
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Project Description"
                      value={newProjectSummary}
                      onChange={(e) => setNewProjectSummary(e.target.value)}
                      className="admin-input"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Project Features"
                      value={newProjectFeatures}
                      onChange={(e) => setNewProjectFeatures(e.target.value)}
                      className="admin-input"
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="url"
                      placeholder="GitHub Link"
                      value={newProjectGithub}
                      onChange={(e) => setNewProjectGithub(e.target.value)}
                      className="admin-input"
                      style={{ flex: 1 }}
                    />
                    <input
                      type="url"
                      placeholder="Demo Link"
                      value={newProjectDemo}
                      onChange={(e) => setNewProjectDemo(e.target.value)}
                      className="admin-input"
                      style={{ flex: 1 }}
                    />
                  </div>
                  <div className="form-row form-actions-row">
                    <button type="submit" className="admin-btn-add" style={{ width: '100%' }}>
                      {editingProjectIndex !== null ? 'Update Project' : '+ Add Project'}
                    </button>
                    {editingProjectIndex !== null && (
                      <button type="button" className="admin-btn-cancel" onClick={resetProjectForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Projects List */}
              <div className="admin-projects-container">
                {projectList.length === 0 ? (
                  <div className="empty-state">
                    <p>No projects yet. Add your first project above!</p>
                  </div>
                ) : (
                  projectList.map((project, index) => (
                    <div
                      key={project.id ?? index}
                      className={`project-card ${draggedProjectIndex === index ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleProjectDragStart(e, index)}
                      onDragOver={handleProjectDragOver}
                      onDrop={(e) => handleProjectDrop(e, index)}
                    >
                      <div className="project-drag-handle">
                        <LuGripVertical />
                      </div>
                      <div className="project-card-content">
                        <h4 className="project-title">{project.title}</h4>
                        <p className="project-summary">{project.description || 'No description'}</p>
                        {project.technologies && (
                          <div className="project-stack">
                            {(typeof project.technologies === 'string'
                              ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
                              : Array.isArray(project.technologies)
                              ? project.technologies
                              : []
                            ).map((tech) => (
                              <span key={tech} className="tech-badge">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="project-actions">
                        <button
                          type="button"
                          className="project-btn edit-btn"
                          onClick={() => handleEditProject(index)}
                          title="Edit project"
                        >
                          <LuPencil />
                        </button>
                        <button
                          type="button"
                          className="project-btn delete-btn"
                          onClick={() => handleDeleteProject(index)}
                          title="Delete project"
                        >
                          <LuTrash2 />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="admin-panel-footer">
          <button className="admin-btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPopup;
