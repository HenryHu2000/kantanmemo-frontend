export interface User {
  id: number;
  name: string;
  userSettings: UserSettings | null;
  progress: any;
};

export interface UserSettings {
  currentWordlistId?: number;
  dailyNewWordNum: number;
  dailyRevisingWordNum: number;
};

export interface Wordlist {
  id: number;
  name: string;
};

export interface Word {
  id: number;
  name: string;
  hint: string;
  definition: string;
}

export interface WordLearningData {
  id: number;
  word: Word;
  familiarity: number;
  lastSeen: string;
  wordKnownType: 'UNKNOWN' | 'HALF_KNOWN' | 'KNOWN';
}
