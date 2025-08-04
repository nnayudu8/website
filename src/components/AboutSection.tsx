/**
 * AboutSection Component
 * A clean, modern layout for displaying personal information
 * Features:
 * - Gradient text accents
 * - Smooth hover effects
 * - Responsive grid layout
 * - Timeline-style experience
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const EXPERIENCE = [
  {
    role: 'Software Engineer Intern',
    company: 'CGI',
    logo: '/logos/cgi.png',
    description: 'Building agentic AI framework leveraging MCP to automate SDLC processes and streamline client integration.'
  },
  {
    role: 'Software Engineer Intern',
    company: '4Human Corporation',
    logo: '/logos/4human.png',
    description: 'Engineered full-stack features and refactored APIs to speed up dev cycles for a charitable e-commerce client.'
  },
  {
    role: 'Instructional Aide (TA)',
    company: 'University of Michigan',
    logo: '/logos/umich.png',
    description: 'Taught 1,000+ students data structures while co-leading exam design and mentoring TAs.'
  }
];

const EDUCATION = {
  school: 'University of Michigan',
  degree: 'B.S.E. in Computer Science',
  period: '2022 - 2026',
  focus: 'AI/ML, Software Engineering',
  courses: ['Data Structures & Algorithms', 'Machine Learning', 'Web Systems', 'Distributed Systems', 'Operating Systems', 'Computer Security', 'Networking'],
  logo: '/logos/umich.png'
};

export default function AboutSection() {
  const [openDescriptions, setOpenDescriptions] = useState<number[]>([]);

  const toggleDescription = (index: number) => {
    setOpenDescriptions(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {/* About Me Section */}
      <div className="mb-20">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
          About Me
        </h2>
        <div className="text-lg text-gray-300 space-y-3 max-w-7xl">
          <p>I work like a <span className="text-emerald-400 font-semibold">point guard</span>. I see the system, anticipate the next move, and help the team execute clean.</p>
          <p>From <span className="text-emerald-400/80 font-medium">resume optimizers</span> to data structures to <span className="text-emerald-400/80 font-medium">computer vision DJs</span>, I build where work meets creativity.</p>
          <p>Outside the terminal, I&apos;m <span className="text-emerald-400/80 font-medium">mentoring devs</span>, building side projects, or chasing the <span className="text-emerald-400/80 font-medium">next great playlist</span>.</p>
        </div>
      </div>

      {/* Experience and Education Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Experience Section */}
        <div>
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="space-y-12">
            {EXPERIENCE.map((job, index) => (
              <div 
                key={index}
                className="group relative pl-8 border-l-2 border-emerald-400/20 hover:border-emerald-400/40 transition-colors duration-300"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-400/20 group-hover:bg-emerald-400/40 transition-colors duration-300" />
                <div 
                  className="flex items-start gap-4 mb-2 cursor-pointer"
                  onClick={() => toggleDescription(index)}
                >
                  {/* Logo container */}
                  <div className="w-14 h-14 rounded-lg bg-white/5 border border-emerald-400/10 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={job.logo} 
                      alt={`${job.company} logo`}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {job.company}
                    </h3>
                    <p className="text-emerald-400/80 font-medium">{job.role}</p>
                  </div>
                </div>
                {/* Description that appears on hover or click */}
                <div 
                  className={`max-h-0 opacity-0 transition-all duration-500 ease-in-out overflow-hidden
                    ${openDescriptions.includes(index) ? 'max-h-20 opacity-100' : 'group-hover:max-h-20 group-hover:opacity-100'}`}
                >
                  <p className="text-gray-300 mt-2">{job.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Education
          </h2>
          <div className="relative">
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(6px)'}} />
            <div className="relative z-10 bg-gradient-to-br from-emerald-400/5 to-blue-400/5 rounded-2xl p-8 border border-emerald-400/10 h-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Logo container */}
                  <div className="w-20 h-20 rounded-lg bg-white/5 border border-emerald-400/10 flex items-center justify-center overflow-hidden">
                    <Image 
                      src={EDUCATION.logo} 
                      alt={`${EDUCATION.school} logo`}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{EDUCATION.school}</h3>
                    <p className="text-emerald-400/80 font-medium mt-1">{EDUCATION.degree}</p>
                  </div>
                </div>
                <p className="text-gray-400 mt-2 md:mt-0">{EDUCATION.period}</p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300">
                  <span className="text-emerald-400/80">Focus:</span> {EDUCATION.focus}
                </p>
                <div>
                  <p className="text-emerald-400/80 mb-2">Key Courses:</p>
                  <div className="flex flex-wrap gap-2">
                    {EDUCATION.courses.map((course, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-emerald-400/10 text-emerald-400/80 border border-emerald-400/20"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 