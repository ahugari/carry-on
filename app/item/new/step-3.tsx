import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, CircleAlert as AlertCircle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type RouteParams = {
  itemName: string;
  pickupCity: string;
  deliveryCity: string;
  category: string;
  dimensions: string;
  unit: string;
  weight: string;
  weightUnit: string;
  currency: string;
  value: string;
};

export default function NewItemStep3() {
  const router = useRouter();
  // For now, we'll use window.location to get the params since we're in a web environment
  const params = typeof window !== 'undefined' ? 
    Object.fromEntries(new URLSearchParams(window.location.search)) as RouteParams : 
    {} as RouteParams;
  
  const [desiredDate, setDesiredDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const isWeb = Platform.OS === 'web';
    setShowDatePicker(isWeb ? false : Platform.OS !== 'ios');
    
    if (isWeb && event?.target?.value) {
      setDesiredDate(new Date(event.target.value));
    } else if (selectedDate) {
      setDesiredDate(selectedDate);
    }
  };

  const handlePublish = () => {
    // In a real app, you would make an API call to save the item
    router.replace('/(tabs)/trips');
  };

  // Safely parse dimensions with a default value
  const getDimensions = () => {
    try {
      return JSON.parse(params.dimensions as string) || { length: 0, width: 0, height: 0 };
    } catch (error) {
      return { length: 0, width: 0, height: 0 };
    }
  };

  const dimensions = getDimensions();

  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    if (Platform.OS === 'web') {
      return (
        <View style={styles.webDatePickerContainer}>
          <View style={styles.webDatePickerOverlay} onTouchEnd={() => setShowDatePicker(false)} />
          <View style={styles.webDatePickerContent}>
            <input
              type="date"
              value={desiredDate.toISOString().split('T')[0]}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              style={{
                padding: 12,
                fontSize: 16,
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                width: '100%',
                maxWidth: 300,
              }}
            />
          </View>
        </View>
      );
    }

    return (
      <DateTimePicker
        value={desiredDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange}
        minimumDate={new Date()}
      />
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
        <Text style={styles.title}>Additional Details</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 3 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Desired Delivery Date */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desired Delivery Date</Text>
            <Text style={styles.sectionDescription}>
              When would you like your item to be delivered?
            </Text>

            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#64748B" style={styles.dateIcon} />
              <Text style={styles.dateText}>
                {desiredDate.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.sectionDescription}>
              Add any special handling instructions or requirements
            </Text>

            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="E.g., Handle with care, fragile items, specific delivery preferences..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
              />
            </View>
          </View>

          {/* Item Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryHeader}>
              <AlertCircle size={20} color="#3B82F6" />
              <Text style={styles.summaryTitle}>Item Summary</Text>
            </View>

            <View style={styles.summaryContent}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item</Text>
                <Text style={styles.summaryValue}>{params.itemName}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Route</Text>
                <Text style={styles.summaryValue}>
                  {params.pickupCity} → {params.deliveryCity}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Category</Text>
                <Text style={styles.summaryValue}>{params.category}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Dimensions</Text>
                <Text style={styles.summaryValue}>
                  {dimensions.length}x{dimensions.width}x{dimensions.height} {params.unit}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Weight</Text>
                <Text style={styles.summaryValue}>
                  {params.weight} {params.weightUnit}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Declared Value</Text>
                <Text style={styles.summaryValue}>
                  {params.currency} {params.value}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {renderDatePicker()}

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.publishButton}
          onPress={handlePublish}
        >
          <Text style={styles.publishButtonText}>Publish Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
    fontSize: 18,
    color: '#1F2937',
  },
  stepIndicator: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stepText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
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
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
  },
  dateIcon: {
    marginRight: 12,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
  },
  textArea: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    height: 100,
  },
  summaryContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  summaryContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  summaryValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  publishButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  webDatePickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  webDatePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  webDatePickerContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});