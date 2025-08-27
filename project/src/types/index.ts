// Core domain types for UNSC Recruitment Portal
export interface Candidate {
  id: string;
  personalInfo: PersonalInfo;
  division: Division;
  status: CandidateStatus;
  testResults: TestResults;
  registrationDate: Date;
  lastUpdate: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  nationality: string;
  physicalCondition: PhysicalCondition;
  education: EducationLevel;
  militaryExperience: boolean;
}

export type Division = 'marine' | 'odst' | 'spartan';

export type CandidateStatus = 'pending' | 'approved' | 'rejected' | 'in-review';

export interface TestResults {
  reactionTime: number;
  accuracy: number;
  strategicThinking: number;
  overallScore: number;
  completedTests: string[];
}

export type PhysicalCondition = 'excellent' | 'good' | 'fair' | 'poor';
export type EducationLevel = 'high-school' | 'bachelor' | 'master' | 'doctorate';

export interface DivisionRequirements {
  division: Division;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  minPhysicalCondition: PhysicalCondition;
  minEducation: EducationLevel;
  militaryExperienceRequired: boolean;
  specialRequirements: string[];
}

export interface GameScore {
  gameType: string;
  score: number;
  timestamp: Date;
  maxPossibleScore: number;
}