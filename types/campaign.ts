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
  deadline?: number;
  proof?: string;
  vote_amount?: number;
  withdrawn_amount?: number;
  refunded_amount?: number;
  is_ended: boolean;
}

export enum CampaignState {
  FUNDING = 'FUNDING',
  FAILED = 'FAILED',
  PROOF_SUBMISSION = 'PROOF_SUBMISSION',
  VOTING = 'VOTING',
  SUCCESSFUL = 'SUCCESSFUL',
  REJECTED = 'REJECTED'
}

export const CAMPAIGN_CATEGORIES: string[] = [
  "all",
  "tech",
  "art",
  "gaming",
  "fashion",
  "education"
];

// Time constants (in milliseconds)
export const PROOF_PERIOD_MS = 259200000; // 3 days
export const VOTING_PERIOD_MS = 259200000; // 3 days
export const VOTE_THRESHOLD = 0.51; // 51% of raised funds
