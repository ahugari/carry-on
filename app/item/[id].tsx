import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Package, MessageSquare, DollarSign, Scale, Box } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
};

type ItemStatus = 'pending' | 'active' | 'completed' | 'cancelled';

type Item = {
  id: string;
  name: string;
  description: string;
  origin: string;
  destination: string;
  status: ItemStatus;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  owner: Profile | null;
  carrier: Profile | null;
  offers: {
    count: number;
  };
  category: string;
};

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for testing UI
    const mockItem: Item = {
      id: '1',
      name: 'Gaming Laptop',
      description: 'Brand new gaming laptop that needs to be delivered. Handle with care. The package is well-padded and comes in its original box.',
      origin: 'Boston, MA',
      destination: 'New York City, NY',
      status: 'pending',
      weight: 2.5,
      dimensions: {
        length: 40,
        width: 30,
        height: 10
      },
      value: 1200,
      owner: {
        id: '1',
        full_name: 'Sarah Parker',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      carrier: null,
      offers: {
        count: 2
      },
      category: 'Electronics'
    };

    setItem(mockItem);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading item details...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text>Item not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case 'active':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'completed':
        return '#3B82F6';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
        </View>
      </View>

      {/* Item Information */}
      <View style={styles.section}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      {/* Route Information */}
      <View style={styles.section}>
        <View style={styles.routeInfo}>
          <View style={styles.locationContainer}>
            <MapPin size={20} color="#4B5563" />
            <Text style={styles.locationText}>{item.origin}</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={20} color="#4B5563" />
            <Text style={styles.locationText}>{item.destination}</Text>
          </View>
        </View>
      </View>

      {/* Owner Information */}
      {item.owner && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Owner</Text>
          <View style={styles.profileContainer}>
            <Image source={{ uri: item.owner.avatar_url }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{item.owner.full_name}</Text>
              <TouchableOpacity style={styles.messageButton}>
                <MessageSquare size={20} color="#FFFFFF" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Item Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Scale size={20} color="#4B5563" />
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{item.weight} kg</Text>
          </View>
          <View style={styles.detailItem}>
            <Box size={20} color="#4B5563" />
            <Text style={styles.detailLabel}>Dimensions</Text>
            <Text style={styles.detailValue}>{item.dimensions.length}x{item.dimensions.width}x{item.dimensions.height} cm</Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={20} color="#4B5563" />
            <Text style={styles.detailLabel}>Value</Text>
            <Text style={styles.detailValue}>${item.value}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Offer to Deliver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  routeInfo: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  messageButtonText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  actionButtons: {
    padding: 16,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});