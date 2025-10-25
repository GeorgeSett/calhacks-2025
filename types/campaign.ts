export interface Campaign {
  id: number;
  title: string;
  description: string;
  creator: string;
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  category: CampaignCategory;
  image: string;
}

export type CampaignCategory =
  | "all"
  | "tech"
  | "art"
  | "gaming"
  | "fashion"
  | "education";

export const CAMPAIGN_CATEGORIES: CampaignCategory[] = [
  "all",
  "tech",
  "art",
  "gaming",
  "fashion",
  "education"
];
