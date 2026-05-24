import axios from 'axios';

export const SKILL_CATEGORY_ORDER = [
  'Programming',
  'Core',
  'Full Stack Development',
  'Data Science',
  'Machine Learning',
  'Others',
];

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 12000,
});

const normalizeSkillGroups = (source) => {
  const categories = new Map(
    SKILL_CATEGORY_ORDER.map((title) => [title, { title, items: [] }])
  );

  const pushSkillObj = (category, skillObj) => {
    const title = SKILL_CATEGORY_ORDER.includes(category) ? category : 'Others';
    const group = categories.get(title);
    if (!group) return;
    // Ensure we push full skill object and avoid duplicates by id
    const normalizedId = skillObj && skillObj.id != null ? String(skillObj.id) : undefined;
    if (!skillObj || !normalizedId) return;
    if (!group.items.find((s) => s.id === normalizedId)) {
      group.items.push({
        id: normalizedId,
        name: skillObj.name || skillObj.title || String(skillObj || '').trim(),
        category: category || skillObj.category || title,
        category_order: skillObj.category_order ?? skillObj.order ?? 0,
      });
    }
  };

  if (Array.isArray(source)) {
    // Case A: API returns grouped categories [{ title, items: [...] }]
    if (source.length && source[0].title && Array.isArray(source[0].items)) {
      source.forEach((group) => {
        const title = SKILL_CATEGORY_ORDER.includes(group.title) ? group.title : 'Others';
        const existing = categories.get(title);
        if (existing && Array.isArray(group.items)) {
          group.items.forEach((item) => {
            if (typeof item === 'string') {
              // no id available — skip
            } else {
              pushSkillObj(title, item);
            }
          });
        }
      });
    } else {
      // Case B: flat list of skill objects [{id,name,category,category_order}, ...]
      source.forEach((item) => {
        if (item && (item.id || item.name)) {
          const category = item.category || item.group || 'Others';
          pushSkillObj(category, item);
        }
      });
    }
  } else if (source && typeof source === 'object') {
    // object keyed by category: { Frontend: [{id,name}, ...], Backend: [...] }
    Object.entries(source).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (typeof item === 'string') return;
          pushSkillObj(key, item);
        });
      }
    });
  }

  // Sort each category by category_order so frontend always matches backend ordering.
  const sortedGroups = SKILL_CATEGORY_ORDER.map((title) => {
    const group = categories.get(title);
    if (!group) return null;
    return {
      ...group,
      items: group.items
        .slice()
        .sort((a, b) => {
          if (a.category_order !== b.category_order) {
            return a.category_order - b.category_order;
          }
          return a.name.localeCompare(b.name || '');
        }),
    };
  }).filter((group) => group && group.items.length > 0);

  return sortedGroups;
};

const normalizeProjects = (source) => {
  const list = Array.isArray(source) ? source : source?.projects ?? [];
  if (!Array.isArray(list)) return [];
  return list
    .map((project) => {
      const rawId = project.id ?? project._id ?? project.slug;
      return {
        id: rawId != null ? String(rawId) : undefined,
        order: project.order ?? project.project_order ?? project.position ?? 0,
        title: project.title || '',
        technologies: project.technologies || project.stack || '',
        description: project.description || project.summary || '',
        features: project.features || project.features || '',
        githubLink: project.githubLink || project.github || '#',
        liveLink: project.liveLink || project.liveDemo || project.demo || project.live_demo || '',
      };
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

const projectToBackendFormat = (project) => ({
  title: project.title || '',
  technologies: typeof project.technologies === 'string'
    ? project.technologies
    : Array.isArray(project.technologies)
    ? project.technologies.join(', ')
    : '',
  description: project.description || project.summary || '',
  features: typeof project.features === 'string'
    ? project.features
    : Array.isArray(project.features)
    ? project.features.join(', ')
    : '',
  githubLink: project.githubLink || project.github || '#',
  liveLink: project.liveLink || project.liveDemo || '',
});

export const getSkills = async () => {
  const response = await api.get('/skills');
  return normalizeSkillGroups(response.data);
};

export const getProjects = async () => {
  const response = await api.get('/projects');
  return normalizeProjects(response.data);
};

export const loginAdmin = async (password) => {
  const response = await api.post('/admin/login', { password });
  const data = response.data;
  if (typeof data === 'object' && data !== null) {
    return data.success !== false;
  }
  return response.status === 200;
};

export const addSkill = async ({ name, category }) => {
  const response = await api.post('/skills', { name, category });
  return response.data;
};

export const deleteSkill = async (id) => {
  if (!id) throw new Error('Skill id is required');
  await api.delete(`/skills/${id}`);
};

export const reorderSkills = async (updates) => {
  // updates should be an array of { id, category_order }
  if (!Array.isArray(updates)) throw new Error('updates must be an array');
  await api.put('/skills/reorder', updates);
};

export const addProject = async (project) => {
  const payload = projectToBackendFormat(project);
  await api.post('/projects', payload);
};

export const updateProject = async (project) => {
  const payload = projectToBackendFormat(project);
  if (project.id) {
    await api.put(`/projects/${project.id}`, payload);
  } else {
    await api.put('/projects', payload);
  }
};

export const matchSkills = async (jobDescription, portfolio = null) => {
  const payload = { job_description: jobDescription };
  if (portfolio && typeof portfolio === 'object') {
    payload.portfolio = portfolio;
  }
  const response = await api.post('/skillmatch', payload);
  return response.data;
};

export const deleteProject = async (project) => {
  if (project.id) {
    await api.delete(`/projects/${project.id}`);
  } else {
    await api.delete('/projects', { data: { title: project.title } });
  }
};

export const reorderProjects = async (updates) => {
  if (!Array.isArray(updates)) throw new Error('updates must be an array');
  await api.put('/projects/reorder', updates);
};
