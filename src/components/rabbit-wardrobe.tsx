import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RabbitMascot, RabbitXPBar } from "@/components/rabbit-mascot";
import {
  useRabbitState,
  useSetRabbitOutfit,
  useUnlockedOutfits,
} from "@/hooks/use-rabbit";
import {
  AVAILABLE_OUTFITS,
  RABBIT_LEVEL_NAMES,
} from "@/lib/types";
import type { RabbitLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RabbitWardrobeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RabbitWardrobe({ open, onOpenChange }: RabbitWardrobeProps) {
  const { data: rabbitState } = useRabbitState();
  const { data: unlockedOutfits } = useUnlockedOutfits();
  const setOutfit = useSetRabbitOutfit();
  const [previewOutfit, setPreviewOutfit] = useState<string | null>(null);

  const level = (rabbitState?.level ?? 1) as RabbitLevel;
  const xp = rabbitState?.xp ?? 0;
  const currentOutfit = rabbitState?.currentOutfit ?? "none";
  const displayOutfit = previewOutfit ?? currentOutfit;

  const unlockedIds = new Set(unlockedOutfits?.map((o) => o.id) ?? []);

  const handleEquip = (outfitId: string) => {
    const newOutfit = outfitId === currentOutfit ? "none" : outfitId;
    setOutfit.mutate(newOutfit);
    setPreviewOutfit(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Your Rabbit</DialogTitle>
        </DialogHeader>

        {/* Rabbit Preview */}
        <div className="flex flex-col items-center gap-3 py-4">
          <RabbitMascot
            mood="happy"
            size="lg"
            showBubble={false}
            level={level}
            outfit={displayOutfit}
          />
          <div className="text-center">
            <p className="font-semibold">{RABBIT_LEVEL_NAMES[level]}</p>
            <p className="text-xs opacity-60">Level {level}</p>
          </div>
          <RabbitXPBar level={level} xp={xp} className="w-full" />
        </div>

        {/* Outfit Grid */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Wardrobe</h4>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_OUTFITS.map((outfit) => {
              const isUnlocked = unlockedIds.has(outfit.id);
              const isEquipped = currentOutfit === outfit.id;
              const isPreviewing = previewOutfit === outfit.id;

              return (
                <div
                  key={outfit.id}
                  className={cn(
                    "p-3 rounded-2xl border-2 transition-all cursor-pointer",
                    isEquipped
                      ? "border-success bg-success/10"
                      : isPreviewing
                        ? "border-primary bg-primary/5"
                        : isUnlocked
                          ? "border-transparent bg-primary/5 hover:bg-primary/10"
                          : "border-transparent bg-primary/5 opacity-40 cursor-not-allowed"
                  )}
                  onMouseEnter={() => isUnlocked && setPreviewOutfit(outfit.id)}
                  onMouseLeave={() => setPreviewOutfit(null)}
                  onClick={() => isUnlocked && handleEquip(outfit.id)}
                >
                  <p className="text-sm font-medium">
                    {isUnlocked ? outfit.name : "???"}
                  </p>
                  <p className="text-xs opacity-60">
                    {isUnlocked ? outfit.description : outfit.unlockCondition}
                  </p>
                  {isEquipped && (
                    <span className="text-xs text-success font-medium">Equipped</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Unequip button */}
        {currentOutfit !== "none" && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setOutfit.mutate("none");
              setPreviewOutfit(null);
            }}
          >
            Remove Outfit
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
