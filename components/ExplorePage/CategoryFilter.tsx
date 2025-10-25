import { CAMPAIGN_CATEGORIES } from "@/types/campaign";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CAMPAIGN_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            selectedCategory === cat
              ? "bg-accent text-white"
              : "bg-surface text-text-dim hover:text-text border border-border"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
