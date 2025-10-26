"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CampaignDetails, CampaignDonation, getCampaign, getUserDonationReceipts, DonationReceipt } from "@/lib/sui/rpc";
import { getRelativeTime, truncateAddress } from "@/lib/utils";
import { donateToCampaign } from "@/lib/sui/donate";
import { submitProof } from "@/lib/sui/submit-proof";
import { voteOnCampaign } from "@/lib/sui/vote";
import { withdrawFunds } from "@/lib/sui/withdraw";
import { claimRefund } from "@/lib/sui/refund";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { CampaignPageSkeleton } from "@/components/CampaignPage/CampaignPageSkeleton";
import { CampaignState, VOTE_THRESHOLD } from "@/types/campaign";
import { 
  getCampaignState, 
  getTimeRemaining, 
  formatTimeRemaining,
  getStateDescription,
  canSubmitProof,
  canVote,
  canWithdraw,
  canRefund
} from "@/lib/sui/campaign-state";

export default function CampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [campaign, setCampaign] = useState<CampaignDetails | null | undefined>();
  const [userReceipts, setUserReceipts] = useState<DonationReceipt[]>([]);
  const [isDonating, setIsDonating] = useState<boolean>(false);
  const [isSubmittingProof, setIsSubmittingProof] = useState<boolean>(false);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [isRefunding, setIsRefunding] = useState<boolean>(false);
  const [proofUrl, setProofUrl] = useState("");

  const reloadCampaign = useCallback(() => {
    getCampaign(campaignId).then((res) => {
      setCampaign(res);
    });
  }, [campaignId]);

  const reloadReceipts = useCallback(() => {
    if (currentAccount?.address) {
      getUserDonationReceipts(suiClient, currentAccount.address, campaignId).then((receipts) => {
        setUserReceipts(receipts);
      });
    }
  }, [suiClient, currentAccount?.address, campaignId]);

  useEffect(() => {
    reloadCampaign();
    reloadReceipts();
  }, [reloadCampaign, reloadReceipts]);

  const campaignState = useMemo(() => {
    if (!campaign) return CampaignState.FUNDING;
    return getCampaignState(campaign);
  }, [campaign]);

  const timeRemaining = useMemo(() => {
    if (!campaign) return 0;
    return getTimeRemaining(campaign);
  }, [campaign, campaignState]);

  const recentBackers: CampaignDonation[] = useMemo(() => {
    if (!campaign) return [];
    return campaign.backerData.slice(-5).toReversed();
  }, [campaign]);

  const totalRaised = useMemo(() => {
    if (!campaign) return 0;
    return (campaign.raised || 0) + (campaign.withdrawn_amount || 0) + (campaign.refunded_amount || 0);
  }, [campaign]);

  const votePercentage = useMemo(() => {
    if (!campaign || totalRaised === 0) return 0;
    return (campaign.vote_amount! / totalRaised) * 100;
  }, [campaign, totalRaised]);

  const userAddress = currentAccount?.address || "";
  const isCreator = campaign?.creator.toLowerCase() === userAddress.toLowerCase();
  const userHasReceipts = userReceipts.length > 0;
  const userCanVote = canVote(campaign!) && userHasReceipts && userReceipts.some(r => !r.voted);
  const userCanRefund = canRefund(campaign!) && userHasReceipts;

  if (campaign === undefined) {
    return <CampaignPageSkeleton />;
  }

  if (campaign === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-title mb-4">Campaign not found</h1>
          <Link href="/explore" className="btn btn-primary">
            Browse campaigns
          </Link>
        </div>
      </div>
    );
  }

  const percentage = Math.min((totalRaised / campaign.goal) * 100, 100);
  const quickAmounts = [1, 2.5, 5, 10, 25];
  const isEnded = campaign.is_ended;

  const handleBack = async () => {
    if (isEnded) return;
    const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
    if (amount <= 0) return;

    setIsDonating(true);
    try {
      await donateToCampaign({
        campaignId,
        suiAmount: amount,
        suiClient,
        signAndExecute
      });
      reloadCampaign();
      reloadReceipts();
    } catch (error) {
      console.error("Donation process failed:", error);
    } finally {
      setIsDonating(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofUrl.trim()) return;
    setIsSubmittingProof(true);
    try {
      await submitProof({
        campaignId,
        proofUrl: proofUrl.trim(),
        suiClient,
        signAndExecute
      });
      setProofUrl("");
      reloadCampaign();
    } catch (error) {
      console.error("Proof submission failed:", error);
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const handleVote = async (voteValue: boolean, receiptId: string) => {
    setIsVoting(true);
    try {
      await voteOnCampaign({
        campaignId,
        receiptId,
        vote: voteValue,
        suiClient,
        signAndExecute
      });
      reloadCampaign();
      reloadReceipts();
      // Trigger notification bell refresh
      window.dispatchEvent(new Event('refreshNotifications'));
    } catch (error) {
      console.error("Voting failed:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawFunds({
        campaignId,
        suiClient,
        signAndExecute
      });
      reloadCampaign();
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleRefund = async (receiptId: string) => {
    setIsRefunding(true);
    try {
      await claimRefund({
        campaignId,
        receiptId,
        suiClient,
        signAndExecute
      });
      reloadCampaign();
      reloadReceipts();
    } catch (error) {
      console.error("Refund failed:", error);
    } finally {
      setIsRefunding(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header with back button */}
      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-6">
          <Link
            href="/explore"
            className="text-text-dim hover:text-text transition-colors inline-flex items-center gap-2"
          >
            ← Back to explore
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Campaign State Timeline */}
        <div className="mb-8 p-6 bg-surface rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Campaign Status</h3>
            {timeRemaining > 0 && (
              <span className="text-sm text-text-dim">
                {formatTimeRemaining(timeRemaining)} remaining
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            {[
              { state: CampaignState.FUNDING, label: "Funding" },
              { state: CampaignState.PROOF_SUBMISSION, label: "Proof" },
              { state: CampaignState.VOTING, label: "Voting" },
              { state: CampaignState.SUCCESSFUL, label: "Success" },
            ].map((item, idx) => {
              const stateOrder = [CampaignState.FUNDING, CampaignState.PROOF_SUBMISSION, CampaignState.VOTING, CampaignState.SUCCESSFUL];
              const currentStateIndex = stateOrder.indexOf(campaignState);
              const isCurrentStep = campaignState === item.state;
              const isCompleted = idx < currentStateIndex || campaignState === CampaignState.SUCCESSFUL;
              
              return (
                <div key={item.state} className="flex items-center flex-1">
                  <div
                    className={`flex-1 h-2 rounded-full transition-all ${
                      isCurrentStep
                        ? "bg-accent pulse-blue"
                        : isCompleted
                        ? "bg-accent"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                  {idx < 3 && <div className="w-2" />}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-text-dim">{getStateDescription(campaignState)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content - Left side */}
          <div className="lg:col-span-2">
            {/* Hero image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden mb-8 bg-surface">
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-sm">
                {campaign.category}
              </div>
            </div>

            {/* Title and creator */}
            <div className="mb-8">
              <h1 className="text-title mb-4 wrap-break-word">
                {campaign.title}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full gradient-purple" />
                <div>
                  <p className="text-sm text-text-dim">Created by</p>
                  <p className="font-semibold">
                    {truncateAddress(campaign.creator)}
                  </p>
                </div>
              </div>
            </div>

            {/* Proof Section */}
            {campaignState === CampaignState.PROOF_SUBMISSION && isCreator && !campaign.proof && (
              <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <h3 className="font-semibold mb-4">Submit Proof of Progress</h3>
                <p className="text-sm text-text-dim mb-4">
                  You must submit proof that you are making progress on your campaign promises.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="Enter proof URL or hash"
                    className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={handleSubmitProof}
                    disabled={!proofUrl.trim() || isSubmittingProof}
                    className="btn btn-primary"
                  >
                    {isSubmittingProof ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            )}

            {campaign.proof && (
              <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <h3 className="font-semibold mb-2">Proof of Progress</h3>
                <p className="text-sm text-text-dim mb-2">Creator has submitted proof:</p>
                {campaign.proof.startsWith('http') ? <a
                  href={campaign.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline break-all"
                >
                  {campaign.proof}
                </a> : <p className="break-all">{campaign.proof}</p>}
              </div>
            )}

            {/* Voting Section */}
            {campaignState === CampaignState.VOTING && (
              <div className="mb-8 p-6 bg-surface rounded-xl border border-border">
                <h3 className="font-semibold mb-4">Voting Period</h3>
                <p className="text-sm text-text-dim mb-4">
                  Donors can vote on whether the creator is using funds properly. 51% of funds must vote yes for the campaign to succeed.
                </p>
                
                {/* Voting Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Yes votes: {votePercentage.toFixed(1)}%</span>
                    <span className={votePercentage >= VOTE_THRESHOLD * 100 ? "text-[#34d399]" : "text-[#a78bfa]"}>
                      Threshold: {VOTE_THRESHOLD * 100}%
                    </span>
                  </div>
                  <div className="w-full h-4 bg-bg rounded-full overflow-hidden">
                    <div
                      className={`h-full ${votePercentage >= VOTE_THRESHOLD * 100 ? "gradient-green" : "gradient-blue"} transition-all`}
                      style={{ width: `${Math.min(votePercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-dim mt-1">
                    {campaign.vote_amount?.toFixed(2)} SUI of {totalRaised.toFixed(2)} SUI voted yes
                  </p>
                </div>

                {/* Voting Interface */}
                {userCanVote && (
                  <div className="border-t border-border pt-4">
                    <h4 className="font-semibold mb-3">Cast Your Vote</h4>
                    {userReceipts.filter(r => !r.voted).map((receipt) => (
                      <div key={receipt.id} className="mb-3 p-4 bg-bg rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Your donation: {receipt.amount.toFixed(2)} SUI</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVote(true, receipt.id)}
                            disabled={isVoting}
                            className="flex-1 btn bg-gradient-to-r from-[#34d399] to-[#10b981] hover:opacity-90 text-white transition-opacity"
                          >
                            Vote Yes
                          </button>
                          <button
                            onClick={() => handleVote(false, receipt.id)}
                            disabled={isVoting}
                            className="flex-1 btn bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:opacity-90 text-white transition-opacity"
                          >
                            Vote No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {userReceipts.length > 0 && !userCanVote && (
                  <p className="text-sm text-text-dim text-center">You have already voted.</p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                about this project
              </h2>
              <p className="text-text-dim leading-relaxed wrap-break-word whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>

            {/* Recent backers */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">recent backers</h2>
              <div className="space-y-3">
                {recentBackers.map((backer, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-purple" />
                      <div>
                        <p className="font-semibold">
                          {truncateAddress(backer.donator)}
                        </p>
                        <p className="text-sm text-text-dim">
                          {getRelativeTime(backer.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="font-semibold gradient-text-blue">
                      {backer.amount} SUI
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Funding stats */}
              <div className="p-6 bg-surface rounded-xl border border-border mb-6">
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-stat-md gradient-text-blue">
                      {totalRaised.toLocaleString()} SUI
                    </span>
                  </div>
                  <p className="text-text-dim mb-4">
                    of {campaign.goal.toLocaleString()} SUI goal
                  </p>
                  {(campaign.withdrawn_amount || 0) > 0 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                      ✓ {(campaign.withdrawn_amount || 0).toFixed(2)} SUI withdrawn by creator
                    </p>
                  )}
                  {(campaign.refunded_amount || 0) > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mb-2">
                      ↩ {(campaign.refunded_amount || 0).toFixed(2)} SUI refunded to donors
                    </p>
                  )}
                  <div className="w-full h-3 bg-bg rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full gradient-blue transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className={`grid ${!isEnded ? 'grid-cols-2' : 'grid-cols-1'} gap-4 text-center mb-6`}>
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {campaign.backers}
                      </div>
                      <div className="text-sm text-text-dim">backers</div>
                    </div>
                    {!isEnded && (
                      <div>
                        <div className="text-2xl font-bold mb-1">
                          {campaign.daysLeft}
                        </div>
                        <div className="text-sm text-text-dim">days left</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {campaignState === CampaignState.SUCCESSFUL && isCreator && campaign.raised > 0 && (
                  <div className="border-t border-border pt-6">
                    <button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing}
                      className="btn btn-primary w-full"
                    >
                      {isWithdrawing ? "Withdrawing..." : `Withdraw ${campaign.raised.toFixed(2)} SUI`}
                    </button>
                  </div>
                )}

                {campaignState === CampaignState.SUCCESSFUL && (campaign.withdrawn_amount || 0) > 0 && (
                  <div className="border-t border-border pt-6">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        ✓ Funds Successfully Withdrawn
                      </p>
                      <p className="text-xs text-text-dim mt-1">
                        {(campaign.withdrawn_amount || 0).toFixed(2)} SUI withdrawn
                      </p>
                    </div>
                  </div>
                )}

                {userCanRefund && (
                  <div className="border-t border-border pt-6">
                    <h4 className="font-semibold mb-3">Claim Your Refund</h4>
                    {userReceipts.map((receipt) => (
                      <button
                        key={receipt.id}
                        onClick={() => handleRefund(receipt.id)}
                        disabled={isRefunding}
                        className="btn btn-primary w-full mb-2"
                      >
                        {isRefunding ? "Processing..." : `Refund ${receipt.amount.toFixed(2)} SUI`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Backing section */}
                {campaignState === CampaignState.FUNDING && !isEnded && (
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">Back this project</h3>

                    {/* Quick amounts */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            selectedAmount === amount
                              ? "bg-accent text-white"
                              : "bg-bg hover:bg-surface border border-border"
                          }`}
                        >
                          {amount} SUI
                        </button>
                      ))}
                    </div>

                    {/* Custom amount */}
                    <div className="mb-4">
                      <label className="block text-sm text-text-dim mb-2">
                        Or enter custom amount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          placeholder="0.00"
                          className="w-full pl-4 pr-10 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-accent"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim">
                          SUI
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBack}
                      disabled={
                        !selectedAmount &&
                        (!customAmount || parseFloat(customAmount) <= 0) &&
                        !isDonating
                      }
                      className={`btn w-full ${
                        selectedAmount ||
                        (customAmount && parseFloat(customAmount) > 0) ||
                        isDonating
                          ? "btn-primary"
                          : "bg-surface text-text-dim cursor-not-allowed"
                      }`}
                    >
                      Back this project
                    </button>

                    <p className="text-xs text-text-dim text-center mt-4">
                      Funds are held in smart contract until goal is reached
                    </p>
                  </div>
                )}
              </div>

              {/* Info box */}
              <div className="p-6 bg-surface rounded-xl border border-border">
                <h3 className="font-semibold mb-4">how it works</h3>
                <ul className="space-y-3 text-sm text-text-dim">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>All funds held in smart contract</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Creator must submit proof after deadline</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Donors vote on proof validity</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>51% yes votes required for withdrawal</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Refunds available if vote fails</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
