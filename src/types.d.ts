export interface User {
  id: number;
  name: string;
  userSettings: UserSettings;
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
