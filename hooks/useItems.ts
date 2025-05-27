import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useSupabaseQuery } from './useSupabaseQuery';

type Item = Database['public']['Tables']['items']['Row'];
type InsertItem = Database['public']['Tables']['items']['Insert'];
type UpdateItem = Database['public']['Tables']['items']['Update'];

export function useItems(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: items, loading: fetchLoading, error: fetchError } = useSupabaseQuery<Item[]>(
    () => supabase
      .from('items')
      .select('*')
      .eq('renter_id', userId)
      .order('created_at', { ascending: false }),
    [userId]
  );

  const createItem = async (item: Omit<InsertItem, 'renter_id'>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('items')
        .insert([{ ...item, renter_id: userId }]);

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, updates: UpdateItem) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .eq('renter_id', userId);

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id)
        .eq('renter_id', userId);

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading: loading || fetchLoading,
    error: error || fetchError?.message || null,
    createItem,
    updateItem,
    deleteItem,
  };
}