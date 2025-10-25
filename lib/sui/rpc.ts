import { PACKAGE_ID, RPC_URL } from "@/lib/sui/constants";
import { Campaign } from "@/types/campaign";

type RawCampaignData = {
  jsonrpc: string;
  id: number;
  result: {
    data: {
      id: {
        txDigest: string;
        eventSeq: string;
      };
      packageId: string;
      transactionModule: string;
      sender: string;
      type: string;
      parsedJson: {
        campaign_id: string;
        creator: string;
        deadline: string;
        description: string;
        goal: string;
        tag: string;
        title: string;
        image_url: string;
      };
      bcsEncoding: string;
      bcs: string;
      timestampMs: string;
    }[];
    nextCursor: {
      txDigest: string;
      eventSeq: string;
    };
    hasNextPage: boolean;
  }
};

export async function getAllCampaigns(): Promise<Campaign[] | null> {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "suix_queryEvents",
      "params": [
        {
          "MoveModule": {
            "package": PACKAGE_ID,
            "module": "crowdfund",
            "type": `${PACKAGE_ID}::crowdfund::CampaignCreated`
          }
        },
        null,
        3,
        false
      ]
    })
  });

  if (!res.ok) {
    return null;
  }

  const json: RawCampaignData = await res.json();
  const rawCampaignData = json.result.data;

  return rawCampaignData.map(raw => ({
    id: raw.parsedJson.campaign_id,
    title: raw.parsedJson.title,
    description: raw.parsedJson.description,
    creator: raw.parsedJson.creator,
    raised: 0, // TODO
    goal: parseInt(raw.parsedJson.goal) / 1000000000,
    backers: 0, // TODO
    daysLeft: Math.floor((parseInt(raw.parsedJson.deadline) - Date.now()) / (24 * 60 * 60 * 1000)),
    category: raw.parsedJson.tag,
    image: raw.parsedJson.image_url
  }));
}