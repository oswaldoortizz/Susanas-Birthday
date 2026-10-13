export type GameStep = 1 | 2 | 3 | 4 | 5;

export type CompanionMood = 'idle' | 'victory' | 'error';

export interface CompanionState {
  ariText: string;
  riversText: string;
  mood: CompanionMood;
}

export interface ViolaNote {
  id: 'C' | 'G' | 'D' | 'A';
  name: string;
  frequency: number;
  color: string;
  staffY: number;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  description: string;
  tag: string;
  color: string;
}

export interface TimelineMoment {
  id: string;
  title: string;
  description: string;
  correctIndex: number;
  icon: string;
}

export interface LoreMatchItem {
  id: string;
  moment: string;
  reactionPhrase: string;
}
