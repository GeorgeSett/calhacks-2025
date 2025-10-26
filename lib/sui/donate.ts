import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "@/lib/sui/constants";
import toast from "react-hot-toast";

export function donateToCampaign({
  campaignId,
  suiAmount,
  suiClient,
  signAndExecute
}: {
  campaignId: string;
  suiAmount: number;
  suiClient: SuiClient;
  signAndExecute: any;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = new Transaction();

    const mistAmount = 1000000000 * suiAmount;

    const [donationCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(mistAmount)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::crowdfund::donate`,
      arguments: [tx.object(campaignId), donationCoin, tx.object("0x6")]
    });

    tx.setGasBudget(20_000_000);
    toast("Submitting transaction...");

    signAndExecute(
      {
        transaction: tx
      },
      {
        onSuccess: (result: { digest: string }) => {
          console.log(result);

          suiClient
            .waitForTransaction({
              digest: result.digest,
              options: {
                showEffects: true
              }
            })
            .then((txResponse) => {
              if (txResponse.effects?.status?.status === "success") {
                toast.success(`Successfully donated ${suiAmount} SUI!`);
                resolve();
              } else {
                const error =
                  txResponse.effects?.status?.error ||
                  "Transaction execution failed";
                toast.error(`Donation failed: ${error}`);
                reject(new Error(error));
              }
            })
            .catch((err) => {
              toast.error("Failed to confirm transaction.");
              reject(err);
            });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Donation failed. Please try again.");
          reject(error);
        }
      }
    );
  });
}
