"use client";

import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import toast from "react-hot-toast";
import { PACKAGE_ID } from "@/lib/sui/constants";
import { bcs } from "@mysten/sui/bcs";

export function createCampaign({
  title,
  description,
  category,
  imageUrl,
  goalSui,
  durationMs,
  suiClient,
  signAndExecute,
}: {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  goalSui: number;
  durationMs: number;
  suiClient: SuiClient;
  signAndExecute: any; // Type for the mutate function
}): Promise<void> {
  console.log([title, description, category, imageUrl, goalSui, durationMs]);

  return new Promise((resolve, reject) => {
    try {
      const tx = new Transaction();

      // convert goal from SUI to MIST
      const goalMist = BigInt(Math.floor(goalSui * 1000000000));
      console.log(goalMist, BigInt(durationMs));

      // Create the moveCall for the `create` function
      tx.moveCall({
        target: `${PACKAGE_ID}::crowdfund::create`,
        arguments: [
          tx.pure.string('t'),

          tx.pure.u64(0),
          tx.pure.u64(0),
          tx.object('0x6'),
        ],
      });

      console.log('jjj')

      tx.setGasBudget(20_000_000);

      toast('Creating campaign...');

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result: { digest: string }) => {
            suiClient.waitForTransaction({ digest: result.digest })
              .then(() => {
                toast.success("Campaign created successfully!");
                resolve();
              })
              .catch((err) => {
                toast.error("Failed to confirm transaction.");
                reject(err);
              });
          },
          onError: (error: Error) => {
            toast.error(error.message || "Campaign creation failed.");
            reject(error);
          },
        }
      );
    } catch (buildError) {
      console.error("Error building the create transaction:", buildError);
      toast.error("Could not prepare the transaction. Please check your inputs.");
      reject(buildError);
    }
  });
}
