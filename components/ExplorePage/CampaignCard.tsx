import Link from "next/link";
import Image from "next/image";
import { Campaign, CampaignState } from "@/types/campaign";
import { truncateAddress } from "@/lib/utils";
import { getCampaignState } from "@/lib/sui/campaign-state";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const percentage = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const isEnded = campaign.is_ended;
  const campaignState = getCampaignState(campaign);
  
  const getStatusLabel = (state: CampaignState): string => {
    switch (state) {
      case CampaignState.FUNDING:
        return "Active";
      case CampaignState.PROOF_SUBMISSION:
        return "Awaiting Proof";
      case CampaignState.VOTING:
        return "Voting";
      case CampaignState.SUCCESSFUL:
        return "Successful";
      case CampaignState.FAILED:
        return "Failed";
      case CampaignState.REJECTED:
        return "Rejected";
      default:
        return "";
    }
  };
  
  const getStatusColor = (state: CampaignState): string => {
    switch (state) {
      case CampaignState.FUNDING:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case CampaignState.PROOF_SUBMISSION:
      case CampaignState.VOTING:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case CampaignState.SUCCESSFUL:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case CampaignState.FAILED:
      case CampaignState.REJECTED:
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Link href={`/campaign/${campaign.id}`}>
      <div
        className={`group bg-surface rounded-xl overflow-hidden border border-border transition-all hover:border-accent hover:shadow-lg cursor-pointer h-full flex flex-col ${isEnded ? "opacity-50" : ""}`}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-bg shrink-0">
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
        <div className="p-6 flex flex-col grow">
          <h3
            className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {campaign.title}
          </h3>
          <p
            className="text-body mb-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
              minHeight: "4.5rem"
            }}
          >
            {campaign.description}
          </p>

          {/* Progress bar */}
          <div className="mb-4 mt-auto">
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
                className={`h-full ${isEnded ? "bg-gray-500" : "gradient-blue"} transition-all`}
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
              {isEnded ? (
                <span className="text-red-500 font-semibold">
                  Campaign ended
                </span>
              ) : (
                <span className="text-text-dim">
                  {campaign.daysLeft} days left
                </span>
              )}
            </div>
          </div>

          {/* Creator */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full gradient-purple" />
              <span className="text-xs text-text-dim">
                {truncateAddress(campaign.creator)}
              </span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaignState)}`}>
              {getStatusLabel(campaignState)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
