import { PACKAGE_ID, RPC_URL } from "@/lib/sui/constants";
import { Campaign } from "@/types/campaign";

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
      "creator": string;
      "deadline": string;
      "description": string;
      "goal": string;
      "id": {
        "id": string;
      };
      "image_url": string;
      "raised": string;
      "tag": string;
      "title": string;
    }
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

  const json: RpcResponse<RawCampaignList> = await res.json();
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

export async function getCampaign(campaignId: string): Promise<Campaign | null> {
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
    raised: parseInt(data.content.fields.raised),
    goal: parseInt(data.content.fields.goal) / 1000000000,
    backers: 0, // TODO
    daysLeft: Math.floor((parseInt(data.content.fields.deadline) - Date.now()) / (24 * 60 * 60 * 1000)),
    category: data.content.fields.tag,
    image: data.content.fields.image_url
  };
}