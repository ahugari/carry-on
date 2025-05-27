import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTrips } from '@/hooks/useTrips';

export default function TripHistoryScreen() {
  const { user } = useAuth();
  const { trips, loading, error } = useTrips(user?.id);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Trip History</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading trips...</Text>
          </View>
        ) : trips?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/7473087/pexels-photo-7473087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptyText}>
              Your completed and upcoming trips will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.tripsList}>
            {trips?.map((trip) => (
              <TouchableOpacity 
                key={trip.id}
                style={styles.tripCard}
                onPress={() => router.push(`/trip/${trip.id}`)}
              >
                <View style={styles.tripHeader}>
                  <View style={styles.tripRoute}>
                    <MapPin size={16} color="#64748B" />
                    <Text style={styles.routeText}>
                      {trip.departure_city} → {trip.arrival_city}
                    </Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    trip.status === 'completed' ? styles.completedBadge :
                    trip.status === 'active' ? styles.activeBadge :
                    styles.upcomingBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      trip.status === 'completed' ? styles.completedText :
                      trip.status === 'active' ? styles.activeText :
                      styles.upcomingText
                    ]}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#64748B" />
                    <Text style={styles.detailText}>
                      {new Date(trip.departure_date).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.tripStats}>
                    <Text style={styles.statText}>
                      Space: {trip.space_length}x{trip.space_width}x{trip.space_height} {trip.space_unit}
                    </Text>
                    <Text style={styles.statText}>
                      Weight limit: {trip.weight_limit} {trip.weight_unit}
                    </Text>
                    <Text style={styles.priceText}>
                      {trip.currency} {trip.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    marginRight: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#EF4444',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  tripsList: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  completedBadge: {
    backgroundColor: '#F1F5F9',
  },
  activeBadge: {
    backgroundColor: '#ECFDF5',
  },
  upcomingBadge: {
    backgroundColor: '#EFF6FF',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  completedText: {
    color: '#64748B',
  },
  activeText: {
    color: '#10B981',
  },
  upcomingText: {
    color: '#3B82F6',
  },
  tripDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  tripStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  statText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  priceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 'auto',
  },
});