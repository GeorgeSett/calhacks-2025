import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "@/lib/sui/constants";
import toast from "react-hot-toast";

function ulebEncode(num: number | bigint): number[] {
  let bigNum = BigInt(num);
  const arr: number[] = [];

  if (bigNum === BigInt(0)) {
    return [0];
  }

  let i = 0;
  while (bigNum > BigInt(0)) {
    const chunk = bigNum % BigInt(128);
    bigNum = bigNum / BigInt(128);
    arr[i] = Number(chunk);

    if (bigNum > BigInt(0)) {
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

export function submitProof({
  campaignId,
  proofUrl,
  suiClient,
  signAndExecute,
}: {
  campaignId: string;
  proofUrl: string;
  suiClient: SuiClient;
  signAndExecute: any;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::crowdfund::submit_proof`,
      arguments: [
        tx.object(campaignId),
        tx.pure(serialize(proofUrl)),
        tx.object('0x6'), // Clock object
      ],
    });

    tx.setGasBudget(20_000_000);

    toast('Submitting proof...');

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
              toast.success('Proof submitted successfully!');
              resolve();
            })
            .catch((err) => {
              toast.error("Failed to confirm transaction.");
              reject(err);
            });
        },
        onError: (error: Error) => {
          toast.error(error.message || "Proof submission failed. Please try again.");
          reject(error);
        },
      }
    );
  });
}