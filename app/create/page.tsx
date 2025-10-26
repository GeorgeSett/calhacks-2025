"use client";
import { useState, useEffect, useMemo } from "react";
import { useCurrentAccount, ConnectButton, useSuiClient } from "@mysten/dapp-kit";
import { CampaignCard } from "@/components/ExplorePage/CampaignCard";
import { CampaignCardSkeleton } from "@/components/ExplorePage/CampaignCardSkeleton";
import { CreateCampaignModal } from "@/components/CreatePage/CreateCampaignModal";
import Header from "@/components/layout/Header";
import { Plus } from "lucide-react";
import { getAllCampaigns } from "@/lib/sui/rpc";
import { Campaign } from "@/types/campaign";

export default function CreatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [allCampaigns, setAllCampaigns] = useState<Campaign[] | null>(null);

  useEffect(() => {
    getAllCampaigns(suiClient).then(res => setAllCampaigns(res));
  }, [suiClient]);

  const userCampaigns = useMemo(() => {
    if (!allCampaigns || !currentAccount?.address) {
      return [];
    }

    return allCampaigns.filter(
      campaign => campaign.creator.toLowerCase() === currentAccount.address.toLowerCase()
    );
  }, [allCampaigns, currentAccount?.address]);

  const handleCampaignCreated = () => {
    // Refetch campaigns after creating a new one
    getAllCampaigns(suiClient).then(res => setAllCampaigns(res));
    setIsModalOpen(false);
  };

  if (!currentAccount) {
    return (
      <div className="flex items-center flex-col justify-center min-h-screen pb-[72px] overflow-hidden fixed inset-0">
        <p className="mb-8 text-subtitle">
          connect a wallet to create a campaign
        </p>
        <ConnectButton className="btn btn-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header
        title="your campaigns"
        subtitle="manage and create new campaigns"
      />

      {/* Campaign Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {allCampaigns === null ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            // Always show the grid with at least the create card
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Create New Campaign Card */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group bg-surface rounded-xl overflow-hidden border-2 border-dashed border-border transition-all hover:border-accent hover:shadow-lg cursor-pointer min-h-[400px] flex flex-col items-center justify-center gap-4 p-6"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Plus className="w-8 h-8 text-accent" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    create new campaign
                  </h3>
                  <p className="text-body text-sm">
                    launch your project and start raising funds
                  </p>
                </div>
              </button>

              {/* User's Campaigns */}
              {userCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCampaignCreated={handleCampaignCreated}
        creatorAddress={currentAccount.address}
      />
    </div>
  );
}