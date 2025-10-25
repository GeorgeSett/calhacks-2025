"use client";
import { useState, useMemo, useEffect } from "react";
import { CampaignCard } from "@/components/ExplorePage/CampaignCard";
import { CampaignCardSkeleton } from "@/components/ExplorePage/CampaignCardSkeleton";
import { CategoryFilter } from "@/components/ExplorePage/CategoryFilter";
import { Input } from "@/components/ui/Input";
import Header from "@/components/layout/Header";
import { Campaign } from "@/types/campaign";
import { getAllCampaigns } from "@/lib/sui/rpc";

export default function ExplorePage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCampaigns, setAllCampaigns] = useState<Campaign[] | null>(null);

  useEffect(() => {
    getAllCampaigns().then((res) => setAllCampaigns(res));
  }, []);

  const filteredCampaigns = useMemo(() => {
    if (allCampaigns === null) {
      return [];
    }
    return allCampaigns.filter((campaign) => {
      const matchesFilter = filter === "all" || campaign.category === filter;
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allCampaigns, filter, searchQuery]);

  return (
    <div className="min-h-screen pb-24">
      <Header
        title="explore campaigns"
        subtitle="discover projects building the future on sui"
      />

      {/* Filters & Search */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <CategoryFilter
              selectedCategory={filter}
              onSelectCategory={setFilter}
            />
            <Input
              value={searchQuery}
              onChange={setSearchQuery}
              type="text"
              placeholder="search for a campaign..."
            />
          </div>
        </div>
      </section>

      {/* Campaign Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {allCampaigns === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <CampaignCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-dim text-lg">no campaigns found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
