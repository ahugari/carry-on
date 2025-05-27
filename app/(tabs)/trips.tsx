import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Link } from 'expo-router';
import { Plus, Briefcase, Package, ArrowRight } from 'lucide-react-native';

export default function TripsScreen() {
  const [activeTab, setActiveTab] = useState<'trips' | 'items'>('trips');
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Link 
          href={activeTab === 'trips' ? "/trips/new/step-1" : "/trips/item/step-1"} 
          asChild
        >
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Link>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trips' && styles.activeTab]}
          onPress={() => setActiveTab('trips')}
        >
          <Briefcase size={20} color={activeTab === 'trips' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'trips' && styles.activeTabText]}>
            My Trips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <Package size={20} color={activeTab === 'items' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
            My Items
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Trip/Item Status Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statusFilters}
          contentContainerStyle={styles.statusFiltersContent}
        >
          <TouchableOpacity style={[styles.statusFilter, styles.activeStatusFilter]}>
            <Text style={[styles.statusFilterText, styles.activeStatusFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusFilter}>
            <Text style={styles.statusFilterText}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusFilter}>
            <Text style={styles.statusFilterText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusFilter}>
            <Text style={styles.statusFilterText}>Completed</Text>
          </TouchableOpacity>
        </ScrollView>
        
        {/* Trip/Item List */}
        <View style={styles.listContainer}>
          {activeTab === 'trips' ? renderTrips() : renderItems()}
        </View>
        
        {/* Empty State */}
        {(activeTab === 'trips' && trips.length === 0) || (activeTab === 'items' && items.length === 0) ? (
          <View style={styles.emptyState}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/7473087/pexels-photo-7473087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'trips' ? 'No trips yet' : 'No items yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'trips' 
                ? 'Add your first trip and start earning by sharing your luggage space.' 
                : 'Add your first item and find travelers to transport it for you.'}
            </Text>
            <Link 
              href={activeTab === 'trips' ? "/trips/new/step-1" : "/trips/item/step-1"} 
              asChild
            >
              <TouchableOpacity style={styles.emptyStateButton}>
                <Text style={styles.emptyStateButtonText}>
                  {activeTab === 'trips' ? 'Add a Trip' : 'Add an Item'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : null}
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

// Sample data
const trips = [
  {
    id: '1',
    origin: 'New York',
    destination: 'London',
    date: 'Aug 15, 2025',
    image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'Upcoming',
    requests: 2,
  },
  {
    id: '2',
    origin: 'San Francisco',
    destination: 'Tokyo',
    date: 'Sep 3, 2025',
    image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'Active',
    requests: 0,
  },
];

const items = [
  {
    id: '1',
    name: 'Laptop Package',
    origin: 'New York',
    destination: 'London',
    image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=600',
    status: 'Looking for Carrier',
    offers: 3,
  },
];

// Helper function to render trips
function renderTrips() {
  return trips.map(trip => (
    <TouchableOpacity key={trip.id} style={styles.tripCard}>
      <Image source={{ uri: trip.image }} style={styles.tripImage} />
      
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripRoute}>
            {trip.origin} to {trip.destination}
          </Text>
          <View style={[
            styles.statusBadge, 
            trip.status === 'Upcoming' ? styles.upcomingStatus : 
            trip.status === 'Active' ? styles.activeStatus : styles.completedStatus
          ]}>
            <Text style={[
              styles.statusText,
              trip.status === 'Upcoming' ? styles.upcomingStatusText : 
              trip.status === 'Active' ? styles.activeStatusText : styles.completedStatusText
            ]}>
              {trip.status}
            </Text>
          </View>
        </View>
        
        <Text style={styles.tripDate}>{trip.date}</Text>
        
        {trip.requests > 0 ? (
          <View style={styles.requestContainer}>
            <Text style={styles.requestText}>
              {trip.requests} new item {trip.requests === 1 ? 'request' : 'requests'}
            </Text>
            <ArrowRight size={16} color="#3B82F6" />
          </View>
        ) : (
          <Text style={styles.noRequestsText}>No item requests yet</Text>
        )}
      </View>
    </TouchableOpacity>
  ));
}

// Helper function to render items
function renderItems() {
  return items.map(item => (
    <TouchableOpacity key={item.id} style={styles.tripCard}>
      <Image source={{ uri: item.image }} style={styles.tripImage} />
      
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripRoute}>{item.name}</Text>
          <View style={[
            styles.statusBadge, 
            item.status === 'Looking for Carrier' ? styles.upcomingStatus : 
            item.status === 'In Transit' ? styles.activeStatus : styles.completedStatus
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'Looking for Carrier' ? styles.upcomingStatusText : 
              item.status === 'In Transit' ? styles.activeStatusText : styles.completedStatusText
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <Text style={styles.tripDate}>
          {item.origin} to {item.destination}
        </Text>
        
        {item.offers > 0 ? (
          <View style={styles.requestContainer}>
            <Text style={styles.requestText}>
              {item.offers} carrier {item.offers === 1 ? 'offer' : 'offers'}
            </Text>
            <ArrowRight size={16} color="#3B82F6" />
          </View>
        ) : (
          <Text style={styles.noRequestsText}>No carrier offers yet</Text>
        )}
      </View>
    </TouchableOpacity>
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F1F5F9',
  },
  activeTab: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  activeTabText: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
  },
  statusFilters: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  statusFiltersContent: {
    paddingHorizontal: 16,
  },
  statusFilter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
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
  tripCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tripImage: {
    width: 110,
    height: '100%',
  },
  tripContent: {
    flex: 1,
    padding: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tripRoute: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  upcomingStatus: {
    backgroundColor: '#EFF6FF',
  },
  activeStatus: {
    backgroundColor: '#ECFDF5',
  },
  completedStatus: {
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  upcomingStatusText: {
    color: '#3B82F6',
  },
  activeStatusText: {
    color: '#10B981',
  },
  completedStatusText: {
    color: '#64748B',
  },
  tripDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 4,
  },
  noRequestsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});