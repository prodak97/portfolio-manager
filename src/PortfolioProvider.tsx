import React, { createContext, useState } from 'react';
import { PortfolioInfo } from './App';

const defaultInfo: PortfolioInfo = {
  name: 'Hui Sobachiy',
  bio: 'Web Developer | Designer | Programmer',
  professionalSummary: 'Experienced full-stack developer with a passion for building scalable web applications and leading engineering teams.',
  email: 'jane.doe@email.com',
  linkedin: 'linkedin.com/in/janedoe',
  resumeUrl: 'https://example.com/jane-doe-resume.pdf',
  location: 'San Francisco, CA',
  imageUrl: '/img/download (2).png',
  languages: ['English', 'Spanish'],
  education: [
    { name: 'Stanford University', degree: 'B.Sc. in Computer Science', startDate: '2015-09-01', endDate: '2019-06-01' },
    { name: 'MIT', degree: 'M.Sc. in Software Engineering', startDate: '2019-09-01', endDate: '2021-06-01' },
  ],
  skills: [
    { name: 'React', category: 'Frontend', proficiency: 'Advanced' },
    { name: 'TypeScript', category: 'Frontend', proficiency: 'Intermediate' },
    { name: 'Node.js', category: 'Backend', proficiency: 'Intermediate' },
    { name: 'CSS', category: 'Frontend', proficiency: 'Advanced' },
  ],
  projects: [
    { name: 'Project One', description: 'Description of project one.', technologiesUsed: ['React', 'CSS'], date: '2024-01-01', endDate: '2024-03-01', website: 'https://example.com/project-one' },
    { name: 'Project Two', description: 'Description of project two.', technologiesUsed: ['TypeScript', 'Node.js'], date: '2024-02-01', endDate: '2024-04-01', website: 'https://example.com/project-two' },
  ],
  coreCompetencies: [
    { category: 'Frontend', description: 'Frontend development skills' },
    { category: 'Backend', description: 'Backend development skills' },
    { category: 'Tools', description: 'Development tools and utilities' },
  ],
  additionalDetails: [],
};

export const PortfolioContext = createContext({
  info: defaultInfo,
  setInfo: (_: PortfolioInfo) => {},
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [info, setInfo] = useState<PortfolioInfo>(defaultInfo);
  return (
    <PortfolioContext.Provider value={{ info, setInfo }}>
      {children}
    </PortfolioContext.Provider>
  );
}
