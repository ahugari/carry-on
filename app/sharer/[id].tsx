import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Star,
  MessageCircle,
  Shield,
  Package,
  MapPin,
  Calendar,
  ChevronRight,
} from 'lucide-react-native';
import { Button } from '../components/ui/Button';

type VerificationLevel = 'basic' | 'verified' | 'premium';

interface Trip {
  id: string;
  origin: string;
  destination: string;
  date: string;
  spaceAvailable: string;
  price: string;
  itemCategories: string[];
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  comment: string;
}

interface SharerProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  verificationLevel: VerificationLevel;
  memberSince: string;
  bio: string;
  upcomingTrips: Trip[];
  reviews: Review[];
}

const MOCK_SHARER: SharerProfile = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://picsum.photos/400/400',
  rating: 4.8,
  reviewCount: 124,
  verificationLevel: 'premium',
  memberSince: 'March 2023',
  bio: 'Frequent business traveler between New York and London. I specialize in secure document delivery and small electronics transport.',
  upcomingTrips: [
    {
      id: 't1',
      origin: 'New York',
      destination: 'London',
      date: 'June 15, 2024',
      spaceAvailable: 'Medium',
      price: '$30/kg',
      itemCategories: ['Electronics', 'Documents'],
    },
    {
      id: 't2',
      origin: 'London',
      destination: 'New York',
      date: 'June 30, 2024',
      spaceAvailable: 'Small',
      price: '$25/kg',
      itemCategories: ['Documents', 'Small Packages'],
    },
  ],
  reviews: [
    {
      id: 'r1',
      user: {
        name: 'Sarah M.',
        avatar: 'https://picsum.photos/401/401',
      },
      rating: 5,
      date: '2 weeks ago',
      comment: 'Very professional and reliable. Delivered my package on time and in perfect condition.',
    },
    {
      id: 'r2',
      user: {
        name: 'Michael K.',
        avatar: 'https://picsum.photos/402/402',
      },
      rating: 4,
      date: '1 month ago',
      comment: 'Good communication throughout the process. Would use again.',
    },
  ],
};

export default function SharerProfileScreen() {
  const { id } = useLocalSearchParams();
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const handleContact = () => {
    router.push({
      pathname: '/(chat)/[id]',
      params: { id },
    });
  };

  const handleBookTrip = (tripId: string) => {
    router.push({
      pathname: '/(trip)/book/[id]',
      params: { id: tripId },
    });
  };

  const renderVerificationBadge = () => {
    let color = '#64748B'; // basic
    if (MOCK_SHARER.verificationLevel === 'verified') color = '#3B82F6';
    if (MOCK_SHARER.verificationLevel === 'premium') color = '#8B5CF6';

    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Shield size={16} color="#FFFFFF" />
        <Text style={styles.badgeText}>
          {MOCK_SHARER.verificationLevel.charAt(0).toUpperCase() +
            MOCK_SHARER.verificationLevel.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image source={{ uri: MOCK_SHARER.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{MOCK_SHARER.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.rating}>{MOCK_SHARER.rating}</Text>
              <Text style={styles.reviews}>({MOCK_SHARER.reviewCount} reviews)</Text>
            </View>
            {renderVerificationBadge()}
            <Text style={styles.memberSince}>Member since {MOCK_SHARER.memberSince}</Text>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.bio}>{MOCK_SHARER.bio}</Text>
        </View>

        {/* Upcoming Trips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          {MOCK_SHARER.upcomingTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={[
                styles.tripCard,
                selectedTrip === trip.id && styles.selectedTripCard,
              ]}
              onPress={() => setSelectedTrip(trip.id)}
            >
              <View style={styles.tripInfo}>
                <View style={styles.tripRoute}>
                  <MapPin size={16} color="#64748B" />
                  <Text style={styles.tripText}>
                    {trip.origin} → {trip.destination}
                  </Text>
                </View>
                <View style={styles.tripDate}>
                  <Calendar size={16} color="#64748B" />
                  <Text style={styles.tripText}>{trip.date}</Text>
                </View>
                <View style={styles.tripCategories}>
                  <Package size={16} color="#64748B" />
                  <Text style={styles.tripText}>
                    {trip.itemCategories.join(', ')} • {trip.spaceAvailable}
                  </Text>
                </View>
              </View>
              <View style={styles.tripPrice}>
                <Text style={styles.priceText}>{trip.price}</Text>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={() => handleBookTrip(trip.id)}
                >
                  Book
                </Button>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {MOCK_SHARER.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewUser}>
                  <Image source={{ uri: review.user.avatar }} style={styles.reviewerAvatar} />
                  <View>
                    <Text style={styles.reviewerName}>{review.user.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.reviewRating}>
                  <Star size={16} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.reviewRatingText}>{review.rating}</Text>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.allReviewsButton}>
            <Text style={styles.allReviewsText}>See all reviews</Text>
            <ChevronRight size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Contact Button */}
      <View style={styles.contactButtonContainer}>
        <Button
          variant="primary"
          fullWidth
          icon={<MessageCircle size={20} color="#FFFFFF" />}
          onPress={handleContact}
        >
          Contact {MOCK_SHARER.name}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  memberSince: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  tripCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedTripCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripCategories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
  },
  tripPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
    marginBottom: 8,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  reviewDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 4,
  },
  reviewComment: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
  },
  allReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  allReviewsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
    marginRight: 4,
  },
  contactButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
}); 