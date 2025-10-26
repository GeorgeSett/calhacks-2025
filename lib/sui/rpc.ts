import { PACKAGE_ID, RPC_URL } from "@/lib/sui/constants";
import { Campaign } from "@/types/campaign";
import { SuiClient } from "@mysten/sui/client";

type RpcResponse<T> = {
  jsonrpc: string;
  id: number;
  result: {
    data: T;
    nextCursor: {
      txDigest: string;
      eventSeq: string;
    };
    hasNextPage: boolean;
  }
};

type RawCampaignDonation = {
  donator: string;
  amount: string;
  timestamp: string;
};

export type CampaignDonation = {
  donator: string;
  amount: number;
  timestamp: Date;
};

type RawCampaignList = {
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
    raised: string;
    goal: string;
    tag: string;
    title: string;
    image_url: string;
    backers: RawCampaignDonation[];
  };
  bcsEncoding: string;
  bcs: string;
  timestampMs: string;
}[];

type RawCampaignData = {
  "objectId": string;
  "version": string;
  "digest": string;
  "owner": {
    "Shared": {
      "initial_shared_version": number;
    }
  };
  "content": {
    "dataType": string;
    "type": string;
    "hasPublicTransfer": boolean;
    "fields": {
      backers: { fields: RawCampaignDonation }[];
      "creator": string;
      "deadline": string;
      "description": string;
      "goal": string;
      "id": {
        "id": string;
      };
      "image_url": string;
      "proof": string;
      "raised": string;
      "tag": string;
      "title": string;
      "vote_amount": string;
      "withdrawn_amount": string;
      "refunded_amount": string;
    }
  }
};

export type CampaignDetails = Campaign & { backerData: CampaignDonation[] }

export async function getAllCampaigns(client: SuiClient): Promise<Campaign[] | null> {
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
        400,
        false
      ]
    })
  });

  if (!res.ok) {
    return null;
  }

  const json: RpcResponse<RawCampaignList> = await res.json();
  const rawCampaignData = json.result.data;

  const campaignEvents = rawCampaignData
    .map(event => event.parsedJson)
    .filter(e => e.title !== undefined);
    // Don't filter by deadline - we need campaigns in all states (including VOTING which is past deadline)

  const campaignIds = campaignEvents.map(event => event.campaign_id)

  if (campaignIds.length === 0) {
    return [];
  }

  const campaignObjects = await client.multiGetObjects({
    ids: campaignIds,
    options: { showContent: true }, // This is crucial to get the `fields`
  });

  const activeCampaigns = campaignObjects
    .filter(obj => obj.data) // Filter out any objects that might have been deleted
    .map(obj => {
      const fields = (obj.data?.content as any)?.fields;
      // Ensure the deadline is in the correct format (number)
      const deadline = Number(fields.deadline);
      return { ...fields, deadline };
    }).map(raw => ({
      id: raw.id.id,
      title: raw.title,
      description: raw.description,
      creator: raw.creator,
      raised: parseInt(raw.raised) / 1000000000,
      goal: parseInt(raw.goal) / 1000000000,
      backers: raw.backers.reduce((acc: Set<string>, cur: any) => acc.add(cur.fields.donator), new Set<string>()).size,
      daysLeft: Math.floor((parseInt(raw.deadline) - Date.now()) / (24 * 60 * 60 * 1000)),
      category: raw.tag,
      image: raw.image_url,
      deadline: parseInt(raw.deadline),
      proof: raw.proof || "",
      vote_amount: parseInt(raw.vote_amount || "0") / 1000000000,
      withdrawn_amount: parseInt(raw.withdrawn_amount || "0") / 1000000000,
      refunded_amount: parseInt(raw.refunded_amount || "0") / 1000000000,
      is_ended: parseInt(raw.deadline) <= Date.now()
    }));

  const result = [];
  const seen = new Set<string>();

  for (const campaign of activeCampaigns) {
    if (seen.has(campaign.id)) {
      continue;
    }
    seen.add(campaign.id);
    result.push(campaign);
  }

  return result;
}

export async function getCampaign(campaignId: string): Promise<CampaignDetails | null> {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "id": 1,
      "method": "sui_getObject",
      "params": [
        campaignId,
        {
          "showType": false,
          "showOwner": true,
          "showPreviousTransaction": false,
          "showDisplay": false,
          "showContent": true,
          "showBcs": false,
          "showStorageRebate": false
        }
      ]
    })
  });

  if (!res.ok) {
    return null;
  }

  const json: RpcResponse<RawCampaignData> = await res.json();
  const data = json.result.data;

  return {
    id: campaignId,
    title: data.content.fields.title,
    description: data.content.fields.description,
    creator: data.content.fields.creator,
    raised: parseInt(data.content.fields.raised) / 1000000000,
    goal: parseInt(data.content.fields.goal) / 1000000000,
    backers: data.content.fields.backers.reduce((acc: Set<string>, cur: any) => acc.add(cur.fields.donator), new Set<string>()).size,
    backerData: data.content.fields.backers.map(b => ({ donator: b.fields.donator, amount: parseInt(b.fields.amount) / 1000000000, timestamp: new Date(parseInt(b.fields.timestamp)) })),
    daysLeft: Math.floor((parseInt(data.content.fields.deadline) - Date.now()) / (24 * 60 * 60 * 1000)),
    category: data.content.fields.tag,
    image: data.content.fields.image_url,
    deadline: parseInt(data.content.fields.deadline),
    proof: data.content.fields.proof || "",
    vote_amount: parseInt(data.content.fields.vote_amount || "0") / 1000000000,
    withdrawn_amount: parseInt(data.content.fields.withdrawn_amount || "0") / 1000000000,
    refunded_amount: parseInt(data.content.fields.refunded_amount || "0") / 1000000000,
    is_ended: parseInt(data.content.fields.deadline) <= Date.now()
  };
}

export interface DonationReceipt {
  id: string;
  campaign_id: string;
  amount: number;
  voted: boolean;
}

export async function getUserDonationReceipts(
  client: SuiClient,
  userAddress: string,
  campaignId?: string
): Promise<DonationReceipt[]> {
  try {
    const objects = await client.getOwnedObjects({
      owner: userAddress,
      filter: {
        StructType: `${PACKAGE_ID}::crowdfund::DonationReceipt`
      },
      options: {
        showContent: true
      }
    });

    const receipts = objects.data
      .filter(obj => obj.data?.content)
      .map(obj => {
        const fields = (obj.data?.content as any)?.fields;
        return {
          id: fields.id.id,
          campaign_id: fields.campaign_id,
          amount: parseInt(fields.amount) / 1000000000,
          voted: fields.voted
        };
      });

    // Filter by campaign ID if provided
    if (campaignId) {
      return receipts.filter(receipt => receipt.campaign_id === campaignId);
    }

    return receipts;
  } catch (error) {
    console.error("Error fetching donation receipts:", error);
    return [];
  }
}

/*
export async function getCampaignBackers(campaignId: string): Promise<CampaignBacker[] | null> {

}*/
