export interface User {
  id: number;
  name: string;
  currentWordlist: Wordlist;
  progress: any;
};

export interface Wordlist {
  id: number;
  name: string;
};
