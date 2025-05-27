import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Calendar, Package, Plane, ChevronRight, Bell } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function HomeScreen() {
  const [userType, setUserType] = useState<'sharer' | 'renter'>('sharer');
  
  const handleAddButtonPress = () => {
    if (userType === 'sharer') {
      router.push('/trip/new/step-1');
    } else {
      router.push('/item/new/step-1');
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.username}>Alex</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* User Type Selector */}
        <View style={styles.userTypeContainer}>
          <TouchableOpacity 
            style={[styles.userTypeButton, userType === 'sharer' && styles.activeUserType]}
            onPress={() => setUserType('sharer')}
          >
            <Text style={[styles.userTypeText, userType === 'sharer' && styles.activeUserTypeText]}>I'm a Sharer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.userTypeButton, userType === 'renter' && styles.activeUserType]}
            onPress={() => setUserType('renter')}
          >
            <Text style={[styles.userTypeText, userType === 'renter' && styles.activeUserTypeText]}>I'm a Renter</Text>
          </TouchableOpacity>
        </View>
        
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.8)', 'rgba(37, 99, 235, 0.9)']}
            style={styles.gradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                {userType === 'sharer' ? 'Share your luggage space' : 'Find space for your items'}
              </Text>
              <Text style={styles.heroSubtitle}>
                {userType === 'sharer' 
                  ? 'Earn extra money while traveling' 
                  : 'Ship your items with travelers'}
              </Text>
              <TouchableOpacity style={styles.heroButton} onPress={handleAddButtonPress}>
                <Text style={styles.heroButtonText}>
                  {userType === 'sharer' ? 'Add your trip' : 'Add your item'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        
        {/* Featured Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured {userType === 'sharer' ? 'Items' : 'Trips'}</Text>
            <Link href="/search" asChild>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See all</Text>
                <ChevronRight size={16} color="#3B82F6" />
              </TouchableOpacity>
            </Link>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
            {userType === 'sharer' ? renderFeaturedItems() : renderFeaturedTrips()}
          </ScrollView>
        </View>
        
        {/* How It Works */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepIconContainer}>
                {userType === 'sharer' ? 
                  <Plane size={24} color="#3B82F6" /> : 
                  <Package size={24} color="#3B82F6" />
                }
              </View>
              <Text style={styles.stepTitle}>
                {userType === 'sharer' ? 'Add your trip' : 'List your item'}
              </Text>
              <Text style={styles.stepDescription}>
                {userType === 'sharer' 
                  ? 'Share your travel details and available space' 
                  : 'Describe your item with photos and requirements'}
              </Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepIconContainer}>
                {userType === 'sharer' ? 
                  <Package size={24} color="#3B82F6" /> : 
                  <Plane size={24} color="#3B82F6" />
                }
              </View>
              <Text style={styles.stepTitle}>
                {userType === 'sharer' ? 'Get requests' : 'Find travelers'}
              </Text>
              <Text style={styles.stepDescription}>
                {userType === 'sharer' 
                  ? 'Review and accept item requests from renters' 
                  : 'Search for travelers heading to your destination'}
              </Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepIconContainer}>
                <MapPin size={24} color="#3B82F6" />
              </View>
              <Text style={styles.stepTitle}>
                {userType === 'sharer' ? 'Deliver items' : 'Track delivery'}
              </Text>
              <Text style={styles.stepDescription}>
                {userType === 'sharer' 
                  ? 'Deliver the items and earn money' 
                  : 'Get updates and confirm delivery'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Space at the bottom for tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

// Helper function to render featured items
function renderFeaturedItems() {
  const items = [
    {
      id: '1',
      name: 'Laptop Package',
      image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=600',
      size: 'Small',
      price: '$25',
      destination: 'London, UK',
    },
    {
      id: '2',
      name: 'Gift Box',
      image: 'https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg?auto=compress&cs=tinysrgb&w=600',
      size: 'Medium',
      price: '$40',
      destination: 'Paris, France',
    },
    {
      id: '3',
      name: 'Camera Equipment',
      image: 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=600',
      size: 'Medium',
      price: '$50',
      destination: 'Tokyo, Japan',
    },
  ];
  
  return items.map(item => (
    <TouchableOpacity key={item.id} style={styles.featuredCard}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemSize}>{item.size}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
        <View style={styles.destination}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.destinationText}>{item.destination}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ));
}

// Helper function to render featured trips
function renderFeaturedTrips() {
  const trips = [
    {
      id: '1',
      origin: 'New York',
      destination: 'London',
      date: 'Aug 15, 2025',
      image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=600',
      spaceAvailable: 'Medium',
      price: '$30',
    },
    {
      id: '2',
      origin: 'San Francisco',
      destination: 'Tokyo',
      date: 'Sep 3, 2025',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600',
      spaceAvailable: 'Large',
      price: '$45',
    },
    {
      id: '3',
      origin: 'Berlin',
      destination: 'Paris',
      date: 'Aug 28, 2025',
      image: 'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=600',
      spaceAvailable: 'Small',
      price: '$20',
    },
  ];
  
  return trips.map(trip => (
    <TouchableOpacity key={trip.id} style={styles.featuredCard}>
      <Image source={{ uri: trip.image }} style={styles.featuredImage} />
      <View style={styles.cardContent}>
        <Text style={styles.tripRoute}>{trip.origin} to {trip.destination}</Text>
        <View style={styles.tripDateContainer}>
          <Calendar size={14} color="#64748B" />
          <Text style={styles.tripDate}>{trip.date}</Text>
        </View>
        <View style={styles.tripDetails}>
          <Text style={styles.spaceAvailable}>{trip.spaceAvailable}</Text>
          <Text style={styles.tripPrice}>{trip.price}</Text>
        </View>
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
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  username: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  userTypeContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeUserType: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeUserTypeText: {
    color: '#3B82F6',
  },
  heroBanner: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    marginBottom: 24,
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  heroContent: {
    maxWidth: '80%',
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 4,
  },
  horizontalScrollView: {
    paddingLeft: 16,
  },
  featuredCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemSize: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  destination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  tripRoute: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  tripDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spaceAvailable: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tripPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  stepsContainer: {
    padding: 16,
  },
  stepItem: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
    flex: 1,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    position: 'absolute',
    left: 64,
    top: 26,
  },
});