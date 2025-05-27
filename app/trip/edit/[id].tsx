import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Trip = Database['public']['Tables']['trips']['Row'];

export default function EditTripScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: '',
  });
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [weightLimit, setWeightLimit] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [itemCount, setItemCount] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [restrictions, setRestrictions] = useState('');

  // Date picker state
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);

  // Fetch trip data
  const { data: trip } = useSupabaseQuery<Trip>(
    () => supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single(),
    [id]
  );

  // Initialize form with trip data
  useEffect(() => {
    if (trip) {
      setDepartureCity(trip.departure_city);
      setArrivalCity(trip.arrival_city);
      setDepartureDate(new Date(trip.departure_date));
      setArrivalDate(new Date(trip.arrival_date));
      setAirline(trip.airline || '');
      setFlightNumber(trip.flight_number || '');
      setDimensions({
        length: trip.space_length.toString(),
        width: trip.space_width.toString(),
        height: trip.space_height.toString(),
      });
      setUnit(trip.space_unit as 'cm' | 'in');
      setWeightLimit(trip.weight_limit.toString());
      setWeightUnit(trip.weight_unit as 'kg' | 'lbs');
      setItemCount(trip.item_count.toString());
      setPrice(trip.price.toString());
      setCurrency(trip.currency);
      setRestrictions(trip.restrictions || '');
    }
  }, [trip]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) return;

      const { error: updateError } = await supabase
        .from('trips')
        .update({
          departure_city: departureCity,
          arrival_city: arrivalCity,
          departure_date: departureDate.toISOString(),
          arrival_date: arrivalDate.toISOString(),
          airline,
          flight_number: flightNumber,
          space_length: parseFloat(dimensions.length),
          space_width: parseFloat(dimensions.width),
          space_height: parseFloat(dimensions.height),
          space_unit: unit,
          weight_limit: parseFloat(weightLimit),
          weight_unit: weightUnit,
          item_count: parseInt(itemCount),
          price: parseFloat(price),
          currency,
          restrictions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('sharer_id', user.id);

      if (updateError) throw updateError;

      router.back();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);

              if (!user?.id) return;

              const { error: deleteError } = await supabase
                .from('trips')
                .delete()
                .eq('id', id)
                .eq('sharer_id', user.id);

              if (deleteError) throw deleteError;

              router.replace('/(tabs)/trips');
            } catch (error) {
              setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
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
        <Text style={styles.title}>Edit Trip</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={loading}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Route Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Departure City</Text>
              <TextInput
                style={styles.input}
                value={departureCity}
                onChangeText={setDepartureCity}
                placeholder="Enter departure city"
                placeholderTextColor="#94A3B8"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Arrival City</Text>
              <TextInput
                style={styles.input}
                value={arrivalCity}
                onChangeText={setArrivalCity}
                placeholder="Enter arrival city"
                placeholderTextColor="#94A3B8"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Departure Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDeparturePicker(true)}
                disabled={loading}
              >
                <Calendar size={20} color="#64748B" />
                <Text style={styles.dateText}>
                  {departureDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Arrival Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowArrivalPicker(true)}
                disabled={loading}
              >
                <Calendar size={20} color="#64748B" />
                <Text style={styles.dateText}>
                  {arrivalDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Airline (Optional)</Text>
              <TextInput
                style={styles.input}
                value={airline}
                onChangeText={setAirline}
                placeholder="Enter airline name"
                placeholderTextColor="#94A3B8"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Flight Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={flightNumber}
                onChangeText={setFlightNumber}
                placeholder="Enter flight number"
                placeholderTextColor="#94A3B8"
                editable={!loading}
              />
            </View>
          </View>

          {/* Space Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Space Details</Text>

            <View style={styles.dimensionsContainer}>
              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Length</Text>
                <TextInput
                  style={styles.input}
                  value={dimensions.length}
                  onChangeText={(text) => setDimensions({ ...dimensions, length: text })}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Width</Text>
                <TextInput
                  style={styles.input}
                  value={dimensions.width}
                  onChangeText={(text) => setDimensions({ ...dimensions, width: text })}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Height</Text>
                <TextInput
                  style={styles.input}
                  value={dimensions.height}
                  onChangeText={(text) => setDimensions({ ...dimensions, height: text })}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
                onPress={() => setUnit('cm')}
                disabled={loading}
              >
                <Text style={[styles.unitButtonText, unit === 'cm' && styles.unitButtonTextActive]}>
                  cm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'in' && styles.unitButtonActive]}
                onPress={() => setUnit('in')}
                disabled={loading}
              >
                <Text style={[styles.unitButtonText, unit === 'in' && styles.unitButtonTextActive]}>
                  inches
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight Limit</Text>
              <TextInput
                style={styles.input}
                value={weightLimit}
                onChangeText={setWeightLimit}
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, weightUnit === 'kg' && styles.unitButtonActive]}
                onPress={() => setWeightUnit('kg')}
                disabled={loading}
              >
                <Text style={[styles.unitButtonText, weightUnit === 'kg' && styles.unitButtonTextActive]}>
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, weightUnit === 'lbs' && styles.unitButtonActive]}
                onPress={() => setWeightUnit('lbs')}
                disabled={loading}
              >
                <Text style={[styles.unitButtonText, weightUnit === 'lbs' && styles.unitButtonTextActive]}>
                  lbs
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of Items</Text>
              <TextInput
                style={styles.input}
                value={itemCount}
                onChangeText={setItemCount}
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                editable={!loading}
              />
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                editable={!loading}
              />
            </View>

            <View style={styles.currencyToggle}>
              <TouchableOpacity
                style={[styles.currencyButton, currency === 'USD' && styles.currencyButtonActive]}
                onPress={() => setCurrency('USD')}
                disabled={loading}
              >
                <Text style={[styles.currencyButtonText, currency === 'USD' && styles.currencyButtonTextActive]}>
                  USD
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.currencyButton, currency === 'EUR' && styles.currencyButtonActive]}
                onPress={() => setCurrency('EUR')}
                disabled={loading}
              >
                <Text style={[styles.currencyButtonText, currency === 'EUR' && styles.currencyButtonTextActive]}>
                  EUR
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Restrictions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Restrictions (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={restrictions}
              onChangeText={setRestrictions}
              placeholder="Add any restrictions or special requirements"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {showDeparturePicker && (
        <DateTimePicker
          value={departureDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDeparturePicker(false);
            if (selectedDate) {
              setDepartureDate(selectedDate);
            }
          }}
        />
      )}

      {showArrivalPicker && (
        <DateTimePicker
          value={arrivalDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowArrivalPicker(false);
            if (selectedDate) {
              setArrivalDate(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
  },
  deleteButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#EF4444',
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
  form: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dimensionInput: {
    flex: 1,
    marginRight: 8,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  unitButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  unitButtonTextActive: {
    color: '#3B82F6',
  },
  currencyToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
  },
  currencyButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  currencyButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currencyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  currencyButtonTextActive: {
    color: '#3B82F6',
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});