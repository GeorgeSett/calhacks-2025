"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { TextArea } from "../ui/TextArea";
import { CampaignCategory, CAMPAIGN_CATEGORIES } from "@/types/campaign";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCampaignModal({
  isOpen,
  onClose
}: CreateCampaignModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "tech" as CampaignCategory,
    goal: "",
    duration: "",
    image: null as File | null
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add campaign creation logic here
    console.log("Campaign data:", formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-surface rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">create new campaign</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
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
              required
            />
          </div>

          {/* Description */}
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
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CAMPAIGN_CATEGORIES.filter((cat) => cat !== "all").map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        category: category as CampaignCategory
                      })
                    }
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

          {/* Funding Goal */}
          <div>
            <label className="block text-sm font-medium mb-2">
              funding goal (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                $
              </span>
              <Input
                type="number"
                value={formData.goal}
                onChange={(value) => setFormData({ ...formData, goal: value })}
                placeholder="0"
                min="1"
                className="w-full pl-8"
                required
              />
            </div>
          </div>

          {/* Campaign Duration */}
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

          {/* Image Upload */}
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
              upload an image that represents your campaign (JPG, PNG, GIF)
            </p>
          </div>

          {/* Info Box */}
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1"
            >
              cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              create campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
