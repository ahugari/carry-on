import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { useSupabaseQuery } from './useSupabaseQuery';

type Trip = Database['public']['Tables']['trips']['Row'];
type InsertTrip = Database['public']['Tables']['trips']['Insert'];
type UpdateTrip = Database['public']['Tables']['trips']['Update'];

export function useTrips(userId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: trips, loading: fetchLoading, error: fetchError } = useSupabaseQuery<Trip[]>(
    () => supabase
      .from('trips')
      .select('*')
      .eq('sharer_id', userId)
      .order('created_at', { ascending: false }),
    [userId]
  );

  const createTrip = async (trip: Omit<InsertTrip, 'sharer_id'>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('trips')
        .insert([{ ...trip, sharer_id: userId }]);

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (id: string, updates: UpdateTrip) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .eq('sharer_id', userId);

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)
        .eq('sharer_id', userId);

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    loading: loading || fetchLoading,
    error: error || fetchError?.message || null,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}