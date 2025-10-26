"use client";
import { useEffect, useState, useRef } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import Link from "next/link";
import { getAllCampaigns, getUserDonationReceipts, DonationReceipt } from "@/lib/sui/rpc";
import { Campaign, CampaignState } from "@/types/campaign";
import { getCampaignState } from "@/lib/sui/campaign-state";

interface VotingNotification {
  campaign: Campaign;
  receipt: DonationReceipt;
}

export default function NotificationBell() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [notifications, setNotifications] = useState<VotingNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Fetch voting notifications
  useEffect(() => {
    async function fetchNotifications() {
      if (!currentAccount?.address || !suiClient) {
        setNotifications([]);
        return;
      }

      setLoading(true);
      try {
        // Get all campaigns
        const campaigns = await getAllCampaigns(suiClient);
        if (!campaigns) {
          setNotifications([]);
          return;
        }

        // Get user's donation receipts
        const receipts = await getUserDonationReceipts(suiClient, currentAccount.address);
        if (!receipts || receipts.length === 0) {
          setNotifications([]);
          return;
        }

        // Filter campaigns that are in VOTING state and user has not voted
        const votingNotifications: VotingNotification[] = [];
        const currentTime = Date.now();

        for (const receipt of receipts) {
          // Skip if user already voted
          if (receipt.voted) continue;

          // Find the campaign
          const campaign = campaigns.find(c => c.id === receipt.campaign_id);
          if (!campaign) continue;

          // Check if campaign is in VOTING state
          const state = getCampaignState(campaign, currentTime);
          if (state === CampaignState.VOTING) {
            votingNotifications.push({ campaign, receipt });
          }
        }

        setNotifications(votingNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();

    // Listen for manual refresh requests
    const handleRefreshEvent = () => {
      fetchNotifications();
    };
    window.addEventListener('refreshNotifications', handleRefreshEvent);

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshNotifications', handleRefreshEvent);
    };
  }, [currentAccount?.address, suiClient]);

  // Don't show if not connected
  if (!currentAccount) return null;

  const notificationCount = notifications.length;
  const hasNotifications = notificationCount > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 transition-colors ${
          hasNotifications ? 'text-text' : 'text-text-dim hover:text-text'
        }`}
        aria-label={`Notifications${hasNotifications ? ` (${notificationCount})` : ''}`}
      >
        {/* Bell Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {/* Notification Badge - Always visible when there are notifications */}
        {hasNotifications && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-bg">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed sm:absolute right-4 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-bg border border-border rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-text">Voting Required</h3>
            <p className="text-sm text-text-dim mt-1">
              {notificationCount === 0
                ? "No pending votes"
                : `${notificationCount} campaign${notificationCount !== 1 ? "s" : ""} need${notificationCount === 1 ? "s" : ""} your vote`}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center text-text-dim">
                <div className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2">Loading notifications...</p>
              </div>
            ) : notificationCount === 0 ? (
              <div className="px-4 py-8 text-center text-text-dim">
                <p>You're all caught up!</p>
                <p className="text-sm mt-1">No campaigns need your vote right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(({ campaign, receipt }) => (
                  <Link
                    key={campaign.id}
                    href={`/campaign/${campaign.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-bg-elevated transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-bg-elevated">
                        {campaign.image ? (
                          <img
                            src={campaign.image}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📊
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text text-sm truncate">
                          {campaign.title}
                        </p>
                        <p className="text-xs text-text-dim mt-1">
                          Vote on campaign progress
                        </p>
                        <p className="text-xs text-accent mt-1">
                          Your donation: {receipt.amount.toFixed(2)} SUI
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}