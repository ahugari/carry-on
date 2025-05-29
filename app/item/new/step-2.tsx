import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Scale, DollarSign, Box } from 'lucide-react-native';

const CATEGORIES = [
  'Documents',
  'Clothing',
  'Electronics',
  'Gifts',
  'Books',
  'Accessories',
  'Other'
];

export default function NewItemStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [dimensions, setDimensions] = useState({
    length: '',
    width: '',
    height: ''
  });
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [category, setCategory] = useState('');
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('USD');

  // Error states
  const [dimensionsError, setDimensionsError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [valueError, setValueError] = useState('');

  const validateDimensions = () => {
    if (!dimensions.length || !dimensions.width || !dimensions.height) {
      setDimensionsError('All dimensions are required');
      return false;
    }
    if (parseFloat(dimensions.length) <= 0 || 
        parseFloat(dimensions.width) <= 0 || 
        parseFloat(dimensions.height) <= 0) {
      setDimensionsError('Dimensions must be greater than 0');
      return false;
    }
    setDimensionsError('');
    return true;
  };

  const validateWeight = () => {
    if (!weight) {
      setWeightError('Weight is required');
      return false;
    }
    if (parseFloat(weight) <= 0) {
      setWeightError('Weight must be greater than 0');
      return false;
    }
    setWeightError('');
    return true;
  };

  const validateCategory = () => {
    if (!category) {
      setCategoryError('Please select a category');
      return false;
    }
    setCategoryError('');
    return true;
  };

  const validateValue = () => {
    if (!value) {
      setValueError('Item value is required');
      return false;
    }
    if (parseFloat(value) <= 0) {
      setValueError('Value must be greater than 0');
      return false;
    }
    setValueError('');
    return true;
  };

  const handleNext = () => {
    const isValid = validateDimensions() && validateWeight() && validateCategory() && validateValue();
    
    if (isValid) {
      const searchParams = new URLSearchParams({
        ...params,
        dimensions: JSON.stringify(dimensions),
        unit,
        weight,
        weightUnit,
        category,
        value,
        currency
      });
      
      router.push(`/item/new/step-3?${searchParams.toString()}`);
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
        <Text style={styles.title}>Item Specifications</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Unit Toggle */}
        <View style={styles.unitContainer}>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'cm' && styles.activeUnit]}
            onPress={() => {
              setUnit('cm');
              setWeightUnit('kg');
            }}
          >
            <Text style={[styles.unitText, unit === 'cm' && styles.activeUnitText]}>
              Metric (cm, kg)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.unitButton, unit === 'in' && styles.activeUnit]}
            onPress={() => {
              setUnit('in');
              setWeightUnit('lbs');
            }}
          >
            <Text style={[styles.unitText, unit === 'in' && styles.activeUnitText]}>
              Imperial (in, lbs)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Dimensions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Box size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Item Dimensions</Text>
            </View>
            
            <View style={styles.dimensionsContainer}>
              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Length</Text>
                <View style={[styles.inputWrapper, dimensionsError ? styles.inputError : null]}>
                  <Box size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`0 ${unit}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={dimensions.length}
                    onChangeText={(text) => setDimensions({ ...dimensions, length: text })}
                  />
                </View>
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Width</Text>
                <View style={[styles.inputWrapper, dimensionsError ? styles.inputError : null]}>
                  <Box size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`0 ${unit}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={dimensions.width}
                    onChangeText={(text) => setDimensions({ ...dimensions, width: text })}
                  />
                </View>
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Height</Text>
                <View style={[styles.inputWrapper, dimensionsError ? styles.inputError : null]}>
                  <Box size={20} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`0 ${unit}`}
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={dimensions.height}
                    onChangeText={(text) => setDimensions({ ...dimensions, height: text })}
                  />
                </View>
              </View>
            </View>
            {dimensionsError ? <Text style={styles.errorText}>{dimensionsError}</Text> : null}
          </View>

          {/* Weight */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Scale size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Item Weight</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, weightError ? styles.inputError : null]}>
                <Scale size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={`Weight in ${weightUnit}`}
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
              {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoriesContainer}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.selectedCategory
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text 
                    style={[
                      styles.categoryText,
                      category === cat && styles.selectedCategoryText
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
          </View>

          {/* Value */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color="#64748B" />
              <Text style={styles.sectionTitle}>Item Value</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Declare the value of your item for insurance purposes
            </Text>

            <View style={styles.valueContainer}>
              <View style={[styles.inputWrapper, valueError ? styles.inputError : null]}>
                <DollarSign size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={setValue}
                />
                <Text style={styles.currencyText}>{currency}</Text>
              </View>

              <View style={styles.currencySelector}>
                <TouchableOpacity
                  style={[styles.currencyButton, currency === 'USD' && styles.currencyButtonActive]}
                  onPress={() => setCurrency('USD')}
                >
                  <Text style={[styles.currencyButtonText, currency === 'USD' && styles.currencyButtonTextActive]}>
                    USD
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.currencyButton, currency === 'EUR' && styles.currencyButtonActive]}
                  onPress={() => setCurrency('EUR')}
                >
                  <Text style={[styles.currencyButtonText, currency === 'EUR' && styles.currencyButtonTextActive]}>
                    EUR
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {valueError ? <Text style={styles.errorText}>{valueError}</Text> : null}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next Step</Text>
        </TouchableOpacity>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
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
    marginBottom: 16,
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
  currencyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
    marginLeft: 8,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  selectedCategory: {
    backgroundColor: '#EFF6FF',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  selectedCategoryText: {
    color: '#3B82F6',
  },
  valueContainer: {
    marginBottom: 16,
  },
  currencySelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  currencyButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  currencyButtonTextActive: {
    color: '#1F2937',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
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
});