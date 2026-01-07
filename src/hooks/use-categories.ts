import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import type { Category, CategoryInput } from '@/lib/types';
import {
  getCategories,
  createCategory as createCategoryDb,
  updateCategory as updateCategoryDb,
  deleteCategory as deleteCategoryDb,
  initDatabase,
} from '@/lib/db';

const CATEGORIES_QUERY_KEY = ['categories'];

// Initialize database on first hook use
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      await ensureDbInitialized();
      return getCategories();
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      await ensureDbInitialized();
      const newCategory: Category = {
        id: uuidv4(),
        ...input,
        createdAt: new Date().toISOString(),
      };
      return createCategoryDb(newCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Category> }) => {
      await ensureDbInitialized();
      return updateCategoryDb(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ensureDbInitialized();
      return deleteCategoryDb(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      // Also invalidate tasks since category deletion affects tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
