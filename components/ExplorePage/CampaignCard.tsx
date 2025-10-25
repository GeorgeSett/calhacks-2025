import Link from "next/link";
import Image from "next/image";
import { Campaign } from "@/types/campaign";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const percentage = Math.min((campaign.raised / campaign.goal) * 100, 100);

  return (
    <Link href={`/campaign/${campaign.id}`}>
      <div className="group bg-surface rounded-xl overflow-hidden border border-border transition-all hover:border-accent hover:shadow-lg cursor-pointer">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-bg">
          <Image
            src={campaign.image}
            alt={campaign.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white">
            {campaign.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
            {campaign.title}
          </h3>
          <p className="text-body mb-4 line-clamp-2">{campaign.description}</p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold gradient-text-blue">
                {campaign.raised.toLocaleString()} SUI
              </span>
              <span className="text-text-dim">
                of {campaign.goal.toLocaleString()} SUI
              </span>
            </div>
            <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
              <div
                className="h-full gradient-blue transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-text-dim">{campaign.backers} backers</span>
            </div>
            <div>
              <span className="text-text-dim">
                {campaign.daysLeft} days left
              </span>
            </div>
          </div>

          {/* Creator */}
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-full gradient-purple" />
            <span className="text-xs text-text-dim">{campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
