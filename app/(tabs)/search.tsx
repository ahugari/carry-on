import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Search as SearchIcon, MapPin, Calendar, Filter, Package, Briefcase, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'trips' | 'items'>('trips');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState('');
  const [size, setSize] = useState<string[]>([]);
  
  const sizes = ['Small', 'Medium', 'Large'];
  
  const clearFilters = () => {
    setDateRange('');
    setSize([]);
  };
  
  const toggleSize = (selectedSize: string) => {
    if (size.includes(selectedSize)) {
      setSize(size.filter(s => s !== selectedSize));
    } else {
      setSize([...size, selectedSize]);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>
      
      {/* Search Type Toggle */}
      <View style={styles.searchTypeContainer}>
        <TouchableOpacity 
          style={[styles.searchTypeButton, searchType === 'trips' && styles.activeSearchType]}
          onPress={() => setSearchType('trips')}
        >
          <Briefcase size={16} color={searchType === 'trips' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.searchTypeText, searchType === 'trips' && styles.activeSearchTypeText]}>
            Find Trips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.searchTypeButton, searchType === 'items' && styles.activeSearchType]}
          onPress={() => setSearchType('items')}
        >
          <Package size={16} color={searchType === 'items' ? '#3B82F6' : '#64748B'} />
          <Text style={[styles.searchTypeText, searchType === 'items' && styles.activeSearchTypeText]}>
            Find Items
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${searchType}...`}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Location */}
        <View style={styles.locationInputContainer}>
          <MapPin size={20} color="#64748B" />
          <TextInput
            style={styles.locationInput}
            placeholder="Where to?"
            placeholderTextColor="#94A3B8"
            value={location}
            onChangeText={setLocation}
          />
        </View>
        
        {/* Filter Button */}
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFilters}>Clear all</Text>
            </TouchableOpacity>
          </View>
          
          {/* Date */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Date</Text>
            <TouchableOpacity style={styles.dateInput}>
              <Calendar size={16} color="#64748B" />
              <Text style={styles.dateText}>
                {dateRange || 'Select dates'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Size */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Size</Text>
            <View style={styles.sizeContainer}>
              {sizes.map((sizeOption) => (
                <TouchableOpacity
                  key={sizeOption}
                  style={[
                    styles.sizeButton,
                    size.includes(sizeOption) && styles.sizeButtonActive
                  ]}
                  onPress={() => toggleSize(sizeOption)}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      size.includes(sizeOption) && styles.sizeButtonTextActive
                    ]}
                  >
                    {sizeOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {searchType === 'trips' ? 'Available Trips' : 'Items Looking for Transport'}
        </Text>
        
        {/* Results */}
        {searchType === 'trips' ? renderTrips() : renderItems()}
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

// Helper function to render trips
function renderTrips() {
  const trips = [
    {
      id: '1',
      origin: 'New York',
      destination: 'London',
      date: 'Aug 15, 2025',
      image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Michael S.',
        image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 4.8
      },
      spaceAvailable: 'Medium',
      price: '$30',
    },
    {
      id: '2',
      origin: 'San Francisco',
      destination: 'Tokyo',
      date: 'Sep 3, 2025',
      image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Sophia L.',
        image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 4.9
      },
      spaceAvailable: 'Large',
      price: '$45',
    },
    {
      id: '3',
      origin: 'Berlin',
      destination: 'Paris',
      date: 'Aug 28, 2025',
      image: 'https://images.pexels.com/photos/2193300/pexels-photo-2193300.jpeg?auto=compress&cs=tinysrgb&w=600',
      user: {
        name: 'Thomas K.',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 4.7
      },
      spaceAvailable: 'Small',
      price: '$20',
    },
  ];
  
  return trips.map(trip => (
    <TouchableOpacity key={trip.id} style={styles.resultCard}>
      <Image source={{ uri: trip.image }} style={styles.resultImage} />
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.tripRoute}>
            {trip.origin} to {trip.destination}
          </Text>
          <Text style={styles.tripPrice}>{trip.price}</Text>
        </View>
        
        <View style={styles.tripInfo}>
          <Calendar size={14} color="#64748B" />
          <Text style={styles.tripInfoText}>{trip.date}</Text>
        </View>
        
        <View style={styles.tripSpaceContainer}>
          <Text style={styles.tripSpace}>{trip.spaceAvailable}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Image source={{ uri: trip.user.image }} style={styles.userImage} />
          <View>
            <Text style={styles.userName}>{trip.user.name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starIcon} />
              <Text style={styles.rating}>{trip.user.rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ));
}

// Helper function to render items
function renderItems() {
  const items = [
    {
      id: '1',
      name: 'Laptop Package',
      image: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=600',
      origin: 'New York',
      destination: 'London',
      user: {
        name: 'Emma W.',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 4.8
      },
      size: 'Small',
      price: '$25',
    },
    {
      id: '2',
      name: 'Gift Box',
      image: 'https://images.pexels.com/photos/1666067/pexels-photo-1666067.jpeg?auto=compress&cs=tinysrgb&w=600',
      origin: 'Berlin',
      destination: 'Paris',
      user: {
        name: 'David R.',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 4.6
      },
      size: 'Medium',
      price: '$40',
    },
    {
      id: '3',
      name: 'Camera Equipment',
      image: 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=600',
      origin: 'San Francisco',
      destination: 'Tokyo',
      user: {
        name: 'Jennifer L.',
        image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 4.9
      },
      size: 'Medium',
      price: '$50',
    },
  ];
  
  return items.map(item => (
    <TouchableOpacity key={item.id} style={styles.resultCard}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
        
        <View style={styles.tripInfo}>
          <MapPin size={14} color="#64748B" />
          <Text style={styles.tripInfoText}>
            {item.origin} to {item.destination}
          </Text>
        </View>
        
        <View style={styles.itemSizeContainer}>
          <Text style={styles.itemSize}>{item.size}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.image }} style={styles.userImage} />
          <View>
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starIcon} />
              <Text style={styles.rating}>{item.user.rating}</Text>
            </View>
          </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
  },
  searchTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F1F5F9',
  },
  activeSearchType: {
    backgroundColor: '#EFF6FF',
  },
  searchTypeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  activeSearchTypeText: {
    color: '#3B82F6',
  },
  searchBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  locationInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  clearFilters: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  sizeContainer: {
    flexDirection: 'row',
  },
  sizeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  sizeButtonActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  sizeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  sizeButtonTextActive: {
    color: '#3B82F6',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  resultCard: {
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
  resultImage: {
    width: 120,
    height: '100%',
  },
  resultContent: {
    flex: 1,
    padding: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tripRoute: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  tripPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  tripSpaceContainer: {
    marginBottom: 8,
  },
  tripSpace: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  itemName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  itemPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
  },
  itemSizeContainer: {
    marginBottom: 8,
  },
  itemSize: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  userName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#FACC15',
    borderRadius: 6,
    marginRight: 4,
  },
  rating: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
});