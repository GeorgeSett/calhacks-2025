"use client";

import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import toast from "react-hot-toast";
import { PACKAGE_ID } from "@/lib/sui/constants";

function ulebEncode(num: number | bigint): number[] {
  let bigNum = BigInt(num);
  const arr: number[] = [];

  if (bigNum === 0n) {
    return [0];
  }

  let i = 0;
  while (bigNum > 0n) {
    const chunk = bigNum % 128n;

    bigNum = bigNum / 128n;

    arr[i] = Number(chunk);

    if (bigNum > 0n) {
      arr[i] |= 0x80;
    }

    i += 1;
  }

  return arr;
}

function serialize(value: string) {
  const bytes = new TextEncoder().encode(value);
  const size = ulebEncode(bytes.length);
  const result = new Uint8Array(size.length + bytes.length);
  result.set(size, 0);
  result.set(bytes, size.length);

  return result;
}

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

      // Create the moveCall for the `create` function
      tx.moveCall({
        target: `${PACKAGE_ID}::crowdfund::create`,
        arguments: [
          //tx.pure.string('t'),
          tx.pure(serialize(title)),
          tx.pure(serialize(description)),
          tx.pure(serialize(category)),
          tx.pure(serialize(imageUrl)),
          tx.pure.u64(goalMist),
          tx.pure.u64(BigInt(durationMs)),
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
