import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Plane, Calendar, ArrowLeft, ArrowRight, MapPin } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TripStep1Screen() {
  const router = useRouter();
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureDate, setDepartureDate] = useState(new Date());
  const [arrivalDate, setArrivalDate] = useState(new Date());
  const [airline, setAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  
  // Date picker visibility states
  const [showDeparturePicker, setShowDeparturePicker] = useState(false);
  const [showArrivalPicker, setShowArrivalPicker] = useState(false);
  
  // Error states
  const [departureCityError, setDepartureCityError] = useState('');
  const [arrivalCityError, setArrivalCityError] = useState('');
  const [dateError, setDateError] = useState('');

  const validateDates = (depDate: Date, arrDate: Date) => {
    if (arrDate <= depDate) {
      setDateError('Arrival date must be after departure date');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleDepartureDateChange = (event: any, selectedDate?: Date) => {
    const isWeb = Platform.OS === 'web';
    setShowDeparturePicker(isWeb ? false : Platform.OS !== 'ios');
    
    if (isWeb && event?.target?.value) {
      const date = new Date(event.target.value);
      // For web, we need to handle the time separately
      date.setHours(departureDate.getHours(), departureDate.getMinutes());
      setDepartureDate(date);
      validateDates(date, arrivalDate);
    } else if (selectedDate) {
      setDepartureDate(selectedDate);
      validateDates(selectedDate, arrivalDate);
    }
  };

  const handleDepartureTimeChange = (event: any) => {
    if (Platform.OS === 'web' && event?.target?.value) {
      const [hours, minutes] = event.target.value.split(':');
      const newDate = new Date(departureDate);
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      setDepartureDate(newDate);
      validateDates(newDate, arrivalDate);
    }
  };

  const handleArrivalDateChange = (event: any, selectedDate?: Date) => {
    const isWeb = Platform.OS === 'web';
    setShowArrivalPicker(isWeb ? false : Platform.OS !== 'ios');
    
    if (isWeb && event?.target?.value) {
      const date = new Date(event.target.value);
      // For web, we need to handle the time separately
      date.setHours(arrivalDate.getHours(), arrivalDate.getMinutes());
      setArrivalDate(date);
      validateDates(departureDate, date);
    } else if (selectedDate) {
      setArrivalDate(selectedDate);
      validateDates(departureDate, selectedDate);
    }
  };

  const handleArrivalTimeChange = (event: any) => {
    if (Platform.OS === 'web' && event?.target?.value) {
      const [hours, minutes] = event.target.value.split(':');
      const newDate = new Date(arrivalDate);
      newDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      setArrivalDate(newDate);
      validateDates(departureDate, newDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDateTimePicker = (
    isArrival: boolean,
    date: Date,
    onDateChange: any,
    onTimeChange: any
  ) => {
    const showPicker = isArrival ? showArrivalPicker : showDeparturePicker;
    if (!showPicker) return null;

    if (Platform.OS === 'web') {
      const dateStr = date.toISOString().split('T')[0];
      const timeStr = date.toTimeString().slice(0, 5);
      const minDate = isArrival ? departureDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

      return (
        <View style={styles.webDatePickerContainer}>
          <View 
            style={styles.webDatePickerOverlay} 
            onTouchEnd={() => isArrival ? setShowArrivalPicker(false) : setShowDeparturePicker(false)} 
          />
          <View style={styles.webDatePickerContent}>
            <Text style={styles.webDatePickerTitle}>
              {isArrival ? 'Select Arrival Date & Time' : 'Select Departure Date & Time'}
            </Text>
            <View style={styles.webDateTimeInputs}>
              <input
                type="date"
                value={dateStr}
                onChange={onDateChange}
                min={minDate}
                style={{
                  padding: 12,
                  fontSize: 16,
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  marginBottom: 12,
                  width: '100%',
                }}
              />
              <input
                type="time"
                value={timeStr}
                onChange={onTimeChange}
                style={{
                  padding: 12,
                  fontSize: 16,
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  width: '100%',
                }}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <DateTimePicker
        testID={isArrival ? "arrivalDatePicker" : "departureDatePicker"}
        value={date}
        mode="datetime"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={onDateChange}
        minimumDate={isArrival ? departureDate : new Date()}
      />
    );
  };

  const handleNext = () => {
    if (!departureCity) setDepartureCityError('Departure city is required');
    if (!arrivalCity) setArrivalCityError('Arrival city is required');
    
    if (departureCity && arrivalCity && !departureCityError && !arrivalCityError && !dateError) {
      const searchParams = new URLSearchParams({
        departureCity,
        arrivalCity,
        departureDate: departureDate.toISOString(),
        arrivalDate: arrivalDate.toISOString(),
        airline,
        flightNumber
      });
      
      router.push(`/trip/new/step-2?${searchParams.toString()}`);
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
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Departure City */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Departure City</Text>
            <View style={[styles.inputWrapper, departureCityError ? styles.inputError : null]}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Where are you departing from?"
                placeholderTextColor="#94A3B8"
                value={departureCity}
                onChangeText={(text) => {
                  setDepartureCity(text);
                  setDepartureCityError('');
                }}
              />
            </View>
            {departureCityError ? <Text style={styles.errorText}>{departureCityError}</Text> : null}
          </View>

          {/* Arrival City */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Arrival City</Text>
            <View style={[styles.inputWrapper, arrivalCityError ? styles.inputError : null]}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Where are you going?"
                placeholderTextColor="#94A3B8"
                value={arrivalCity}
                onChangeText={(text) => {
                  setArrivalCity(text);
                  setArrivalCityError('');
                }}
              />
            </View>
            {arrivalCityError ? <Text style={styles.errorText}>{arrivalCityError}</Text> : null}
          </View>

          {/* Dates */}
          <View style={styles.dateContainer}>
            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>Departure Date</Text>
              <TouchableOpacity 
                style={[styles.dateButton, styles.inputWrapper]}
                onPress={() => setShowDeparturePicker(true)}
              >
                <Calendar size={20} color="#64748B" style={styles.inputIcon} />
                <Text style={styles.dateText}>{formatDate(departureDate)}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInput}>
              <Text style={styles.inputLabel}>Arrival Date</Text>
              <TouchableOpacity 
                style={[styles.dateButton, styles.inputWrapper]}
                onPress={() => setShowArrivalPicker(true)}
              >
                <Calendar size={20} color="#64748B" style={styles.inputIcon} />
                <Text style={styles.dateText}>{formatDate(arrivalDate)}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          {/* Date Pickers */}
          {renderDateTimePicker(
            false,
            departureDate,
            handleDepartureDateChange,
            handleDepartureTimeChange
          )}
          
          {renderDateTimePicker(
            true,
            arrivalDate,
            handleArrivalDateChange,
            handleArrivalTimeChange
          )}

          {/* Flight Details (Optional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flight Details (Optional)</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Airline</Text>
                <View style={styles.inputWrapper}>
                  <Plane size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., United Airlines"
                    placeholderTextColor="#94A3B8"
                    value={airline}
                    onChangeText={setAirline}
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Flight Number</Text>
                <View style={styles.inputWrapper}>
                  <Plane size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., UA123"
                    placeholderTextColor="#94A3B8"
                    value={flightNumber}
                    onChangeText={setFlightNumber}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next Step</Text>
          <ArrowRight size={20} color="#FFFFFF" />
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  dateInput: {
    flex: 1,
  },
  dateButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 8,
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
    width: '90%',
    maxWidth: 400,
  },
  webDatePickerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  webDateTimeInputs: {
    width: '100%',
  },
});