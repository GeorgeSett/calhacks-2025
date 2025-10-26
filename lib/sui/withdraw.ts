import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "@/lib/sui/constants";
import toast from "react-hot-toast";

export function withdrawFunds({
  campaignId,
  suiClient,
  signAndExecute,
}: {
  campaignId: string;
  suiClient: SuiClient;
  signAndExecute: any;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::crowdfund::withdraw`,
      arguments: [
        tx.object(campaignId),
        tx.object('0x6'), // Clock object
      ],
    });

    tx.setGasBudget(20_000_000);

    toast('Withdrawing funds...');

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
              toast.success('Funds withdrawn successfully!');
              resolve();
            })
            .catch((err) => {
              toast.error("Failed to confirm transaction.");
              reject(err);
            });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Withdrawal failed. Please try again.");
          reject(error);
        },
      }
    );
  });
}