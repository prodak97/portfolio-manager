export type Skill = {
  name: string;
  category: string;
  proficiency: string;
};

export type CoreCompetency = {
  category: string;
  description: string;
};

export type AdditionalDetail = {
  category: string;
  description: string;
};

export type Certificate = {
  name: string;
  issuer: string;
  date: string;
  url: string;
};

export type Event = {
  title: string;
  description: string;
  image?: string;
  date: string;
};

export type AIProject = {
  title: string;
  description: string;
  technologies: string[];
};

export type AIExperience = {
  description: string;
  currentInvestigation: string;
  achievements: string[];
  projects: AIProject[];
};

export type Project = {
  name: string;
  description: string;
  technologiesUsed: string[];
  date: string;
  endDate?: string;
  website?: string;
};

export type EducationEntry = {
  name: string;
  degree: string;
  startDate: string;
  endDate: string;
};

export type PortfolioInfo = {
  name: string;
  bio: string;
  professionalSummary: string;
  email: string;
  linkedin: string;
  location: string;
  imageUrl: string;
  languages: string[];
  education: EducationEntry[];
  skills: Skill[];
  projects: Project[];
  coreCompetencies: CoreCompetency[];
  additionalDetails: AdditionalDetail[];
  certificates: Certificate[];
  events: Event[];
  aiExperience: AIExperience;
};
