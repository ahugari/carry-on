import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';
import { Button } from './ui/Button';
import { supabase } from '@/lib/supabase';

interface ReportModalProps {
  isVisible: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'user' | 'message' | 'trip';
}

const REPORT_REASONS = {
  user: [
    'Suspicious behavior',
    'Harassment',
    'Fake profile',
    'Inappropriate content',
    'Other',
  ],
  message: [
    'Spam',
    'Harassment',
    'Inappropriate content',
    'Scam attempt',
    'Other',
  ],
  trip: [
    'Suspicious listing',
    'Inaccurate information',
    'Prohibited items',
    'Price gouging',
    'Other',
  ],
};

export function ReportModal({ isVisible, onClose, targetId, targetType }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reports').insert({
        target_id: targetId,
        target_type: targetType,
        reason: selectedReason,
        additional_info: additionalInfo,
        reporter_id: supabase.auth.user()?.id,
        status: 'pending',
      });

      if (error) throw error;

      Alert.alert(
        'Report Submitted',
        'Thank you for helping keep our community safe. We will review your report.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Report</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.warningBox}>
              <AlertTriangle size={24} color="#F59E0B" />
              <Text style={styles.warningText}>
                Help us maintain a safe and trustworthy community by reporting any suspicious or inappropriate activity.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Reason for reporting</Text>
            {REPORT_REASONS[targetType].map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonButton,
                  selectedReason === reason && styles.selectedReason,
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    selectedReason === reason && styles.selectedReasonText,
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Additional Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Please provide any additional details that will help us investigate"
              multiline
              numberOfLines={4}
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              textAlignVertical="top"
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button
              variant="outline"
              onPress={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <View style={styles.footerSpacer} />
            <Button
              variant="primary"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={!selectedReason}
            >
              Submit Report
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#92400E',
    marginLeft: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
  },
  reasonButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedReason: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  reasonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
  },
  selectedReasonText: {
    color: '#3B82F6',
    fontFamily: 'Inter-Medium',
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
    height: 120,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerSpacer: {
    width: 12,
  },
}); 