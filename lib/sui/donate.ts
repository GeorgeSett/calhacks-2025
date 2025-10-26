import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "@/lib/sui/constants";
import toast from "react-hot-toast";

export function donateToCampaign(
  {
   campaignId,
   suiAmount,
   suiClient,
   signAndExecute,
  }: {
  campaignId: string;
  suiAmount: number;
  suiClient: SuiClient;
  signAndExecute: any; // Type for the mutate function
} ): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = new Transaction();

    // Convert donation amount from SUI to MIST
    const mistAmount = 1000000000 * suiAmount;

    // Create a new coin with the exact donation amount from the user's gas coin
    const [donationCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(mistAmount)]);

    // Create the moveCall transaction
    tx.moveCall({
      target: `${PACKAGE_ID}::crowdfund::donate`,
      arguments: [
        tx.object(campaignId),
        donationCoin,
        tx.object('0x6'),
      ],
    });

    tx.setGasBudget(20_000_000);

    toast('Submitting transaction...');

    console.log(donationCoin);
    console.log(tx);

    // Execute the transaction
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result: { digest: string }) => {
          console.log(result);
          // Wait for the transaction to be finalized on-chain
          suiClient
            .waitForTransaction({ digest: result.digest })
            .then(() => {
              toast.success(`Successfully donated ${suiAmount} SUI!`);
              resolve(); // Resolve the promise on success
            })
            .catch((err) => {
              toast.error("Failed to confirm transaction.");
              reject(err); // Reject if waiting fails
            });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Donation failed. Please try again.");
          reject(error); // Reject the promise on error
        },
      }
    );
  });
};