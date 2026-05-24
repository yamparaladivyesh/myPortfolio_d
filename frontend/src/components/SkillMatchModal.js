import React, { useEffect, useState } from 'react';
import { LuCheckCircle, LuXCircle } from 'react-icons/lu';
import ModalWrapper from './ModalWrapper';
import { matchSkills } from '../api';

const KNOWN_TECH_PHRASES = [
  'machine learning',
  'deep learning',
  'data science',
  'artificial intelligence',
  'natural language processing',
  'computer vision',
  'cloud native',
  'microservices',
  'react js',
  'next js',
  'node js',
  'asp net',
  'dotnet',
  'docker compose',
  'rest api',
  'graphql api',
  'sql server',
  'postgresql',
  'c sharp',
  'c plus plus',
  'objective c',
  'visual basic',
];

const TECH_STOPWORDS = new Set([
  'and', 'or', 'with', 'using', 'the', 'a', 'an', 'for', 'to', 'of', 'on', 'in', 'by', 'at', 'from',
  'experience', 'knowledge', 'skills', 'skill', 'technology', 'technologies', 'ability', 'team', 'work',
  'requirements', 'preferred', 'years', 'year', 'strong', 'including', 'including', 'tools', 'tools',
  'platforms', 'development', 'support', 'design', 'build', 'implement', 'implementing', 'implemented',
  'projects', 'project', 'business', 'customer', 'management', 'application', 'applications', 'systems',
  'system', 'development', 'software', 'solutions', 'services', 'service', 'environment', 'environments',
]);

const NORMALIZE_MAP = {
  'react.js': 'react',
  'reactjs': 'react',
  'node.js': 'nodejs',
  'nodejs': 'nodejs',
  'next.js': 'nextjs',
  'nextjs': 'nextjs',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'asp.net': 'asp.net',
  'aspnet': 'asp.net',
  'c#': 'c#',
  'csharp': 'c#',
  'c++': 'c++',
  'cplusplus': 'c++',
  'machine learning': 'machine learning',
  'data science': 'data science',
  'artificial intelligence': 'artificial intelligence',
  'natural language processing': 'natural language processing',
  'google cloud': 'google cloud',
  'aws': 'aws',
  'amazon web services': 'aws',
  'kubernetes': 'kubernetes',
  'docker compose': 'docker compose',
  'fastapi': 'fastapi',
  'django': 'django',
  'flask': 'flask',
  'graphql': 'graphql',
  'mysql': 'mysql',
  'postgresql': 'postgresql',
  'mongo db': 'mongodb',
  'mongodb': 'mongodb',
  'sql server': 'sql server',
  'github': 'github',
  'gitlab': 'gitlab',
  'bitbucket': 'bitbucket',
};

const DISPLAY_NAME_MAP = {
  react: 'React',
  fastapi: 'FastAPI',
  django: 'Django',
  flask: 'Flask',
  nodejs: 'Node.js',
  nextjs: 'Next.js',
  vue: 'Vue',
  'asp.net': 'ASP.NET',
  'c#': 'C#',
  'c++': 'C++',
  'machine learning': 'Machine Learning',
  'data science': 'Data Science',
  'artificial intelligence': 'Artificial Intelligence',
  'natural language processing': 'Natural Language Processing',
  mysql: 'MySQL',
  postgresql: 'PostgreSQL',
  mongodb: 'MongoDB',
  kubernetes: 'Kubernetes',
  docker: 'Docker',
  aws: 'AWS',
  github: 'GitHub',
  gitlab: 'GitLab',
  bitbucket: 'Bitbucket',
  graphql: 'GraphQL',
  api: 'API',
  sql: 'SQL',
};

const simplifySkill = (value) => {
  if (!value || typeof value !== 'string') return '';
  let skill = value.trim().toLowerCase();
  skill = skill.replace(/[“”‘’]/g, "'");
  skill = skill.replace(/\s*\.js\b/g, '');
  skill = skill.replace(/\s*\.ts\b/g, '');
  skill = skill.replace(/\s*\.py\b/g, '');
  skill = skill.replace(/\s*\.net\b/g, '');
  skill = skill.replace(/\s+js\b/g, ' js');
  skill = skill.replace(/\s+/g, ' ');
  skill = skill.replace(/[^a-z0-9#+.\s-]/g, ' ');
  skill = skill.replace(/\s{2,}/g, ' ').trim();
  if (NORMALIZE_MAP[skill]) {
    return NORMALIZE_MAP[skill];
  }

  return skill;
};

const formatSkill = (skill) => {
  if (!skill || typeof skill !== 'string') return '';
  const normalized = simplifySkill(skill);
  if (DISPLAY_NAME_MAP[normalized]) {
    return DISPLAY_NAME_MAP[normalized];
  }
  return normalized
    .split(' ')
    .map((part) => (part.length > 1 ? `${part[0].toUpperCase()}${part.slice(1)}` : part.toUpperCase()))
    .join(' ');
};

const isLikelyTechToken = (token) => {
  if (!token || token.length < 2) return false;
  if (TECH_STOPWORDS.has(token)) return false;
  if (/^[0-9]+$/.test(token)) return false;
  if (token.includes('#') || token.includes('+')) return true;
  if (/\d/.test(token)) return true;
  if (/\b(js|ts|py|sh|net|sql|db|ai)\b/.test(token)) return true;
  const indicators = [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud', 'graphql', 'rest', 'api', 'git', 'mysql',
    'postgres', 'mongodb', 'sql', 'react', 'vue', 'angular', 'django', 'flask', 'fastapi', 'node',
    'next', 'express', 'spring', 'java', 'python', 'ruby', 'php', 'go', 'golang', 'scala', 'swift',
    'kotlin', 'tensorflow', 'pytorch', 'spark', 'hadoop', 'linux', 'docker', 'jenkins', 'terraform',
    'ansible', 'redis', 'elasticsearch', 'rabbitmq', 'azure', 'github', 'gitlab', 'bitbucket', 'npm',
    'yarn', 'tailwind', 'bootstrap', 'material', 'redux', 'docker', 'docker-compose', 'bash', 'powershell',
  ];
  return indicators.some((term) => token.includes(term));
};

const extractSkillCandidates = (text) => {
  if (!text || typeof text !== 'string') return [];

  let source = text
    .replace(/[“”‘’]/g, "'")
    .replace(/[\r\n]+/g, ' ')
    .replace(/\[|\]|\(|\)|\{|\}/g, ' ')
    .replace(/[/\\]/g, ' ')
    .replace(/[,;:|]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const foundSkills = new Set();

  KNOWN_TECH_PHRASES.forEach((phrase) => {
    const regex = new RegExp(`\b${phrase.replace(/[-[\]{}()*+?.\\^$|]/g, '\\$&')}\b`, 'gi');
    if (regex.test(source)) {
      foundSkills.add(simplifySkill(phrase));
      source = source.replace(regex, ' ');
    }
  });

  const tokens = source.split(/\s+/);
  tokens.forEach((token) => {
    const simplified = simplifySkill(token);
    if (!simplified) return;
    if (TECH_STOPWORDS.has(simplified)) return;
    if (isLikelyTechToken(simplified)) {
      foundSkills.add(simplified);
      return;
    }
    if (simplified.length > 1 && /[a-z]/.test(simplified) && /[0-9+.#]/.test(simplified)) {
      foundSkills.add(simplified);
      return;
    }
  });

  return Array.from(foundSkills);
};

const buildPortfolioSkills = (skillGroups, projectList) => {
  const normalizedSkills = new Set();
  const addSkill = (value) => {
    const normalized = simplifySkill(value);
    if (normalized) normalizedSkills.add(normalized);
  };

  skillGroups?.forEach((group) => {
    group.items?.forEach((skill) => addSkill(skill.name || skill));
  });

  projectList?.forEach((project) => {
    if (project.technologies) {
      extractSkillCandidates(String(project.technologies)).forEach(addSkill);
    }
    if (project.description) {
      extractSkillCandidates(project.description).forEach(addSkill);
    }
    if (project.features) {
      extractSkillCandidates(project.features).forEach(addSkill);
    }
  });

  return Array.from(normalizedSkills);
};

const computeMatchAnalysis = (jobDescription, portfolioSkills) => {
  const jobSkills = extractSkillCandidates(jobDescription);
  const uniqueJobSkills = Array.from(new Set(jobSkills));
  const portfolioSet = new Set(portfolioSkills);

  const matchingSkills = [];
  const missingSkills = [];

  uniqueJobSkills.forEach((skill) => {
    if (portfolioSet.has(skill)) {
      matchingSkills.push(formatSkill(skill));
    } else {
      missingSkills.push(formatSkill(skill));
    }
  });

  const totalDetected = matchingSkills.length + missingSkills.length;
  const percentage = totalDetected > 0 ? Math.round((matchingSkills.length / totalDetected) * 100) : 0;

  return {
    percentage,
    matchingSkills,
    missingSkills,
  };
};

const normalizeResultList = (list) => {
  if (!Array.isArray(list)) return [];
  return Array.from(new Set(list.map((skill) => formatSkill(normalizeSkillName(skill))))).filter(Boolean);
};

const normalizeSkillName = (value) => {
  const normalized = simplifySkill(value);
  return normalized;
};

const SkillMatchModal = ({ open, onClose, skillGroups = [], projectList = [] }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDescription('');
      setIsLoading(false);
      setAnalysis(null);
      setAnimatedPercentage(0);
      setError('');
    }
  }, [open]);

  const portfolioSkills = buildPortfolioSkills(skillGroups, projectList);
  const portfolioPayload = {
    skills: portfolioSkills,
    projects: projectList.map((project) => ({
      technologies: project.technologies || '',
      description: project.description || '',
      features: project.features || '',
    })),
  };

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!description.trim()) return;

    setError('');
    setIsLoading(true);
    setAnalysis(null);

    const localAnalysis = computeMatchAnalysis(description.trim(), portfolioSkills);

    try {
      const result = await matchSkills(description.trim(), portfolioPayload);
      if (result && Array.isArray(result.matchingSkills) && Array.isArray(result.missingSkills)) {
        const matchingSkills = normalizeResultList(result.matchingSkills);
        const missingSkills = normalizeResultList(result.missingSkills);
        const totalDetected = matchingSkills.length + missingSkills.length;
        const percentage = typeof result.percentage === 'number'
          ? Math.round(result.percentage)
          : totalDetected > 0
          ? Math.round((matchingSkills.length / totalDetected) * 100)
          : 0;

        setAnalysis({ percentage, matchingSkills, missingSkills });
      } else {
        setAnalysis(localAnalysis);
      }
    } catch (err) {
      setAnalysis(localAnalysis);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!analysis) {
      setAnimatedPercentage(0);
      return;
    }

    let current = 0;
    const target = analysis.percentage;
    const step = Math.max(1, Math.ceil(target / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedPercentage(target);
        clearInterval(interval);
      } else {
        setAnimatedPercentage(current);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [analysis]);

  const progressBackground = `conic-gradient(
    rgba(37, 99, 235, 0.85) 0% ${animatedPercentage}%,
    rgba(203, 213, 225, 0.3) ${animatedPercentage}% 100%
  )`;

  return (
    <ModalWrapper open={open} onClose={onClose} title="SkillMatch">
      <div className="skillmatch-inner">
        <form className="skillmatch-form" onSubmit={handleAnalyze}>
          <label htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setAnalysis(null);
              setError('');
            }}
            placeholder="Paste the job description text here..."
          />
          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && <div className="skillmatch-error">{error}</div>}

        {isLoading && (
          <div className="analysis-card analysis-loading">
            <div className="loading-dot" />
            <p>Matching skills and insights are being generated...</p>
          </div>
        )}

        {analysis && (
          <div className="skillmatch-result-grid">
            <div className="match-circle-card">
              <div className="match-graph" style={{ background: progressBackground }}>
                <div className="match-graph-inner">
                  <strong>{animatedPercentage}%</strong>
                  <span>Match</span>
                </div>
              </div>
            </div>

            <div className="match-analysis-box">
              <div className="analysis-group-header">
                <h5>Matching Skills</h5>
              </div>
              <div className="skillmatch-list">
                {analysis.matchingSkills.map((skill) => (
                  <div key={skill} className="skillmatch-list-item success">
                    <LuCheckCircle className="skillmatch-list-icon" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="match-analysis-box">
              <div className="analysis-group-header">
                <h5>Missing Skills</h5>
              </div>
              <div className="skillmatch-list">
                {analysis.missingSkills.map((skill) => (
                  <div key={skill} className="skillmatch-list-item missing">
                    <LuXCircle className="skillmatch-list-icon" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default SkillMatchModal;
