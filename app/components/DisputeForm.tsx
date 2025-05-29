import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, X } from 'lucide-react-native';
import { Button } from './ui/Button';
import { supabase } from '@/lib/supabase';

interface DisputeFormProps {
  tripId: string;
  otherUserId: string;
  onSubmit: () => void;
  onCancel: () => void;
}

interface DisputeCategory {
  id: string;
  name: string;
  description: string;
  severity_level: number;
}

export function DisputeForm({ tripId, otherUserId, onSubmit, onCancel }: DisputeFormProps) {
  const [categories, setCategories] = useState<DisputeCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('dispute_categories')
        .select('*')
        .order('severity_level', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dispute categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        // TODO: Implement image upload to storage
        const imageUrl = result.assets[0].uri;
        setEvidenceUrls((prev) => [...prev, imageUrl]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('disputes').insert({
        reporter_id: user.id,
        reported_id: otherUserId,
        trip_id: tripId,
        category_id: selectedCategory,
        title: title.trim(),
        description: description.trim(),
        evidence_urls: evidenceUrls,
        status: 'open',
      });

      if (error) throw error;

      Alert.alert(
        'Dispute Submitted',
        'Your dispute has been submitted and will be reviewed by our team.',
        [{ text: 'OK', onPress: onSubmit }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit dispute. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Submit a Dispute</Text>

      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief description of the issue"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.sectionTitle}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Provide detailed information about your dispute"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
        textAlignVertical="top"
      />

      <Text style={styles.sectionTitle}>Evidence</Text>
      <View style={styles.evidenceContainer}>
        {evidenceUrls.map((url, index) => (
          <View key={index} style={styles.evidenceItem}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setEvidenceUrls((prev) => prev.filter((_, i) => i !== index))}
            >
              <X size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={handleImagePick}>
          <ImageIcon size={24} color="#64748B" />
          <Text style={styles.addButtonText}>Add Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          variant="outline"
          onPress={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <View style={styles.footerSpacer} />
        <Button
          variant="primary"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!selectedCategory || !title.trim() || !description.trim()}
        >
          Submit Dispute
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  categories: {
    marginBottom: 24,
  },
  categoryButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedCategoryText: {
    color: '#3B82F6',
  },
  categoryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
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
    marginBottom: 24,
  },
  textArea: {
    height: 120,
  },
  evidenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  evidenceItem: {
    width: 100,
    height: 100,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  addButton: {
    width: 100,
    height: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  footerSpacer: {
    width: 12,
  },
}); 