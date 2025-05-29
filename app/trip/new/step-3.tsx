import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check, AlertTriangle, Shield } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const ITEM_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Documents',
  'Food',
  'Fragile',
  'Medical',
  'Other'
];

export default function TripStep3Screen() {
  const params = useLocalSearchParams();
  const { session } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    if (!session?.user.id) {
      Alert.alert('Error', 'You must be logged in to create a trip');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one item category');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('trips')
        .insert({
          sharer_id: session.user.id,
          departure_city: params.departureCity as string,
          arrival_city: params.arrivalCity as string,
          departure_date: params.departureDate as string,
          arrival_date: params.arrivalDate as string,
          airline: params.airline as string,
          flight_number: params.flightNumber as string,
          space_length: parseFloat(params.length as string),
          space_width: parseFloat(params.width as string),
          space_height: parseFloat(params.height as string),
          space_unit: params.spaceUnit as string,
          weight_limit: parseFloat(params.weightLimit as string),
          weight_unit: params.weightUnit as string,
          item_count: parseInt(params.itemCount as string),
          price: parseFloat(params.price as string),
          currency: params.currency as string,
          accepted_categories: selectedCategories,
          restrictions: restrictions || null,
          status: 'active'
        });

      if (error) throw error;
      
      Alert.alert(
        'Success',
        'Your trip has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Item Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Check size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Accepted Item Categories</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Select the types of items you're willing to transport
            </Text>
            
            <View style={styles.categoriesContainer}>
              {ITEM_CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategories.includes(category) && styles.selectedCategory
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(category) && styles.selectedCategoryText
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Restrictions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Restrictions</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Add any specific restrictions or requirements for items
            </Text>
            
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="E.g., No liquids, fragile items must be properly packaged, etc."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={restrictions}
                onChangeText={setRestrictions}
              />
            </View>
          </View>

          {/* Insurance Coverage */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Insurance Coverage</Text>
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Basic Coverage Included</Text>
              <Text style={styles.infoText}>
                Your trip includes our standard insurance coverage of up to $500 per item.
                Additional coverage can be purchased by renters during booking.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
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
  },
  stepIndicator: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginLeft: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCategory: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  selectedCategoryText: {
    color: '#3B82F6',
  },
  textAreaWrapper: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    minHeight: 120,
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    minHeight: 96,
  },
  infoBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});