import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, MapPin, Calendar, Package, Filter, Star } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type VerificationLevel = 'basic' | 'verified' | 'premium';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  rating: number;
  verificationLevel: VerificationLevel;
  reviews: number;
  itemCategories: string[];
  spaceAvailable: string;
  price: string;
}

// Mock data for demonstration
const MOCK_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'John Doe',
    subtitle: 'New York → London',
    description: 'Traveling on June 15, can carry items up to 5kg',
    image: 'https://picsum.photos/400/200',
    rating: 4.8,
    verificationLevel: 'premium',
    reviews: 124,
    itemCategories: ['Electronics', 'Documents'],
    spaceAvailable: 'Medium',
    price: '$30/kg',
  },
  {
    id: '2',
    title: 'Jane Smith',
    subtitle: 'Paris → Berlin',
    description: 'Regular traveler, specializes in document delivery',
    image: 'https://picsum.photos/400/201',
    rating: 4.5,
    verificationLevel: 'verified',
    reviews: 89,
    itemCategories: ['Documents', 'Small Packages'],
    spaceAvailable: 'Small',
    price: '$25/kg',
  },
  // Add more mock results...
];

type SearchParams = {
  departure: string;
  arrival: string;
  date: string;
  category: string;
  minRating?: number;
  verificationLevel?: VerificationLevel;
  maxPrice?: number;
};

export default function SearchScreen() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    departure: '',
    arrival: '',
    date: '',
    category: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    // Implement search logic
    console.log('Searching with params:', searchParams);
  };

  const handleSharerPress = (id: string) => {
    router.push(`/sharer/${id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} stickyHeaderIndices={[0]}>
        {/* Search Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.searchHeader}>
            <Text style={styles.title}>Find Sharers</Text>
            <Button
              variant="ghost"
              icon={<Filter size={20} color="#64748B" />}
              onPress={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </View>

          <Input
            placeholder="From"
            icon={<MapPin size={20} color="#64748B" />}
            value={searchParams.departure}
            onChangeText={(text) => setSearchParams({ ...searchParams, departure: text })}
          />

          <Input
            placeholder="To"
            icon={<MapPin size={20} color="#64748B" />}
            value={searchParams.arrival}
            onChangeText={(text) => setSearchParams({ ...searchParams, arrival: text })}
          />

          {showFilters && (
            <>
              <Input
                placeholder="Travel Date"
                icon={<Calendar size={20} color="#64748B" />}
                value={searchParams.date}
                onChangeText={(text) => setSearchParams({ ...searchParams, date: text })}
              />

              <Input
                placeholder="Item Category"
                icon={<Package size={20} color="#64748B" />}
                value={searchParams.category}
                onChangeText={(text) => setSearchParams({ ...searchParams, category: text })}
              />

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Minimum Rating</Text>
                <View style={styles.ratingButtons}>
                  {[4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={searchParams.minRating === rating ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setSearchParams({ ...searchParams, minRating: rating })}
                      icon={<Star size={16} color={searchParams.minRating === rating ? '#FFFFFF' : '#3B82F6'} />}
                    >
                      {rating}+
                    </Button>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Verification Level</Text>
                <View style={styles.verificationButtons}>
                  {(['basic', 'verified', 'premium'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={searchParams.verificationLevel === level ? 'primary' : 'outline'}
                      size="sm"
                      onPress={() => setSearchParams({ ...searchParams, verificationLevel: level })}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </View>
              </View>
            </>
          )}

          <Button
            onPress={handleSearch}
            icon={<SearchIcon size={20} color="#FFFFFF" />}
            fullWidth
          >
            Search
          </Button>
        </View>

        {/* Search Results */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Available Sharers</Text>
          {MOCK_RESULTS.map((result) => (
            <View key={result.id} style={styles.cardContainer}>
              <Card
                title={result.title}
                subtitle={result.subtitle}
                description={result.description}
                image={result.image}
                rating={result.rating}
                verificationLevel={result.verificationLevel}
                onPress={() => handleSharerPress(result.id)}
              >
                <View style={styles.cardFooter}>
                  <View style={styles.cardStats}>
                    <Text style={styles.reviewCount}>{result.reviews} reviews</Text>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.spaceAvailable}>{result.spaceAvailable}</Text>
                  </View>
                  <Text style={styles.price}>{result.price}</Text>
                </View>
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  filterSection: {
    marginTop: 16,
  },
  filterLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  verificationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  resultsContainer: {
    padding: 16,
  },
  resultsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  bulletPoint: {
    marginHorizontal: 8,
    color: '#94A3B8',
  },
  spaceAvailable: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
  },
});