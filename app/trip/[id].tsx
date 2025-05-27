import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Package, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Trip = Database['public']['Tables']['trips']['Row'] & {
  sharer: Database['public']['Tables']['profiles']['Row'];
  items: Database['public']['Tables']['items']['Row'][];
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: trip, loading, error } = useSupabaseQuery<Trip>(
    () => supabase
      .from('trips')
      .select(`
        *,
        sharer:profiles!trips_sharer_id_fkey(*),
        items(*)
      `)
      .eq('id', id)
      .single(),
    [id]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading trip details...</Text>
      </View>
    );
  }

  if (error || !trip) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load trip details</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.id === trip.sharer_id;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Trip Details</Text>
        {isOwner && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/trip/edit/${trip.id}`)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <MapPin size={20} color="#3B82F6" />
            <Text style={styles.routeText}>
              {trip.departure_city} → {trip.arrival_city}
            </Text>
          </View>

          <View style={styles.dateContainer}>
            <Calendar size={16} color="#64748B" />
            <Text style={styles.dateText}>
              {new Date(trip.departure_date).toLocaleDateString()} - 
              {new Date(trip.arrival_date).toLocaleDateString()}
            </Text>
          </View>

          {trip.airline && (
            <Text style={styles.flightInfo}>
              {trip.airline} {trip.flight_number}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Space Details</Text>
          <View style={styles.spaceDetails}>
            <Text style={styles.detailText}>
              Dimensions: {trip.space_length}x{trip.space_width}x{trip.space_height} {trip.space_unit}
            </Text>
            <Text style={styles.detailText}>
              Weight Limit: {trip.weight_limit} {trip.weight_unit}
            </Text>
            <Text style={styles.detailText}>
              Items Accepted: {trip.item_count}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price</Text>
          <Text style={styles.price}>
            {trip.currency} {trip.price}
          </Text>
        </View>

        {trip.accepted_categories && trip.accepted_categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accepted Categories</Text>
            <View style={styles.categoriesContainer}>
              {trip.accepted_categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {trip.restrictions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restrictions</Text>
            <View style={styles.restrictionsContainer}>
              <AlertCircle size={16} color="#EF4444" />
              <Text style={styles.restrictionsText}>{trip.restrictions}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sharer</Text>
          <View style={styles.sharerContainer}>
            <Image 
              source={{ 
                uri: trip.sharer.avatar_url || 
                    'https://images.pexels.com/photos/7473087/pexels-photo-7473087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }}
              style={styles.sharerImage}
            />
            <View style={styles.sharerInfo}>
              <Text style={styles.sharerName}>{trip.sharer.full_name}</Text>
              <Text style={styles.sharerRating}>★ {trip.sharer.rating.toFixed(1)} ({trip.sharer.total_reviews} reviews)</Text>
            </View>
            {!isOwner && (
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => router.push(`/messages/${trip.sharer_id}`)}
              >
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {trip.items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items ({trip.items.length})</Text>
            {trip.items.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.itemCard}
                onPress={() => router.push(`/item/${item.id}`)}
              >
                <Image 
                  source={{ uri: item.photos[0] }}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSize}>
                    {item.length}x{item.width}x{item.height} {item.unit}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  {item.currency} {item.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {!isOwner && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.requestButton}
            onPress={() => router.push(`/item/new/step-1?tripId=${trip.id}`)}
          >
            <Package size={20} color="#FFFFFF" />
            <Text style={styles.requestButtonText}>Request Space</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
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
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  editButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  routeCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  flightInfo: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  spaceDetails: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#3B82F6',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#3B82F6',
  },
  restrictionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
  },
  restrictionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#EF4444',
    marginLeft: 8,
    flex: 1,
  },
  sharerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sharerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sharerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sharerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  sharerRating: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  contactButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  contactButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1F2937',
  },
  itemSize: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
  },
  requestButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});