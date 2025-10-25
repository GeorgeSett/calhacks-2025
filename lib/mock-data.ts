import { Campaign } from "@/types/campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    title: "decentralized social network",
    description: "building a censorship-resistant social platform on sui",
    creator: "0x1234...5678",
    raised: 45000,
    goal: 100000,
    backers: 234,
    daysLeft: 23,
    category: "tech",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80"
  },
  {
    id: 2,
    title: "nft art gallery in tokyo",
    description: "physical gallery showcasing digital art from web3 artists",
    creator: "0xabcd...efgh",
    raised: 28000,
    goal: 50000,
    backers: 89,
    daysLeft: 45,
    category: "art",
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80"
  },
  {
    id: 3,
    title: "climate data oracle",
    description: "real-time environmental data feed for smart contracts",
    creator: "0x9876...4321",
    raised: 67000,
    goal: 75000,
    backers: 156,
    daysLeft: 12,
    category: "tech",
    image:
      "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80"
  },
  {
    id: 4,
    title: "indie game: pixel warriors",
    description: "retro-style fighting game with nft character ownership",
    creator: "0xfedc...ba98",
    raised: 12000,
    goal: 80000,
    backers: 67,
    daysLeft: 38,
    category: "gaming",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"
  },
  {
    id: 5,
    title: "sustainable fashion collective",
    description: "ethical clothing brand powered by transparent supply chain",
    creator: "0x5555...6666",
    raised: 34000,
    goal: 60000,
    backers: 201,
    daysLeft: 29,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea8f9d05?w=800&q=80"
  },
  {
    id: 6,
    title: "defi education platform",
    description: "learn blockchain development with interactive tutorials",
    creator: "0x7777...8888",
    raised: 89000,
    goal: 100000,
    backers: 445,
    daysLeft: 8,
    category: "education",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80"
  }
];
