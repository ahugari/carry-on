import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Briefcase, Package, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
};

type Trip = {
  id: string;
  origin: string;
  destination: string;
  departure_date: string;
  status: string;
  carrier: Profile | null;
  sender: Profile | null;
  requests: {
    count: number;
  };
};

type Item = {
  id: string;
  name: string;
  origin: string;
  destination: string;
  status: string;
  owner: Profile | null;
  carrier: Profile | null;
  offers: {
    count: number;
  };
};

type SupabaseTrip = Omit<Trip, 'carrier' | 'sender' | 'requests'> & {
  carrier: Profile[];
  sender: Profile[];
  requests: { count: number }[];
};

type SupabaseItem = Omit<Item, 'owner' | 'carrier' | 'offers'> & {
  owner: Profile[];
  carrier: Profile[];
  offers: { count: number }[];
};

type StatusStyle = {
  backgroundColor: string;
};

type StatusStyles = {
  [key: string]: StatusStyle;
};

type StatusTextStyle = {
  color: string;
};

type StatusTextStyles = {
  [key: string]: StatusTextStyle;
};

export default function ActivitiesScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'trips' | 'items'>('trips');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('all');

  useEffect(() => {
    if (profile?.id) {
      loadActivities();
    }
  }, [profile?.id]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      // Load trips where user is either carrier or sender
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select(`
          id,
          origin,
          destination,
          departure_date,
          status,
          carrier:profiles!carrier_id(id, full_name, avatar_url),
          sender:profiles!sender_id(id, full_name, avatar_url),
          requests:item_requests(count)
        `)
        .or(`carrier_id.eq.${profile?.id},sender_id.eq.${profile?.id}`);

      if (tripsError) throw tripsError;

      // Load items where user is either carrier or owner
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select(`
          id,
          name,
          origin,
          destination,
          status,
          owner:profiles!owner_id(id, full_name, avatar_url),
          carrier:profiles!carrier_id(id, full_name, avatar_url),
          offers:delivery_offers(count)
        `)
        .or(`carrier_id.eq.${profile?.id},owner_id.eq.${profile?.id}`);

      if (itemsError) throw itemsError;

      // Transform the data to match our types
      const transformedTrips = (tripsData || []).map((trip: SupabaseTrip) => ({
        ...trip,
        carrier: trip.carrier[0] || null,
        sender: trip.sender[0] || null,
        requests: trip.requests[0] || { count: 0 },
      }));

      const transformedItems = (itemsData || []).map((item: SupabaseItem) => ({
        ...item,
        owner: item.owner[0] || null,
        carrier: item.carrier[0] || null,
        offers: item.offers[0] || { count: 0 },
      }));

      setTrips(transformedTrips);
      setItems(transformedItems);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    if (activeStatus === 'all') return true;
    return trip.status.toLowerCase() === activeStatus;
  });

  const filteredItems = items.filter(item => {
    if (activeStatus === 'all') return true;
    return item.status.toLowerCase() === activeStatus;
  });

  const isCarrier = (trip: Trip) => trip.carrier?.id === profile?.id;
  const isItemCarrier = (item: Item) => item.carrier?.id === profile?.id;
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activities</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push(activeTab === 'trips' ? '/trip/new' : '/item/new')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trips' && styles.activeTab]}
          onPress={() => setActiveTab('trips')}
        >
          <Briefcase size={20} color={activeTab === 'trips' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'trips' && styles.activeTabText]}>
            Deliveries
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Package size={20} color={activeTab === 'items' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
            Items
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Status Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statusFilters}
          contentContainerStyle={styles.statusFiltersContent}
        >
          <TouchableOpacity 
            style={[styles.statusFilter, activeStatus === 'all' && styles.activeStatusFilter]}
            onPress={() => setActiveStatus('all')}
          >
            <Text style={[styles.statusFilterText, activeStatus === 'all' && styles.activeStatusFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusFilter, activeStatus === 'pending' && styles.activeStatusFilter]}
            onPress={() => setActiveStatus('pending')}
          >
            <Text style={[styles.statusFilterText, activeStatus === 'pending' && styles.activeStatusFilterText]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusFilter, activeStatus === 'active' && styles.activeStatusFilter]}
            onPress={() => setActiveStatus('active')}
          >
            <Text style={[styles.statusFilterText, activeStatus === 'active' && styles.activeStatusFilterText]}>
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statusFilter, activeStatus === 'completed' && styles.activeStatusFilter]}
            onPress={() => setActiveStatus('completed')}
          >
            <Text style={[styles.statusFilterText, activeStatus === 'completed' && styles.activeStatusFilterText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Activity List */}
        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          ) : activeTab === 'trips' ? (
            filteredTrips.length > 0 ? (
              filteredTrips.map(trip => (
                <TouchableOpacity 
                  key={trip.id} 
                  style={styles.tripCard}
                  onPress={() => router.push(`/trip/${trip.id}`)}
                >
                  <View style={styles.tripContent}>
                    <View style={styles.tripHeader}>
                      <Text style={styles.tripRoute}>
                        {trip.origin} to {trip.destination}
                      </Text>
                      <View style={[styles.statusBadge, getStatusStyle(trip.status)]}>
                        <Text style={[styles.statusText, getStatusTextStyle(trip.status)]}>
                          {trip.status}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tripDetails}>
                      <View style={styles.tripInfo}>
                        <Text style={styles.tripLabel}>
                          {isCarrier(trip) ? 'Sender' : 'Carrier'}:
                        </Text>
                        <Text style={styles.tripValue}>
                          {isCarrier(trip) ? trip.sender?.full_name : trip.carrier?.full_name || 'Not assigned'}
                        </Text>
                      </View>
                      <View style={styles.tripInfo}>
                        <Text style={styles.tripLabel}>Departure:</Text>
                        <Text style={styles.tripValue}>
                          {new Date(trip.departure_date).toLocaleDateString()}
                        </Text>
                      </View>
                      {trip.requests.count > 0 && (
                        <View style={styles.tripInfo}>
                          <Text style={styles.tripLabel}>Requests:</Text>
                          <Text style={styles.tripValue}>{trip.requests.count}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <ArrowRight size={20} color="#64748B" />
                </TouchableOpacity>
              ))
            ) : (
              <EmptyState type="trips" onAdd={() => router.push('/trip/new')} />
            )
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.tripCard}
                onPress={() => router.push(`/item/${item.id}`)}
              >
                <View style={styles.tripContent}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripRoute}>
                      {item.name}
                    </Text>
                    <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                      <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tripDetails}>
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripLabel}>Route:</Text>
                      <Text style={styles.tripValue}>
                        {item.origin} to {item.destination}
                      </Text>
                    </View>
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripLabel}>
                        {isItemCarrier(item) ? 'Owner' : 'Carrier'}:
                      </Text>
                      <Text style={styles.tripValue}>
                        {isItemCarrier(item) ? item.owner?.full_name : item.carrier?.full_name || 'Not assigned'}
                      </Text>
                    </View>
                    {item.offers.count > 0 && (
                      <View style={styles.tripInfo}>
                        <Text style={styles.tripLabel}>Offers:</Text>
                        <Text style={styles.tripValue}>{item.offers.count}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <ArrowRight size={20} color="#64748B" />
              </TouchableOpacity>
            ))
          ) : (
            <EmptyState type="items" onAdd={() => router.push('/item/new')} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function EmptyState({ type, onAdd }: { type: 'trips' | 'items', onAdd: () => void }) {
  return (
    <View style={styles.emptyState}>
      {type === 'trips' ? (
        <>
          <Briefcase size={48} color="#94A3B8" />
          <Text style={styles.emptyStateTitle}>No deliveries yet</Text>
          <Text style={styles.emptyStateText}>
            Start by creating a new delivery route or browse available items to deliver
          </Text>
        </>
      ) : (
        <>
          <Package size={48} color="#94A3B8" />
          <Text style={styles.emptyStateTitle}>No items yet</Text>
          <Text style={styles.emptyStateText}>
            Start by adding an item you need delivered or browse available delivery routes
          </Text>
        </>
      )}
      <TouchableOpacity style={styles.emptyStateButton} onPress={onAdd}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.emptyStateButtonText}>
          {type === 'trips' ? 'Add Delivery Route' : 'Add Item'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function getStatusStyle(status: string): StatusStyle {
  const statusStyles: StatusStyles = {
    pending: {
      backgroundColor: '#FEF3C7',
    },
    active: {
      backgroundColor: '#DCFCE7',
    },
    completed: {
      backgroundColor: '#F1F5F9',
    },
    cancelled: {
      backgroundColor: '#FEE2E2',
    },
  };
  return statusStyles[status.toLowerCase()] || statusStyles.pending;
}

function getStatusTextStyle(status: string): StatusTextStyle {
  const statusStyles: StatusTextStyles = {
    pending: {
      color: '#D97706',
    },
    active: {
      color: '#059669',
    },
    completed: {
      color: '#475569',
    },
    cancelled: {
      color: '#DC2626',
    },
  };
  return statusStyles[status.toLowerCase()] || statusStyles.pending;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  statusFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statusFiltersContent: {
    paddingRight: 16,
  },
  statusFilter: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  activeStatusFilter: {
    backgroundColor: '#3B82F6',
  },
  statusFilterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeStatusFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  tripContent: {
    flex: 1,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripRoute: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  tripDetails: {
    gap: 8,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
  tripValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});