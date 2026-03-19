import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import type { Task } from '@/lib/types';
import {
  initRabbitState,
  addRabbitXP,
  setRabbitOutfit,
  getUnlockedOutfits,
  unlockOutfit,
  getRabbitMemories,
  upsertRabbitMemory,
  initDatabase,
  getTasks,
  getMoods,
} from '@/lib/db';
import type { RabbitMemoryType } from '@/lib/types';

const RABBIT_STATE_KEY = ['rabbit', 'state'];
const RABBIT_OUTFITS_KEY = ['rabbit', 'outfits'];
const RABBIT_MEMORIES_KEY = ['rabbit', 'memories'];

let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export function useRabbitState() {
  return useQuery({
    queryKey: RABBIT_STATE_KEY,
    queryFn: async () => {
      await ensureDbInitialized();
      const state = await initRabbitState();
      return state;
    },
  });
}

export function useAddRabbitXP() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      await ensureDbInitialized();
      return addRabbitXP(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RABBIT_STATE_KEY });
    },
  });
}

export function useSetRabbitOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (outfitId: string) => {
      await ensureDbInitialized();
      return setRabbitOutfit(outfitId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RABBIT_STATE_KEY });
    },
  });
}

export function useUnlockedOutfits() {
  return useQuery({
    queryKey: RABBIT_OUTFITS_KEY,
    queryFn: async () => {
      await ensureDbInitialized();
      return getUnlockedOutfits();
    },
  });
}

export function useUnlockOutfit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      await ensureDbInitialized();
      return unlockOutfit(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RABBIT_OUTFITS_KEY });
    },
  });
}

export function useRabbitMemories() {
  return useQuery({
    queryKey: RABBIT_MEMORIES_KEY,
    queryFn: async () => {
      await ensureDbInitialized();
      return getRabbitMemories();
    },
  });
}

export function useUpdateRabbitMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memoryType, memoryKey, memoryValue }: {
      memoryType: RabbitMemoryType;
      memoryKey: string;
      memoryValue: string;
    }) => {
      await ensureDbInitialized();
      return upsertRabbitMemory(memoryType, memoryKey, memoryValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RABBIT_MEMORIES_KEY });
    },
  });
}

// --- Auto-unlock outfits based on progress ---
export function useOutfitUnlockChecker() {
  const { data: rabbitState } = useRabbitState();
  const { data: unlockedOutfits } = useUnlockedOutfits();
  const queryClient = useQueryClient();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!rabbitState || !unlockedOutfits || checkedRef.current) return;
    checkedRef.current = true;

    const unlockedIds = new Set(unlockedOutfits.map((o) => o.id));

    async function checkUnlocks() {
      await ensureDbInitialized();

      // Get task and mood counts for unlock conditions
      const tasks = await getTasks();
      const moods = await getMoods();
      const completedTasks = tasks.filter((t: Task) => t.completedAt).length;
      const totalMoods = moods.length;

      const unlocks: { id: string; reason: string }[] = [];

      // scarf_cozy: Complete your first task
      if (!unlockedIds.has('scarf_cozy') && completedTasks >= 1) {
        unlocks.push({ id: 'scarf_cozy', reason: 'Completed your first task!' });
      }

      // glasses_smart: Log 10 moods
      if (!unlockedIds.has('glasses_smart') && totalMoods >= 10) {
        unlocks.push({ id: 'glasses_smart', reason: 'Logged 10 moods!' });
      }

      // badge_star: Complete 25 tasks
      if (!unlockedIds.has('badge_star') && completedTasks >= 25) {
        unlocks.push({ id: 'badge_star', reason: 'Completed 25 tasks!' });
      }

      // glasses_heart: Log 50 moods
      if (!unlockedIds.has('glasses_heart') && totalMoods >= 50) {
        unlocks.push({ id: 'glasses_heart', reason: 'Logged 50 moods!' });
      }

      // hat_wizard: Reach level 5
      if (!unlockedIds.has('hat_wizard') && rabbitState!.level >= 5) {
        unlocks.push({ id: 'hat_wizard', reason: 'Reached level 5!' });
      }

      // Streak-based unlocks are harder to check here without habit data,
      // but we can check them on the habit completion side in the future.
      // For now, hat_party (3-day), bow_peach (5 habits), cape_hero (7-day),
      // hat_crown (14-day), cape_magic (30-day) are checked elsewhere or
      // can be checked when habit entries load.

      for (const u of unlocks) {
        await unlockOutfit(u.id, u.reason);
      }

      if (unlocks.length > 0) {
        queryClient.invalidateQueries({ queryKey: RABBIT_OUTFITS_KEY });
      }
    }

    checkUnlocks();
  }, [rabbitState, unlockedOutfits, queryClient]);
}
