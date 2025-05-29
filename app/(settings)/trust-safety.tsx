import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ShieldCheck, UserCheck, Lock, AlertTriangle } from 'lucide-react-native';

interface SafetyFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const safetyFeatures: SafetyFeature[] = [
  {
    title: 'User Verification',
    description: 'All users must verify their identity through a multi-step process including government ID verification, phone number verification, and email confirmation.',
    icon: <UserCheck size={24} color="#3B82F6" />,
  },
  {
    title: 'Secure Payments',
    description: 'All payments are processed through our secure payment system with funds held in escrow until successful delivery confirmation.',
    icon: <Lock size={24} color="#3B82F6" />,
  },
  {
    title: 'Insurance Coverage',
    description: 'Items are insured during transit, protecting both senders and carriers from potential loss or damage.',
    icon: <ShieldCheck size={24} color="#3B82F6" />,
  },
  {
    title: 'Dispute Resolution',
    description: 'Our comprehensive dispute resolution system helps resolve any issues that may arise during a transaction.',
    icon: <AlertTriangle size={24} color="#3B82F6" />,
  },
];

const guidelines = [
  'Never share personal contact information outside the app',
  'Always verify item contents before accepting delivery',
  'Document item condition with photos before and after transit',
  'Report suspicious behavior immediately',
  'Follow all local laws and customs regulations',
  'Keep communication within the app for your protection',
  'Never accept cash payments outside the platform',
  'Verify meeting locations are safe and public',
];

export default function TrustSafetyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Safety is Our Priority</Text>
        <Text style={styles.headerText}>
          We've implemented comprehensive safety measures to ensure secure and reliable item delivery for everyone in our community.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Features</Text>
        <View style={styles.featuresContainer}>
          {safetyFeatures.map((feature, index) => (
            <View 
              key={index}
              style={[
                styles.featureCard,
                index === safetyFeatures.length - 1 && styles.lastFeatureCard,
              ]}
            >
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Guidelines</Text>
        <View style={styles.guidelinesContainer}>
          {guidelines.map((guideline, index) => (
            <View 
              key={index}
              style={[
                styles.guidelineItem,
                index === guidelines.length - 1 && styles.lastGuidelineItem,
              ]}
            >
              <View style={styles.bulletPoint} />
              <Text style={styles.guidelineText}>{guideline}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.emergencySection}>
        <Text style={styles.emergencyTitle}>Emergency Contact</Text>
        <Text style={styles.emergencyText}>
          If you ever feel unsafe or encounter an emergency situation, please contact local authorities immediately by dialing your local emergency number.
        </Text>
        <Text style={styles.emergencyNumber}>Emergency: 911</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  headerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  lastFeatureCard: {
    borderBottomWidth: 0,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  guidelinesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastGuidelineItem: {
    marginBottom: 0,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginRight: 12,
  },
  guidelineText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  emergencySection: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
  },
  emergencyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 8,
  },
  emergencyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#991B1B',
    lineHeight: 20,
    marginBottom: 12,
  },
  emergencyNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#EF4444',
  },
}); 