"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockCampaigns } from "@/lib/mock-data";

export default function CampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const campaign = useMemo(() => {
    return mockCampaigns.find((c) => c.id === parseInt(campaignId));
  }, [campaignId]);

  // Generate stable random data for recent backers
  const recentBackers = useMemo(() => {
    // Generate random values outside of render
    const generateAddress = (seed: number) => {
      const hash1 = (seed * 9301 + 49297) % 233280;
      const hash2 = (seed * 1103 + 29473) % 233280;
      return `0x${hash1.toString(16).slice(0, 6)}...${hash2.toString(16).slice(0, 4)}`;
    };

    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      address: generateAddress(i),
      hoursAgo: (i * 5) % 24,
      amount: [10, 25, 50, 100][i % 4]
    }));
  }, []);

  if (!campaign) {
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

  const percentage = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const quickAmounts = [10, 25, 50, 100, 250];

  const handleBack = () => {
    const amount =
      selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
    if (amount > 0) {
      // donation logic
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
              <h1 className="text-title mb-4">{campaign.title}</h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full gradient-purple" />
                <div>
                  <p className="text-sm text-text-dim">Created by</p>
                  <p className="font-semibold">{campaign.creator}</p>
                </div>
              </div>
            </div>

            {/* Campaign stats - Mobile */}
            <div className="lg:hidden mb-8 p-6 bg-surface rounded-xl border border-border">
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-stat-md gradient-text-blue">
                    ${campaign.raised.toLocaleString()}
                  </span>
                  <span className="text-text-dim">
                    of ${campaign.goal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-bg rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full gradient-blue transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      {campaign.backers}
                    </div>
                    <div className="text-sm text-text-dim">backers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-1">
                      {campaign.daysLeft}
                    </div>
                    <div className="text-sm text-text-dim">days left</div>
                  </div>
                </div>
              </div>

              {/* Backing section for mobile */}
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
                      ${amount}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="mb-4">
                  <label className="block text-sm text-text-dim mb-2">
                    Or enter custom amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">
                      $
                    </span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleBack}
                  disabled={
                    !selectedAmount &&
                    (!customAmount || parseFloat(customAmount) <= 0)
                  }
                  className={`btn w-full ${
                    selectedAmount ||
                    (customAmount && parseFloat(customAmount) > 0)
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
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                About this project
              </h2>
              <p className="text-body leading-relaxed mb-4">
                {campaign.description}
              </p>
              <p className="text-body leading-relaxed mb-4">
                This is a revolutionary project building on the Sui blockchain.
                We are committed to transparency and will provide regular
                updates to all our backers. Every contribution helps us get
                closer to our goal.
              </p>
              <p className="text-body leading-relaxed">
                All funds are held in a smart contract and will only be released
                when we reach our funding goal. If we do not reach the goal, all
                backers will be automatically refunded.
              </p>
            </div>

            {/* Recent backers */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Recent backers</h2>
              <div className="space-y-3">
                {recentBackers.map((backer) => (
                  <div
                    key={backer.id}
                    className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-purple" />
                      <div>
                        <p className="font-semibold">{backer.address}</p>
                        <p className="text-sm text-text-dim">
                          {backer.hoursAgo} hours ago
                        </p>
                      </div>
                    </div>
                    <div className="font-semibold gradient-text-blue">
                      ${backer.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Funding stats - Desktop */}
              <div className="hidden lg:block p-6 bg-surface rounded-xl border border-border mb-6">
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-stat-md gradient-text-blue">
                      ${campaign.raised.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-text-dim mb-4">
                    of ${campaign.goal.toLocaleString()} goal
                  </p>
                  <div className="w-full h-3 bg-bg rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full gradient-blue transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {campaign.backers}
                      </div>
                      <div className="text-sm text-text-dim">backers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {campaign.daysLeft}
                      </div>
                      <div className="text-sm text-text-dim">days left</div>
                    </div>
                  </div>
                </div>

                {/* Backing section */}
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
                        ${amount}
                      </button>
                    ))}
                  </div>

                  {/* Custom amount */}
                  <div className="mb-4">
                    <label className="block text-sm text-text-dim mb-2">
                      Or enter custom amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">
                        $
                      </span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        placeholder="0.00"
                        className="w-full pl-7 pr-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBack}
                    disabled={
                      !selectedAmount &&
                      (!customAmount || parseFloat(customAmount) <= 0)
                    }
                    className={`btn w-full ${
                      selectedAmount ||
                      (customAmount && parseFloat(customAmount) > 0)
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
              </div>

              {/* Info box */}
              <div className="p-6 bg-surface rounded-xl border border-border">
                <h3 className="font-semibold mb-4">How it works</h3>
                <ul className="space-y-3 text-sm text-text-dim">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>All funds held in smart contract</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Creator receives funds only if goal is met</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Automatic refund if goal not reached</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>All transactions visible on blockchain</span>
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
