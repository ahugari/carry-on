import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Package, Scale } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Item = Database['public']['Tables']['items']['Row'] & {
  renter: Database['public']['Tables']['profiles']['Row'];
};

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const { data: item, loading, error } = useSupabaseQuery<Item>(
    () => supabase
      .from('items')
      .select(`
        *,
        renter:profiles!items_renter_id_fkey(*)
      `)
      .eq('id', id)
      .single(),
    [id]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load item details</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = user?.id === item.renter_id;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Item Details</Text>
        {isOwner && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push(`/item/edit/${item.id}`)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <ScrollView 
          horizontal 
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageGallery}
        >
          {item.photos.map((photo, index) => (
            <Image 
              key={index}
              source={{ uri: photo }}
              style={styles.itemImage}
            />
          ))}
        </ScrollView>

        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>

          <View style={styles.routeContainer}>
            <MapPin size={20} color="#3B82F6" />
            <Text style={styles.routeText}>
              {item.pickup_city} → {item.delivery_city}
            </Text>
          </View>

          {item.desired_date && (
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#64748B" />
              <Text style={styles.dateText}>
                Desired delivery by {new Date(item.desired_date).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Specifications</Text>
          <View style={styles.specDetails}>
            <Text style={styles.specText}>
              Dimensions: {item.length}x{item.width}x{item.height} {item.unit}
            </Text>
            <Text style={styles.specText}>
              Weight: {item.weight} {item.weight_unit}
            </Text>
            <Text style={styles.specText}>
              Category: {item.category}
            </Text>
            <Text style={styles.specText}>
              Declared Value: {item.currency} {item.value}
            </Text>
          </View>
        </View>

        {item.special_instructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.instructionsText}>
              {item.special_instructions}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner</Text>
          <View style={styles.ownerContainer}>
            <Image 
              source={{ 
                uri: item.renter.avatar_url || 
                    'https://images.pexels.com/photos/7473087/pexels-photo-7473087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
              }}
              style={styles.ownerImage}
            />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{item.renter.full_name}</Text>
              <Text style={styles.ownerRating}>★ {item.renter.rating.toFixed(1)} ({item.renter.total_reviews} reviews)</Text>
            </View>
            {!isOwner && (
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => router.push(`/messages/${item.renter_id}`)}
              >
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {!isOwner && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.offerButton}
            onPress={() => router.push(`/trip/new/step-1?itemId=${item.id}`)}
          >
            <Package size={20} color="#FFFFFF" />
            <Text style={styles.offerButtonText}>Offer to Transport</Text>
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
  imageGallery: {
    height: 240,
  },
  itemImage: {
    width: 360,
    height: 240,
  },
  itemDetails: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  itemName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  itemDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 24,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
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
  section: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  specDetails: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
  },
  specText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  ownerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ownerName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  ownerRating: {
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
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
  },
  offerButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});