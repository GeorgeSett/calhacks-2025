export interface Campaign {
  id: string;
  title: string;
  description: string;
  creator: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  category: string;
  image: string;
}

export const CAMPAIGN_CATEGORIES: string[] = [
  "all",
  "tech",
  "art",
  "gaming",
  "fashion",
  "education"
];
