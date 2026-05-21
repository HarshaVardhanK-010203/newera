export interface UserProfile {
  username: string;
  email: string;
  role: 'Student' | 'Mentor' | 'Admin';
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  weeklyStreak: number;
  completedTopics: string[]; // topic ID list
  completedQuizzedTopics: string[];
  bookmarks: string[]; // topic ID list
  completedChallenges: string[];
  completedProjects: string[]; // project ID list
  timeSpentMinutes: number;
  consistencyScore: number;
  projectedCompletionDate: string;
  notes: { [topicId: string]: string };
  // Firebase Auth additions
  uid?: string;
  name?: string;
  photoURL?: string;
  joinedDate?: string;
  completedLessons?: string[];
  learningHours?: number;
}

export interface TopicSyntax {
  syntax: string;
  explanation: string;
  parameters: string;
  example: string;
  output: string;
  notes: string;
}

export interface PracticeTask {
  id: string;
  instructions: string;
  startingCode?: string;
  solutionCode?: string;
  testCases?: { input?: string; expectedOutput: string; assertion: string }[];
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface YouTubeTutorial {
  title: string;
  videoId: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Project';
}

export interface Topic {
  id: string;
  sectionId: string;
  title: string;
  whyExists: string;
  realWorldUse: string;
  explanation: string;
  syntaxRef: TopicSyntax;
  visualDiagram: string; // ASCII or visual HTML structure description
  commonMistakes: string[];
  practiceTask: PracticeTask;
  mcqs: MCQQuestion[];
  miniChallenge: {
    title: string;
    description: string;
    startingCode: string;
  };
  projectChallenge: {
    title: string;
    description: string;
    startingCode: string;
  };
  youtubeVideos: YouTubeTutorial[];
  externalResources: { title: string; url: string }[];
}

export interface CurriculumSection {
  id: string;
  title: string;
  topics: Topic[];
}

export interface CodePlaygroundState {
  html: string;
  css: string;
  js: string;
  language: 'html' | 'css' | 'js' | 'react';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface SavedNote {
  id: string;
  topicId: string;
  topicTitle: string;
  content: string;
  updatedAt: string;
}

export interface LeaderboardUser {
  username: string;
  role: string;
  xp: number;
  level: number;
  streak: number;
}

export interface InterviewHubQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'FAANG' | 'HR';
  sampleAnswer: string;
  tips: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  salaryRange: string;
  description: string;
  keySkills: string[];
  timeline: string[];
}
