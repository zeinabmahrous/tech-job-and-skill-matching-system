import { JobRole } from '../types';

export const EGYPTIAN_LOCATIONS = [
  'Cairo',
  'Giza',
  'Alexandria',
  'Damietta',
  'Mansoura',
  'Tanta',
  'Assiut',
  'Smart Village (6th of October)',
  'New Cairo (Fifth Settlement)',
  'Ismailia (Suez Canal Hub)'
];

export const TECH_JOB_ROLES: JobRole[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Engineering & Architecture',
    vocationalPrograms: [
      'Computer Science & Engineering',
      'Software Development Track',
      'Full Stack Development Track',
      'Computers and Artificial Intelligence'
    ],
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'System Design & Architecture',
      'Database Management (SQL/NoSQL)',
      'Version Control - Git/GitHub'
    ],
    defaultReqs: [8, 8, 7, 7, 6],
    minExpMonths: 12,
    description: 'Builds scalable backend/core software systems, algorithms, and distributed computing services.'
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist & AI Specialist',
    category: 'AI & Data Science',
    vocationalPrograms: [
      'AI & Machine Learning Track',
      'Data Analytics Professional Track',
      'Computer Science (Data Science Major)',
      'Digital Egypt Pioneers Initiative'
    ],
    skills: [
      'Python & Libraries (Pandas/NumPy)',
      'Machine Learning Algorithms',
      'Deep Learning & Neural Networks',
      'Data Preprocessing & Cleaning',
      'SQL & Data Visualization'
    ],
    defaultReqs: [9, 8, 7, 8, 7],
    minExpMonths: 6,
    description: 'Designs ML/DL models, predictive analytics pipelines, and actionable intelligence from large datasets.'
  },
  {
    id: 'full-stack-developer',
    title: 'Full Stack Web Developer',
    category: 'Web & Cloud',
    vocationalPrograms: [
      'Frontend & UI Development Track',
      'Open Source Development Track',
      'Frontend/Backend MERN Specialization',
      'Web Development Track'
    ],
    skills: [
      'HTML/CSS/JavaScript & TypeScript',
      'Frontend Framework (React/Next.js)',
      'Backend Development (Node.js/Django/Go)',
      'Databases (MongoDB/PostgreSQL)',
      'RESTful APIs & Microservices'
    ],
    defaultReqs: [9, 8, 8, 7, 8],
    minExpMonths: 6,
    description: 'Delivers full end-to-end responsive web applications from database architecture to interactive UIs.'
  },
  {
    id: 'it-support',
    title: 'IT Support & Infrastructure Engineer',
    category: 'IT & Operations',
    vocationalPrograms: [
      'IT Support & Operations Track',
      'Networks & Systems Administration',
      'Information Technology & Cisco Academy',
      'National Telecommunication Institute (NTI)'
    ],
    skills: [
      'Troubleshooting & Diagnostics',
      'Networking & CCNA Routing',
      'Operating Systems (Windows/Linux)',
      'Hardware & Server Maintenance',
      'Customer Support & ITIL Ticketing'
    ],
    defaultReqs: [8, 7, 7, 6, 8],
    minExpMonths: 3,
    description: 'Maintains enterprise servers, enterprise networking topologies, helpdesk workflows, and system uptime.'
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Security & Forensics',
    vocationalPrograms: [
      'Cybersecurity Professional Track',
      'Information Security & Ethical Hacking',
      'Networks Security & SOC Operations',
      'Cybersecurity Track'
    ],
    skills: [
      'Network Security & Firewalls',
      'Vulnerability Assessment & PenTesting',
      'Linux Administration & Bash/Python Scripting',
      'Incident Response & SIEM Monitoring',
      'Security Tools (Wireshark, Metasploit, Splunk)'
    ],
    defaultReqs: [8, 8, 7, 7, 8],
    minExpMonths: 12,
    description: 'Secures networks and applications against cyber threats, conducts vulnerability assessments, and runs SOC monitoring.'
  }
];

export interface ProfilePreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  profile: {
    age: number;
    gender: 'Male' | 'Female';
    academicPerformance: number;
    certificationsCount: number;
    internshipExperience: number;
    location: string;
    jobTitle: string;
    skills: number[];
  };
}

export const SAMPLE_PRESETS: ProfilePreset[] = [
  {
    id: 'no-match-skill-gap',
    name: 'Candidate with Skill Deficits (No Match Demo)',
    badge: 'Gap Diagnostic',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    description: 'A Junior Engineer who is 2-4 points below benchmarks in Algorithms & Architecture, showing the refined No-Match visualizations.',
    profile: {
      age: 23,
      gender: 'Male',
      academicPerformance: 76.5,
      certificationsCount: 1,
      internshipExperience: 4,
      location: 'Cairo',
      jobTitle: 'Software Engineer',
      skills: [4, 5, 3, 5, 4] // low vs 8,8,7,7,6
    }
  },
  {
    id: 'borderline-candidate',
    name: 'Borderline Profile (Minor Gap)',
    badge: 'Close Match',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Close to requirements but has 1 or 2 small gaps and slight experience deficiency.',
    profile: {
      age: 24,
      gender: 'Female',
      academicPerformance: 88.0,
      certificationsCount: 2,
      internshipExperience: 8,
      location: 'Alexandria',
      jobTitle: 'Full Stack Web Developer',
      skills: [9, 7, 6, 6, 7] // close to 9,8,8,7,8
    }
  },
  {
    id: 'strong-match',
    name: 'Top Qualified Profile (Strong Match)',
    badge: 'Success',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'High skills meeting or exceeding all required benchmarks, triggers successful match screen.',
    profile: {
      age: 25,
      gender: 'Male',
      academicPerformance: 94.0,
      certificationsCount: 4,
      internshipExperience: 14,
      location: 'Smart Village (6th of October)',
      jobTitle: 'Data Scientist & AI Specialist',
      skills: [10, 9, 8, 9, 8] // meets 9,8,7,8,7
    }
  }
];
