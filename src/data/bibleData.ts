import ptNviData from './pt_nvi.json';

export interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

export const getBibleData = (): BibleBook[] => ptNviData as BibleBook[];
