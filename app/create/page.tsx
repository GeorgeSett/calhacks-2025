"use client";
import { CampaignCard } from "@/components/CampaignCard";
import { mockCampaigns } from "@/lib/mock-data";
import Header from "@/components/layout/Header";
import { Plus } from "lucide-react";

export default function CreatePage() {
  const userCampaigns = mockCampaigns.slice(0, 3);

  return (
    <div className="min-h-screen pb-24">
      <Header
        title="your campaigns"
        subtitle="manage and create new campaigns"
      />

      {/* Campaign Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create New Campaign Card */}
            <button
              onClick={() => {
                // TODO: Navigate to campaign creation form or open modal
                console.log("Create new campaign");
              }}
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
        </div>
      </section>
    </div>
  );
}
