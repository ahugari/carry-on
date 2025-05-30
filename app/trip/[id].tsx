import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Calendar, Package, MessageSquare, User, Clock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
};

type TripStatus = 'pending' | 'active' | 'completed' | 'cancelled';

type Trip = {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  arrival_date: string;
  status: TripStatus;
  available_space: string;
  price_per_kg: number;
  carrier: Profile | null;
  sender: Profile | null;
  requests: {
    count: number;
  };
  description: string;
};

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { profile } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for testing UI
    const mockTrip: Trip = {
      id: '1',
      origin: 'Boston, MA',
      destination: 'New York City, NY',
      departure_date: '2024-04-15',
      arrival_date: '2024-04-15',
      status: 'active',
      available_space: '20kg',
      price_per_kg: 5,
      carrier: {
        id: '1',
        full_name: 'John Smith',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      sender: null,
      requests: {
        count: 3
      },
      description: 'I am traveling from Boston to New York City and have extra space in my luggage. Can carry up to 20kg of items.'
    };

    setTrip(mockTrip);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Text>Trip not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: TripStatus) => {
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
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
          <Text style={styles.statusText}>{trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</Text>
        </View>
      </View>

      {/* Route Information */}
      <View style={styles.section}>
        <View style={styles.routeInfo}>
          <View style={styles.locationContainer}>
            <MapPin size={20} color="#4B5563" />
            <Text style={styles.locationText}>{trip.origin}</Text>
          </View>
          <View style={styles.locationContainer}>
            <MapPin size={20} color="#4B5563" />
            <Text style={styles.locationText}>{trip.destination}</Text>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={20} color="#4B5563" />
          <Text style={styles.dateText}>
            {new Date(trip.departure_date).toLocaleDateString()} - {new Date(trip.arrival_date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Carrier Information */}
      {trip.carrier && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carrier</Text>
          <View style={styles.profileContainer}>
            <Image source={{ uri: trip.carrier.avatar_url }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{trip.carrier.full_name}</Text>
              <TouchableOpacity style={styles.messageButton}>
                <MessageSquare size={20} color="#FFFFFF" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Trip Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Package size={20} color="#4B5563" />
            <Text style={styles.detailLabel}>Space Available</Text>
            <Text style={styles.detailValue}>{trip.available_space}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={20} color="#4B5563" />
            <Text style={styles.detailLabel}>Price per kg</Text>
            <Text style={styles.detailValue}>${trip.price_per_kg}</Text>
          </View>
          <View style={styles.detailItem}>
            <User size={20} color="#4B5563" />
            <Text style={styles.detailLabel}>Requests</Text>
            <Text style={styles.detailValue}>{trip.requests.count}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{trip.description}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Request to Ship</Text>
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4B5563',
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