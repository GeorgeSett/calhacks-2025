import { Campaign, CampaignState, VOTE_THRESHOLD } from "@/types/campaign";
import { PROOF_SUBMISSION_PERIOD, VOTING_PERIOD } from "./constants";

/**
 * Calculate the current state of a campaign based on its properties and current time
 */
export function getCampaignState(campaign: Campaign, currentTime: number = Date.now()): CampaignState {
  const deadline = campaign.deadline || 0;
  const raised = campaign.raised || 0;
  const withdrawnAmount = campaign.withdrawn_amount || 0;
  const refundedAmount = campaign.refunded_amount || 0;
  const goal = campaign.goal || 0;
  const proof = campaign.proof || "";
  const voteAmount = campaign.vote_amount || 0;

  // If funds have been withdrawn, campaign is successful
  if (withdrawnAmount > 0) {
    return CampaignState.SUCCESSFUL;
  }

  // If we haven't reached the deadline yet, campaign is in funding period
  if (currentTime < deadline) {
    return CampaignState.FUNDING;
  }

  // After deadline: check if goal was met
  // Use withdrawn_amount + raised + refunded_amount to account for all funds
  const totalRaised = raised + withdrawnAmount + refundedAmount;
  if (totalRaised < goal) {
    return CampaignState.FAILED;
  }

  // Goal was met, now check proof submission
  const proofDeadline = deadline + PROOF_SUBMISSION_PERIOD;
  
  // If no proof and proof period has expired
  if (proof === "" && currentTime > proofDeadline) {
    return CampaignState.FAILED;
  }

  // If no proof and still within proof period
  if (proof === "" && currentTime <= proofDeadline) {
    return CampaignState.PROOF_SUBMISSION;
  }

  // Proof was submitted, check voting period
  const votingDeadline = deadline + PROOF_SUBMISSION_PERIOD + VOTING_PERIOD;
  
  // Still within voting period
  if (currentTime <= votingDeadline) {
    return CampaignState.VOTING;
  }

  // Voting period ended, check results
  // Use totalRaised for vote threshold calculation
  const voteThreshold = totalRaised * VOTE_THRESHOLD;
  
  if (voteAmount >= voteThreshold) {
    return CampaignState.SUCCESSFUL;
  } else {
    return CampaignState.REJECTED;
  }
}

/**
 * Get time remaining in current period (in milliseconds)
 */
export function getTimeRemaining(campaign: Campaign, currentTime: number = Date.now()): number {
  const state = getCampaignState(campaign, currentTime);
  const deadline = campaign.deadline || 0;

  switch (state) {
    case CampaignState.FUNDING:
      return Math.max(0, deadline - currentTime);
    
    case CampaignState.PROOF_SUBMISSION:
      return Math.max(0, (deadline + PROOF_SUBMISSION_PERIOD) - currentTime);
    
    case CampaignState.VOTING:
      return Math.max(0, (deadline + PROOF_SUBMISSION_PERIOD + VOTING_PERIOD) - currentTime);
    
    default:
      return 0;
  }
}

/**
 * Format milliseconds to a readable time string (e.g., "2 days, 3 hours")
 */
export function formatTimeRemaining(ms: number): string {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}${hours > 0 ? `, ${hours} hour${hours !== 1 ? 's' : ''}` : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? `, ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
}

/**
 * Get user-friendly state description
 */
export function getStateDescription(state: CampaignState): string {
  switch (state) {
    case CampaignState.FUNDING:
      return "Campaign is currently accepting donations";
    
    case CampaignState.FAILED:
      return "Campaign did not reach its goal or proof was not submitted. Donors can claim refunds.";
    
    case CampaignState.PROOF_SUBMISSION:
      return "Waiting for creator to submit proof of progress";
    
    case CampaignState.VOTING:
      return "Voting period is active. Donors can vote on whether the creator is using funds properly.";
    
    case CampaignState.SUCCESSFUL:
      return "Campaign successful! The creator can withdraw funds.";
    
    case CampaignState.REJECTED:
      return "Vote did not pass. Donors can claim refunds.";
    
    default:
      return "";
  }
}

/**
 * Check if user can perform specific actions based on campaign state
 */
export function canSubmitProof(campaign: Campaign, userAddress: string, currentTime: number = Date.now()): boolean {
  const state = getCampaignState(campaign, currentTime);
  const isCreator = campaign.creator.toLowerCase() === userAddress.toLowerCase();
  const hasNoProof = (campaign.proof || "") === "";
  
  return state === CampaignState.PROOF_SUBMISSION && isCreator && hasNoProof;
}

export function canVote(campaign: Campaign, currentTime: number = Date.now()): boolean {
  if (!campaign) {
      return false;
  }
  
  const state = getCampaignState(campaign, currentTime);
  return state === CampaignState.VOTING;
}

export function canWithdraw(campaign: Campaign, userAddress: string, currentTime: number = Date.now()): boolean {
  const state = getCampaignState(campaign, currentTime);
  const isCreator = campaign.creator.toLowerCase() === userAddress.toLowerCase();
  
  return state === CampaignState.SUCCESSFUL && isCreator;
}

export function canRefund(campaign: Campaign, currentTime: number = Date.now()): boolean {
  if (!campaign) {
    return false;
  }
  
  const state = getCampaignState(campaign, currentTime);
  return state === CampaignState.FAILED || state === CampaignState.REJECTED;
}