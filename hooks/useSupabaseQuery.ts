import { useEffect, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useSupabaseQuery<T>(
  query: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data, error } = await query();
        if (error) throw error;
        setData(data);
        setError(null);
      } catch (error) {
        setError(error as PostgrestError);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, deps);

  return { data, error, loading };
}