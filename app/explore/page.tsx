"use client";

import { useState, useMemo, useEffect } from "react";
import { CampaignCard } from "@/components/ExplorePage/CampaignCard";
import { CampaignCardSkeleton } from "@/components/ExplorePage/CampaignCardSkeleton";
import { CategoryFilter } from "@/components/ExplorePage/CategoryFilter";
import { Input } from "@/components/ui/Input";
import Header from "@/components/layout/Header";
import { Campaign } from "@/types/campaign";
import { getAllCampaigns } from "@/lib/sui/rpc";
import { useSuiClient } from "@mysten/dapp-kit";
import { ArrowUpDown, Filter } from "lucide-react";

type SortOption = "newest" | "most-funded" | "ending-soon";

export default function ExplorePage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [allCampaigns, setAllCampaigns] = useState<Campaign[] | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const client = useSuiClient();

  useEffect(() => {
    getAllCampaigns(client).then(res => setAllCampaigns(res));
  }, []);

  const filteredAndSortedCampaigns = useMemo(() => {
    if (allCampaigns === null) {
      return [];
    }

    // First filter
    let campaigns = allCampaigns.filter((campaign) => {
      const matchesFilter = filter === "all" || campaign.category === filter;
      const matchesSearch =
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    // Then sort
    switch (sortBy) {
      case "newest":
        return campaigns.sort((a, b) => b.id.localeCompare(a.id));

      case "most-funded":
        return campaigns.sort((a, b) => b.raised - a.raised);

      case "ending-soon":
        return campaigns.sort((a, b) => a.daysLeft - b.daysLeft);

      default:
        return campaigns;
    }
  }, [allCampaigns, filter, searchQuery, sortBy]);

  const sortOptions = [
    { value: "newest" as SortOption, label: "newest" },
    { value: "most-funded" as SortOption, label: "most funded" },
    { value: "ending-soon" as SortOption, label: "ending soon" },
  ];

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
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <Input
                value={searchQuery}
                onChange={setSearchQuery}
                type="text"
                placeholder="search for a campaign..."
              />

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-3! py-3! btn btn-primary"
                >
                  <Filter className="w-4 h-4 text-black" />
                </button>

                {isDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-20">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                            sortBy === option.value
                              ? "bg-accent/10 text-accent border-l-2 border-accent"
                              : "hover:bg-bg"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
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
          ) : filteredAndSortedCampaigns.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-dim text-lg">no campaigns found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}