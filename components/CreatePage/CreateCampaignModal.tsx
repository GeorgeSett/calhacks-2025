"use client";

import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "../ui/TextArea";
import { CAMPAIGN_CATEGORIES } from "@/types/campaign";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { createCampaign } from "@/lib/sui/create";
import toast from "react-hot-toast";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: () => void;
  creatorAddress: string;
}

export function CreateCampaignModal({
  isOpen,
  onClose,
  onCampaignCreated,
  creatorAddress
}: CreateCampaignModalProps) {
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tech",
    goal: "",
    duration: "",
    image: null as File | null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      setError("Please select a campaign image.");
      return;
    }

    const goalSui = parseFloat(formData.goal);
    const durationMs = parseInt(formData.duration) * 24 * 60 * 60 * 1000;

    if (isNaN(goalSui) || goalSui <= 0) {
      toast.error("Invalid funding goal. Must be a positive number.");
      return;
    }
    if (isNaN(durationMs) || durationMs <= 0) {
      toast.error("Invalid campaign duration. Must be a positive number.");
      return;
    }
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("No field can be left blank");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uploadUrl =
        "https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=10";
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "image/png"
        },
        body: formData.image
      });

      if (!uploadResponse.ok) {
        const resJson = await uploadResponse.json();
        toast.error(resJson.error || "Image upload failed. Please try again.");
        setIsLoading(false);
        return;
      }

      const resData: { newlyCreated: { blobObject: { id: string } } } =
        await uploadResponse.json();
      const objectId = resData?.newlyCreated?.blobObject?.id;
      if (typeof objectId !== "string") {
        toast.error("Invalid response from image uploader.");
        setIsLoading(false);
        return;
      }
      const imageUrl = `https://aggregator.walrus-testnet.walrus.space/v1/blobs/by-object-id/${objectId}`;

      // Call the on-chain function
      await createCampaign({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl,
        goalSui: goalSui,
        durationMs: durationMs,
        suiClient: suiClient,
        signAndExecute: signAndExecute
      });

      console.log("Campaign created successfully!");
      onClose();
      toast.success("Campaign created successfully!");

      setFormData({
        title: "",
        description: "",
        category: "tech",
        goal: "",
        duration: "",
        image: null
      });

      // Notify parent to refresh campaigns
      onCampaignCreated();
    } catch (err) {
      console.error("Failed to create campaign:", err);
      toast.error("Failed to create campaign. Please try again.");
      setError("An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setError("File is too large. Maximum size is 2MB.");
        setFormData({ ...formData, image: null });
        e.target.value = "";
        return;
      }

      setError(null);
      setFormData({ ...formData, image: file });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-surface rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">create new campaign</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campaign Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              campaign title
            </label>
            <Input
              value={formData.title}
              onChange={(value) => setFormData({ ...formData, title: value })}
              placeholder="enter a catchy title for your campaign"
              className="w-full"
              maxLength={100}
              required
            />
            <p className="text-xs text-text-dim mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              description
            </label>
            <TextArea
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              placeholder="describe your project and what you plan to build"
              rows={5}
              className="w-full"
              maxLength={1000}
              required
            />
            <p className="text-xs text-text-dim mt-1">
              {formData.description.length}/1000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CAMPAIGN_CATEGORIES.filter((cat) => cat !== "all").map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFormData({ ...formData, category })}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      formData.category === category
                        ? "bg-accent text-white"
                        : "bg-bg text-text-dim hover:text-text border border-border"
                    }`}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              funding goal (SUI)
            </label>
            <div className="relative">
              <Input
                type="number"
                value={formData.goal}
                onChange={(value) => setFormData({ ...formData, goal: value })}
                placeholder="0.00"
                className="w-full pr-12"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim">
                SUI
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              campaign duration (days)
            </label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(value) =>
                setFormData({ ...formData, duration: value })
              }
              placeholder="30"
              min="1"
              max="90"
              className="w-full"
              required
            />
            <p className="text-xs text-text-dim mt-2">
              campaigns can run for up to 90 days
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              campaign image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-text-dim
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-accent file:text-white
                  hover:file:bg-accent/90
                  file:cursor-pointer cursor-pointer
                  border border-border rounded-lg p-2
                  bg-bg focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
              {formData.image && (
                <p className="text-xs text-text-dim mt-2">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>
            <p className="text-xs text-text-dim mt-2">
              upload an image that represents your campaign (max 2MB)
            </p>
          </div>

          <div className="p-4 bg-bg rounded-lg border border-border">
            <h4 className="text-sm font-semibold mb-2">before you create</h4>
            <ul className="space-y-1 text-xs text-text-dim">
              <li className="flex gap-2">
                <span>•</span>
                <span>all funds are held in a smart contract</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>you receive funds only if the goal is met</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>
                  backers are automatically refunded if goal is not reached
                </span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>all transactions are visible on the blockchain</span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1"
              disabled={isLoading}
            >
              cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  creating...
                </span>
              ) : (
                "create campaign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
