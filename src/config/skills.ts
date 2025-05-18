/**
 * Organized list of skills displayed in the SkillTyper component
 */
export const SKILLS = {
  languages: [
    "TypeScript",
    "JavaScript",
    "Python",
    "C/C++",
    "SQL"
  ],
  frontend: [
    "React",
    "Next.js",
    "HTML5",
    "CSS3",
    "Tailwind CSS"
  ],
  backend: [
    "Node.js",
    "Express",
    "REST APIs",
    "PostgreSQL"
  ],
  devops: [
    "AWS",
    "Docker",
    "Git",
    "Linux"
  ],
  tools: [
    "GitHub",
    "VSCode"
  ],
  concepts: [
    "Machine Learning",
    "Artificial Intelligence",
    "Agile Development"
  ]
} as const;

/**
 * Flattened array of all skills for the SkillTyper component
 */
export const ALL_SKILLS = Object.values(SKILLS).flat(); 