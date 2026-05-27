export interface Project {
  name: string;
  description: string;
  tags: string[];
  url?: string;
  year: string;
}

export const PROJECTS: Project[] = [
  {
    name: 'Resume Optimizer',
    description: 'AI-powered resume analysis and keyword optimization tool built for job seekers.',
    tags: ['Python', 'NLP', 'React'],
    year: '2024',
  },
  {
    name: 'Vision DJ',
    description: 'Computer vision system that maps musical overlays to real-time video input.',
    tags: ['Python', 'OpenCV', 'ML'],
    year: '2024',
  },
];
