import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Scale, DollarSign } from 'lucide-react-native';

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
      router.push({
        pathname: '/item/new/step-3',
        params: {
          ...params,
          dimensions: JSON.stringify(dimensions),
          unit,
          weight,
          weightUnit,
          category,
          value,
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
        <Text style={styles.title}>Item Specifications</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Dimensions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Dimensions</Text>
            
            <View style={styles.dimensionsContainer}>
              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Length</Text>
                <View style={[styles.inputWrapper, dimensionsError ? styles.inputError : null]}>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={dimensions.length}
                    onChangeText={(text) => setDimensions({ ...dimensions, length: text })}
                  />
                  <Text style={styles.unitText}>{unit}</Text>
                </View>
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Width</Text>
                <View style={[styles.inputWrapper, dimensionsError ? styles.inputError : null]}>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={dimensions.width}
                    onChangeText={(text) => setDimensions({ ...dimensions, width: text })}
                  />
                  <Text style={styles.unitText}>{unit}</Text>
                </View>
              </View>

              <View style={styles.dimensionInput}>
                <Text style={styles.inputLabel}>Height</Text>
                <View style={[styles.inputWrapper, dimensionsError ? styles.inputError : null]}>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={dimensions.height}
                    onChangeText={(text) => setDimensions({ ...dimensions, height: text })}
                  />
                  <Text style={styles.unitText}>{unit}</Text>
                </View>
              </View>
            </View>

            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]}
                onPress={() => setUnit('cm')}
              >
                <Text style={[styles.unitButtonText, unit === 'cm' && styles.unitButtonTextActive]}>
                  cm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'in' && styles.unitButtonActive]}
                onPress={() => setUnit('in')}
              >
                <Text style={[styles.unitButtonText, unit === 'in' && styles.unitButtonTextActive]}>
                  inches
                </Text>
              </TouchableOpacity>
            </View>

            {dimensionsError ? <Text style={styles.errorText}>{dimensionsError}</Text> : null}
          </View>

          {/* Weight */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Weight</Text>

            <View style={styles.weightContainer}>
              <View style={[styles.inputWrapper, weightError ? styles.inputError : null]}>
                <Scale size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.unitText}>{weightUnit}</Text>
              </View>

              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[styles.unitButton, weightUnit === 'kg' && styles.unitButtonActive]}
                  onPress={() => setWeightUnit('kg')}
                >
                  <Text style={[styles.unitButtonText, weightUnit === 'kg' && styles.unitButtonTextActive]}>
                    kg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, weightUnit === 'lbs' && styles.unitButtonActive]}
                  onPress={() => setWeightUnit('lbs')}
                >
                  <Text style={[styles.unitButtonText, weightUnit === 'lbs' && styles.unitButtonTextActive]}>
                    lbs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Item Category</Text>
            <Text style={styles.sectionDescription}>
              Select the category that best describes your item
            </Text>

            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive
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
            <Text style={styles.sectionTitle}>Item Value</Text>
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

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next Step</Text>
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
  dimensionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dimensionInput: {
    flex: 1,
    marginRight: 8,
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height:  56,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  unitText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
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
  weightContainer: {
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    margin: 4,
  },
  categoryButtonActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  categoryButtonTextActive: {
    color: '#3B82F6',
  },
  valueContainer: {
    marginBottom: 12,
  },
  currencySelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    marginTop: 12,
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
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});