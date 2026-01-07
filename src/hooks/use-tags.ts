import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import type { Tag } from '@/lib/types';
import {
  getTags,
  createTag as createTagDb,
  deleteTag as deleteTagDb,
  initDatabase,
} from '@/lib/db';

const TAGS_QUERY_KEY = ['tags'];

// Initialize database on first hook use
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export function useTags() {
  return useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: async () => {
      await ensureDbInitialized();
      return getTags();
    },
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      await ensureDbInitialized();
      const newTag: Tag = {
        id: uuidv4(),
        name,
        createdAt: new Date().toISOString(),
      };
      return createTagDb(newTag);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ensureDbInitialized();
      return deleteTagDb(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
      // Also invalidate tasks since tag deletion affects task-tag associations
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
