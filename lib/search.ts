import { supabase } from '@/lib/supabase';

export interface SearchFilters {
  departure?: string;
  arrival?: string;
  date?: string;
  category?: string;
  minRating?: number;
  verificationLevel?: 'basic' | 'verified' | 'premium';
  maxPrice?: number;
  itemSize?: 'small' | 'medium' | 'large';
  itemWeight?: number;
}

interface WeightedResult {
  id: string;
  score: number;
  rating: number;
  verificationLevel: string;
  tripCount: number;
  responseRate: number;
  price: number;
}

// Scoring weights for different factors
const WEIGHTS = {
  rating: 0.3,
  verificationLevel: 0.2,
  tripCount: 0.15,
  responseRate: 0.15,
  price: 0.2,
};

// Verification level scores
const VERIFICATION_SCORES = {
  basic: 0.3,
  verified: 0.6,
  premium: 1.0,
};

export async function searchSharers(filters: SearchFilters) {
  try {
    // Base query
    let query = supabase
      .from('trips')
      .select(`
        id,
        departure,
        arrival,
        date,
        price,
        space_available,
        item_categories,
        sharer:profiles!sharer_id (
          id,
          name,
          avatar_url,
          verification_level,
          rating,
          trip_count,
          response_rate
        )
      `);

    // Apply filters
    if (filters.departure) {
      query = query.ilike('departure', `%${filters.departure}%`);
    }
    if (filters.arrival) {
      query = query.ilike('arrival', `%${filters.arrival}%`);
    }
    if (filters.date) {
      query = query.gte('date', filters.date);
    }
    if (filters.category) {
      query = query.contains('item_categories', [filters.category]);
    }
    if (filters.minRating) {
      query = query.gte('profiles.rating', filters.minRating);
    }
    if (filters.verificationLevel) {
      query = query.eq('profiles.verification_level', filters.verificationLevel);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    const { data: results, error } = await query;

    if (error) throw error;

    // Calculate scores and sort results
    const scoredResults = results.map((result: any) => {
      const verificationScore = VERIFICATION_SCORES[result.sharer.verification_level as keyof typeof VERIFICATION_SCORES];
      const normalizedRating = result.sharer.rating / 5;
      const normalizedTripCount = Math.min(result.sharer.trip_count / 100, 1);
      const normalizedResponseRate = result.sharer.response_rate / 100;
      const normalizedPrice = 1 - (result.price / (filters.maxPrice || result.price));

      const score =
        WEIGHTS.rating * normalizedRating +
        WEIGHTS.verificationLevel * verificationScore +
        WEIGHTS.tripCount * normalizedTripCount +
        WEIGHTS.responseRate * normalizedResponseRate +
        WEIGHTS.price * normalizedPrice;

      return {
        ...result,
        score,
      };
    });

    // Sort by score descending
    return scoredResults.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export function calculateCompatibility(
  sharerCategories: string[],
  itemCategory: string,
  sharerSpaceAvailable: string,
  itemSize: string
): number {
  let score = 0;

  // Category match
  if (sharerCategories.includes(itemCategory)) {
    score += 0.6;
  }

  // Size compatibility
  const sizeMap = { small: 1, medium: 2, large: 3 };
  const sharerSize = sizeMap[sharerSpaceAvailable.toLowerCase() as keyof typeof sizeMap];
  const requestedSize = sizeMap[itemSize.toLowerCase() as keyof typeof sizeMap];

  if (sharerSize >= requestedSize) {
    score += 0.4;
  }

  return score;
} 