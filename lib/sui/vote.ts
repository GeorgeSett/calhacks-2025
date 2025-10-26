import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "@/lib/sui/constants";
import toast from "react-hot-toast";

export function voteOnCampaign({
  campaignId,
  receiptId,
  vote,
  suiClient,
  signAndExecute,
}: {
  campaignId: string;
  receiptId: string;
  vote: boolean;
  suiClient: SuiClient;
  signAndExecute: any;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::crowdfund::vote`,
      arguments: [
        tx.object(campaignId),
        tx.object(receiptId),
        tx.pure.bool(vote),
        tx.object('0x6'), // Clock object
      ],
    });

    tx.setGasBudget(20_000_000);

    toast(`Submitting ${vote ? 'yes' : 'no'} vote...`);

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result: { digest: string }) => {
          console.log(result);
          suiClient
            .waitForTransaction({ digest: result.digest })
            .then(() => {
              toast.success(`Vote submitted successfully!`);
              resolve();
            })
            .catch((err) => {
              toast.error("Failed to confirm transaction.");
              reject(err);
            });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Vote failed. Please try again.");
          reject(error);
        },
      }
    );
  });
}