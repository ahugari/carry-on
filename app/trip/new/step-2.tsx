import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, Box, Weight, DollarSign } from 'lucide-react-native';

const UNITS = {
  METRIC: {
    length: 'cm',
    weight: 'kg'
  },
  IMPERIAL: {
    length: 'in',
    weight: 'lb'
  }
};

export default function TripStep2Screen() {
  const params = useLocalSearchParams();
  const [unit, setUnit] = useState<'METRIC' | 'IMPERIAL'>('METRIC');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weightLimit, setWeightLimit] = useState('');
  const [itemCount, setItemCount] = useState('1');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');

  // Error states
  const [dimensionError, setDimensionError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [priceError, setPriceError] = useState('');

  const validateDimensions = () => {
    if (!length || !width || !height) {
      setDimensionError('All dimensions are required');
      return false;
    }
    if (parseFloat(length) <= 0 || parseFloat(width) <= 0 || parseFloat(height) <= 0) {
      setDimensionError('Dimensions must be greater than 0');
      return false;
    }
    setDimensionError('');
    return true;
  };

  const validateWeight = () => {
    if (!weightLimit) {
      setWeightError('Weight limit is required');
      return false;
    }
    if (parseFloat(weightLimit) <= 0) {
      setWeightError('Weight limit must be greater than 0');
      return false;
    }
    setWeightError('');
    return true;
  };

  const validatePrice = () => {
    if (!price) {
      setPriceError('Price is required');
      return false;
    }
    if (parseFloat(price) <= 0) {
      setPriceError('Price must be greater than 0');
      return false;
    }
    setPriceError('');
    return true;
  };

  const handleNext = () => {
    const isValid = validateDimensions() && validateWeight() && validatePrice();
    
    if (isValid) {
      router.push({
        pathname: '/trip/new/step-3',
        params: {
          ...params,
          length,
          width,
          height,
          spaceUnit: UNITS[unit].length,
          weightLimit,
          weightUnit: UNITS[unit].weight,
          itemCount,
          price,
          currency
        }
      });
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
        <Text style={styles.title}>Space & Pricing</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Unit Selection */}
        <View style={styles.unitContainer}>
          <TouchableOpacity 
            style={[styles.unitButton, unit === 'METRIC' && styles.activeUnit]}
            onPress={() => setUnit('METRIC')}
          >
            <Text style={[styles.unitText, unit === 'METRIC' && styles.activeUnitText]}>
              Metric (cm/kg)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.unitButton, unit === 'IMPERIAL' && styles.activeUnit]}
            onPress={() => setUnit('IMPERIAL')}
          >
            <Text style={[styles.unitText, unit === 'IMPERIAL' && styles.activeUnitText]}>
              Imperial (in/lb)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Space Dimensions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Box size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Available Space</Text>
            </View>
            
            <View style={styles.dimensionsContainer}>
              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Length</Text>
                <View style={[styles.inputWrapper, dimensionError ? styles.inputError : null]}>
                  <Box size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`0 ${UNITS[unit].length}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                    value={length}
                    onChangeText={setLength}
                  />
                </View>
              </View>
              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Width</Text>
                <View style={[styles.inputWrapper, dimensionError ? styles.inputError : null]}>
                  <Box size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`0 ${UNITS[unit].length}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                    value={width}
                    onChangeText={setWidth}
                  />
                </View>
              </View>
              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Height</Text>
                <View style={[styles.inputWrapper, dimensionError ? styles.inputError : null]}>
                  <Box size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`0 ${UNITS[unit].length}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType="decimal-pad"
                    value={height}
                    onChangeText={setHeight}
                  />
                </View>
              </View>
            </View>
            {dimensionError ? <Text style={styles.errorText}>{dimensionError}</Text> : null}
          </View>

          {/* Weight Limit */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Weight size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Weight Limit</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, weightError ? styles.inputError : null]}>
                <Weight size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={`Maximum weight in ${UNITS[unit].weight}`}
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={weightLimit}
                  onChangeText={setWeightLimit}
                />
              </View>
              {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
            </View>
          </View>

          {/* Item Count */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maximum Number of Items</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setItemCount(Math.max(1, parseInt(itemCount) - 1).toString())}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>{itemCount}</Text>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setItemCount((parseInt(itemCount) + 1).toString())}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Price per Item</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, priceError ? styles.inputError : null]}>
                <DollarSign size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter price per item"
                  placeholderTextColor="#94A3B8"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
                <Text style={styles.currencyText}>{currency}</Text>
              </View>
              {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
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
  unitContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeUnit: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeUnitText: {
    color: '#1F2937',
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginLeft: 8,
  },
  dimensionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dimensionInput: {
    flex: 1,
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
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'flex-start',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  counterButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
  },
  counterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#1F2937',
    paddingHorizontal: 16,
  },
  currencyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
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
});