import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Package, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function NewItemStep1() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Error states
  const [itemNameError, setItemNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [pickupCityError, setPickupCityError] = useState('');
  const [deliveryCityError, setDeliveryCityError] = useState('');
  const [photosError, setPhotosError] = useState('');

  const validateItemName = (text: string) => {
    setItemName(text);
    if (text.length < 3) {
      setItemNameError('Item name must be at least 3 characters');
    } else {
      setItemNameError('');
    }
  };

  const validateDescription = (text: string) => {
    setDescription(text);
    if (text.length < 10) {
      setDescriptionError('Please provide a detailed description');
    } else {
      setDescriptionError('');
    }
  };

  const validatePickupCity = (text: string) => {
    setPickupCity(text);
    if (text.length < 2) {
      setPickupCityError('Please enter a valid city');
    } else {
      setPickupCityError('');
    }
  };

  const validateDeliveryCity = (text: string) => {
    setDeliveryCity(text);
    if (text.length < 2) {
      setDeliveryCityError('Please enter a valid city');
    } else {
      setDeliveryCityError('');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setPhotos([...photos, result.assets[0].uri]);
      setPhotosError('');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    let isValid = true;

    if (!itemName) {
      setItemNameError('Item name is required');
      isValid = false;
    }
    if (!description) {
      setDescriptionError('Description is required');
      isValid = false;
    }
    if (!pickupCity) {
      setPickupCityError('Pickup city is required');
      isValid = false;
    }
    if (!deliveryCity) {
      setDeliveryCityError('Delivery city is required');
      isValid = false;
    }
    if (photos.length === 0) {
      setPhotosError('At least one photo is required');
      isValid = false;
    }

    if (isValid) {
      router.push({
        pathname: '/item/new/step-2',
        params: {
          itemName,
          description,
          pickupCity,
          deliveryCity,
          photos: JSON.stringify(photos)
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
        <Text style={styles.title}>Item Details</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 1 of 3</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Item Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Item Name</Text>
            <View style={[styles.inputWrapper, itemNameError ? styles.inputError : null]}>
              <Package size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                placeholderTextColor="#94A3B8"
                value={itemName}
                onChangeText={validateItemName}
              />
            </View>
            {itemNameError ? <Text style={styles.errorText}>{itemNameError}</Text> : null}
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={[styles.textAreaWrapper, descriptionError ? styles.inputError : null]}>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your item in detail"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={validateDescription}
              />
            </View>
            {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
          </View>

          {/* Pickup City */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pickup City</Text>
            <View style={[styles.inputWrapper, pickupCityError ? styles.inputError : null]}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter pickup city"
                placeholderTextColor="#94A3B8"
                value={pickupCity}
                onChangeText={validatePickupCity}
              />
            </View>
            {pickupCityError ? <Text style={styles.errorText}>{pickupCityError}</Text> : null}
          </View>

          {/* Delivery City */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Delivery City</Text>
            <View style={[styles.inputWrapper, deliveryCityError ? styles.inputError : null]}>
              <MapPin size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter delivery city"
                placeholderTextColor="#94A3B8"
                value={deliveryCity}
                onChangeText={validateDeliveryCity}
              />
            </View>
            {deliveryCityError ? <Text style={styles.errorText}>{deliveryCityError}</Text> : null}
          </View>

          {/* Photos */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Photos</Text>
            <Text style={styles.inputDescription}>
              Add clear photos of your item from different angles
            </Text>

            <View style={styles.photosContainer}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {photos.length < 4 && (
                <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                  <Camera size={24} color="#64748B" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </View>
            {photosError ? <Text style={styles.errorText}>{photosError}</Text> : null}
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  inputDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 56,
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
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photoWrapper: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addPhotoButton: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 4,
  },
  addPhotoButtonInner: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
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